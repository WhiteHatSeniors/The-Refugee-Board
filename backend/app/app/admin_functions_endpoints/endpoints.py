# 9 total endpoints
from app.admin_functions_endpoints import bp
from app.extensions import r, bcrypt, mail
import uuid
from flask import jsonify, request, make_response, session
from flask_mail import Message
from app.models.camp import Camp
from app.extensions import db, validate_password
import os
# Test Route

# @bp.route('/a')
# def index():
#     return "Hello from Admins!"


# Log In -> Camp Admin loggging in
@bp.route('/api/login',methods=["POST"])
def login():
    # Recieving details of the camp logging in
    email=request.json["CampEmail"]
    print(request.json, "Hi")
    password=request.json["password"]

    # NOTE: Not being specific about errors to make it more secure and prevent brute force attacks

    # Checking if the user exists
    user=Camp.query.filter_by(CampEmail=email).first()
    if user is None:
        return jsonify({"error": "Invalid Email/Password"}),401 
    
    # Checking if the password matches
    if not bcrypt.check_password_hash(user.password,password):
        return jsonify({"error": "Invalid Email/Password"}),401
    
    # Checking if the camp is verified
    # if not user.verified:
    #     return jsonify({"error": "Camp not verified yet"}),401
    
    # Yet to decide on whether to implement this
    # if session.get("user_id"):
    #     return jsonify({"msg":"Login not possible as a user is already logged in"}),404

    # print(user,user.CampID)
    session["user_id"]=user.CampID
    print(session)

    # No need of Custom JSON encoder for this
    return jsonify({
        "data": user
    })

# Log out functionality for the camp admin
@bp.route("/api/logout", methods=["POST"])
def logout_user():
    if not session.get("user_id"):
        return jsonify({"msg":"Not logged in, logout not possible"}),404
    session.pop("user_id")
    resp=make_response("Cookie removed")
    cookie_val=request.cookies.get('session')
    resp.delete_cookie("session")
    resp.set_cookie('session', expires=0)
    return jsonify({"msg":"Succesfully logged out"}),200

# Getting the user id if logged in
@bp.route("/api/getId", methods=["GET"])
def get_id():
    print(session ,session.get("user_id"))
    if not session.get("user_id"):
        return jsonify({"id": None}),200
    return jsonify({"id": session.get("user_id")}),200

@bp.route('/api/forgotpw', methods=['POST'])
def forgotPassword():

    if session.get("user_id"):
        return {"error":"User already logged in"},400
    
    hash=uuid.uuid4().hex

    email=request.json["email"]
    camp=Camp.query.filter_by(CampEmail=email).first()
    if not camp:
        return jsonify({"error": "No account with the entered email exists"}),400

    r.set(hash, email)
    r.expire(hash, 5*60) #The key will expire after 5 minutes
    print(r.get(hash))
    subject = "Reset Password. @therefugeeboard"
    body = f"Reset your password here http://localhost:3000/reset-password/{hash} to login to your account"
    
    # # Create the plain-text and HTML version of your message
    text = "Subject:" + subject + "\n" + body
    html = f"""<html>
    <body>
        <h2>Change your password now.</h2>
        <p><em><a href="http://localhost:3000/reset-password/{hash}">Reset your password here</a></em> to login to your account</p>
        <h4>If this wasn't you, you can safely ignore the email</h4>
    </body>
    </html>
    """

    msg = Message()
    msg.subject = subject
    msg.recipients = [email]
    # msg.sender = os.environ.get('EMAIL')
    msg.body = text
    msg.html = html
    mail.send(msg)


    return jsonify({'data': 'Email sent!'}), 200

@bp.route('/api/reset/<hash>', methods=['PATCH'])
def resetPassword(hash):

    id = session.get("user_id")
    if id:
        return {"error":"User already logged in"},400
    
    if not r.exists(hash):
        return jsonify({'error':'Invalid URL'}),400
    
    # Recieving details of the refugee
    updatedDetails = request.get_json() # Expecting a JSON object with the RefugeeID and ALL the updated details.
    # refugee = Refugee.query.filter_by(RefugeeID=id).first() 
    # refugee = Refugee.query.get_or_404(updatedDetails["RefugeeID"]) # Automatically sends a 404 if not found

    password=updatedDetails.get("password")
    confirmPassword=updatedDetails.get("ConfirmPassword")

    email = r.get(hash)
    camp = Camp.query.filter_by(CampEmail=email).first() # Automatically sends a 404 if not found
    print('UPDATE ', camp)
    

    # You can either edit passwords or edit camp details; not both hence the if blocks
    if password is not None and confirmPassword is not None:
        if not password.strip():
            return jsonify({"error": "Passwords cannot be empty"}),401
        if password != confirmPassword:
            return jsonify({"error": "Passwords not matching"}),401
        if not validate_password(password):
            return jsonify({"error": "Invaid password pattern."}),401
        
        hashed_password=bcrypt.generate_password_hash(password)
        if request.method == 'PATCH':
        # Updating the refugee
            camp.password = hashed_password

            db.session.add(camp) # SQL Alchemy will update if it exists.
            db.session.commit()

            r.delete(hash)

            subject = "Password reset successful. @therefugeeboard"
            body = "Your camp account password was reset.\Login here http://localhost:3000/login with the new credentials"
            # message = "Subject:" + subject + "\n" + body

            # Create the plain-text and HTML version of your message
            text = "Subject:" + subject + "\n" + body
            html = """<html>
            <body>
                <h2>Your camp account password was reset.</h2>
                <p><em><a href="http://localhost:3000/login">Login here</a></em> with the new credentials</p>
            </body>
            </html>
            """

            msg = Message()
            msg.subject = subject
            msg.recipients = [email.CampEmail]
            # msg.sender = os.environ.get('EMAIL')
            msg.body = text
            msg.html = html
            mail.send(msg)


            return jsonify({"data": camp}),200
        else:
        # Some other method was used
            return jsonify({"error": "Method not allowed"}),405
    
@bp.route('/api/admin-login',methods=["POST"])
def adminLogin():

    if session.get("admin_id"):
        return jsonify({"error":"Admin is already logged in"}),401

    username=request.json["username"]
    # print(request.json, "Hi")
    password=request.json["password"]

    if not username.strip() or not password.strip():
        return jsonify({"error": "Username and Password cannot be empty"}),401 
    # NOTE: Not being specific about errors to make it more secure and prevent brute force attacks
    print(os.environ.get('ADMIN_USERNAME'))
    print("PASSWORD ",os.environ.get('ADMIN_PASSWORD'))
    if not username==os.environ.get('ADMIN_USERNAME'):
        return jsonify({"error": "Invalid Username/Password"}),401 
    
    if not password==os.environ.get('ADMIN_PASSWORD'):
        return jsonify({"error": "Invalid Username/Password"}),401    
    
    print(session)
    
    session["admin_id"]=username;
    return jsonify({"data": username}),200

# Log out functionality for the camp admin
@bp.route("/api/admin-logout", methods=["POST"])
def adminLogout():
    if not session.get("admin_id"):
        return jsonify({"error":"Not logged in, logout not possible"}),401
    
    session.pop("admin_id")
    return jsonify({"error":"Succesfully logged out"}),200

@bp.route("/api/admin-verify", methods=["PATCH"])
def adminVerified():
    if not session.get("admin_id"):
        return jsonify({"error":"Not logged in"}),401
    
    id=request.json.get("id")
    
    if not id:
        return jsonify({"error":"Camp doesnt exist"}),404

    camp = Camp.query.get_or_404(id) 
    
    if not camp:
        return jsonify({"error":"Camp doesnt exist"}),404

    if request.method == 'PATCH':
        # Updating the refugee
        camp.verified=1;

        db.session.add(camp) # SQL Alchemy will update if it exists.
        db.session.commit()

        return jsonify({"data": camp}),200
    else:
        # Some other method was used
        return jsonify({"error": "Method not allowed"}),405

@bp.route("/api/getAdminId", methods=["GET"])
def get_admin_id():
    print(session ,session.get("admin_id"))
    if not session.get("admin_id"):
        return jsonify({"id": None}),200
    return jsonify({"id": session.get("admin_id")}),200
