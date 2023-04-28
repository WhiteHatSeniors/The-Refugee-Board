# 8 total endpoints
from app.camp_endpoints import bp
from flask_mail import Message
from app.extensions import db, validate_password, bcrypt, mail
from flask import jsonify, request, session
from app.models.camp import Camp
from validate_email import validate_email  
from sqlalchemy import or_, and_

# Test Route

# @bp.route('/c')
# def index():
#     return "Hello from Camps!"


# Creating a new camp -  Sign Up
@bp.route('/api/register',methods=["POST"])
def createNewCamp():
    # Recieving details of the camp
    camp_details = request.get_json()

    email=camp_details.get("CampEmail")
    password=camp_details.get("password")
    confirmPassword=camp_details.get("ConfirmPassword")
    address=camp_details.get("CampAddress")
    camp_name=camp_details.get("CampName")

    # Checking if the user exists
    user_exists=Camp.query.filter_by(CampEmail=email.strip()).first() is not None
    if user_exists:
        return jsonify({"error": "User already exists"}),409
   
        # 409- (Conflict) indicates that the request could not be processed because of conflict in the request
    print(address, camp_name)
    if not camp_name and not camp_name.strip():
        return jsonify({"error": "Camp name has to be entered"}),401
    elif not address and not address.strip():
        return jsonify({"error": "Address has to be entered"}),401
    if address and camp_name:
        address_name_exists=Camp.query.filter_by(CampAddress=address.strip(), CampName=camp_name.strip()).first() is not None
        if address_name_exists:
            return jsonify({"error": "User already exists"}),409
   
    # Validating user password
    if not password.strip():
         return jsonify({"error": "Passwords cannot be empty"}),401
    if password != confirmPassword:
        return jsonify({"error": "Passwords not matching"}),401
    if not validate_password(password): # Peek the definition of this function for password constraints
        return jsonify({"error": "Invaid password pattern."}),401
    
     # Validating user email
    is_valid = validate_email(email) 
    if not is_valid:  
        return jsonify({"error": "Invalid Email ID"}),401
        # 401 Unauthorized response status code indicates that the client request has not been completed because it lacks valid authentication credentials


    # Hashing the password
    hashed_password=bcrypt.generate_password_hash(password)

    # Adding it to the database
    new_camp = Camp(CampEmail=email,
                    password=hashed_password,
                    CampName=camp_name,
                    CampAddress=address,
                )
    db.session.add(new_camp)
    db.session.commit()

    # ------------------------------------

    # Option 1: Plain text
    subject = "You're registered. @therefugeeboard"
    body = "Your registeration was accepted!\nLogin here http://localhost:3000/login to get started with your entries"
    
    # # Create the plain-text and HTML version of your message
    text = "Subject:" + subject + "\n" + body
    html = """<html>
    <body>
        <h2>Your registeration was accepted!</h2>
        <p><em><a href="http://localhost:3000/login">Login here</a></em> to get started with your entries</p>
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

    # ------------------------------------

    # No need of Custom JSON encoder for this
    return jsonify({
        "data": new_camp,
    }),201

    # Alternative:
    # return json.dumps({
    #     "data": new_camp,
    # },indent=4,cls=CustomEncoder),201

    # return jsonify({"data":new_camp.__dict__})-> TypeError: Object of type InstanceState is not JSON serializable

# Verifying a camp
@bp.route('/api/patch/camp/verify/<id>',methods=["PATCH"])
def verifyCamp(id):
    # You need to be logged in as the superuser to verify a camp (??)

    # Fetching the camp from the database
    camp = Camp.query.get_or_404(id) # Automatically sends a 404 if not found

    # Setting the camp as verified
    camp.verified = True

    # Committing the changes to the database
    db.session.add(camp)
    db.session.commit()

    # Returning the camp details
    return jsonify({"data": camp}),200

# Deleting a camp -> Deleting an account
@bp.route('/api/delete/camp/<id>',methods=["DELETE"])
def deleteCamp(id):
    # Getting the camp object from the database
    if not session.get("user_id") and not session.get("admin_id"):
        return jsonify({"error": "Not authorized to delete the camp"}),401

    print(id)
    camp_to_delete = Camp.query.filter_by(CampID=id).first()
    print(camp_to_delete,id)
    # Checking if the camp exists
    if camp_to_delete is None:
        return jsonify({"error": "Camp not found"}),404
    
    camp_details = {
            "CampID": camp_to_delete.CampID,
            "CampName": camp_to_delete.CampName,
            "CampAddress": camp_to_delete.CampAddress,
            "NumberOfRefugees": camp_to_delete.NumberOfRefugees,
            "created_at": camp_to_delete.created_at
    }
    db.session.delete(camp_to_delete)
    db.session.commit()

    # ------------------------------------


    # Option 1: Plain text
    subject = "Camp deleted. @therefugeeboard"
    body = "Your camp was deleted.\Register here http://localhost:3000/signup to create a camp"
    # message = "Subject:" + subject + "\n" + body

    # Create the plain-text and HTML version of your message
    text = "Subject:" + subject + "\n" + body
    html = """<html>
    <body>
        <h2>Your camp was deleted.</h2>
        <p><em><a href="http://localhost:3000/signup">Register here</a></em> to create a camp</p>
    </body>
    </html>
    """

    msg = Message()
    msg.subject = subject
    msg.recipients = [camp_to_delete.CampEmail]
    # msg.sender = os.environ.get('EMAIL')
    msg.body = text
    msg.html = html
    mail.send(msg)

    # ------------------------------------
    if session.get("user_id"):
        session.pop("user_id")
    return jsonify({"data": camp_details}),204

# Getting all the camps
@bp.route('/api/get/all/camps',methods=["GET"])
def getAllCamps():
    # Getting all the camps from the database
    camps = Camp.query.all()

    # Checking if no camps were found
    if camps is None:
        return jsonify({"error": "No camps found"}),404
    # Creating a list of all the camps
    camps_list = []
    for camp in camps:
        camp_details = {
            "CampID": camp.CampID,
            "CampName": camp.CampName,
            "CampAddress": camp.CampAddress,
            "NumberOfRefugees": camp.NumberOfRefugees,
            "created_at": camp.created_at,
            "Verified": camp.Verified,
        }
        camps_list.append(camp_details)
    
    return jsonify(camps_list),200

# Getting the camp based on the campID or campName
@bp.route('/api/get/camp',methods=["GET"])
def getCamp():
    '''NOTE: This method prioritizes the campID over the campName'''
    # Getting the campID or campName from the request
    args = request.args
    campID = args.get("campID")
    if campID is None:
        # Find camp by its name
        campName = args.get("campName")
        if campName is None:
            return jsonify({"error": "Camp not found, No parameters were given"}),404
        camp = Camp.query.filter_by(CampName=campName).first()
    else:
        # Find camp by its ID
        camp = Camp.query.filter_by(CampID=campID).first()
    
    # If camp doesn't exist
    if camp is None:
        return jsonify({"error": "Camp not found"}),404
    
    # Creating the camp details
    camp_details = {
        "CampID": camp.CampID,
        "CampName": camp.CampName,
        "CampEmail":camp.CampEmail,
        "CampAddress": camp.CampAddress,
        "NumberOfRefugees": camp.NumberOfRefugees,
        "created_at": camp.created_at
    }
    return jsonify(camp_details),200
 
# Dummy method to add all the data to the camp table
@bp.route('/api/post/camp/all',methods=["POST"])
def addAllCamps():
    # return {"Not allowed":"Not allowed"}
    camps = request.get_json()
    for camp in camps:
        new_camp = Camp(CampEmail=camp["CampEmail"],
                    CampName=camp["CampName"],
                    password = camp["password"],
                    CampAddress=camp["CampAddress"],
                    )
        db.session.add(new_camp)
        db.session.commit()
    return jsonify(camps)

# Updating a Camp details
@bp.route('/api/patch/camp',methods=["PATCH"])
def updateCamp():

    # You need to be logged in to update a refugee entry
    id = session.get("user_id")
    if not id:
        return jsonify({"error": "Not logged in"}), 403
    
    # The HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it
    
    # Recieving details of the refugee
    updatedDetails = request.get_json() # Expecting a JSON object with the RefugeeID and ALL the updated details.
    # refugee = Refugee.query.filter_by(RefugeeID=id).first() 
    # refugee = Refugee.query.get_or_404(updatedDetails["RefugeeID"]) # Automatically sends a 404 if not found

    password=updatedDetails.get("password")
    confirmPassword=updatedDetails.get("ConfirmPassword")

    camp = Camp.query.get_or_404(id) # Automatically sends a 404 if not found
    print('UPDATE ', camp)
    
    # Checking if the logged in camp representative is allowed to update the refugee
    # Checking if the refugee belongs to the same camp as the logged in camp representative.
    if camp.CampID != id:
        return jsonify({"error": "You are not allowed to update this refugee"}), 403

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
            
            session.pop("user_id")
            return jsonify({"data": camp}),200
        else:
        # Some other method was used
            return jsonify({"error": "Method not allowed"}),405


    camp_name= updatedDetails.get('CampName')
    address= updatedDetails.get('CampAddress')

    if not camp_name and not camp_name.strip():
        return jsonify({"error": "Camp name has to be entered"}),400
    elif not address and not address.strip():
        return jsonify({"error": "Address has to be entered"}),400
    if address and camp_name:
        address_name_exists=Camp.query.filter_by(CampAddress=address.strip(), CampName=camp_name.strip()).first() is not None
        if address_name_exists:
            return jsonify({"error": "User already exists"}),409

    if request.method == 'PATCH':
        # Updating the refugee
        camp.CampName = updatedDetails['CampName']
        camp.CampAddress = updatedDetails['CampAddress']

        db.session.add(camp) # SQL Alchemy will update if it exists.
        db.session.commit()

        return jsonify({"data": camp}),200
    else:
        # Some other method was used
        return jsonify({"error": "Method not allowed"}),405
   
@bp.route('/api/get/camps',methods=["GET"])
def getCampsSearch():

    if not session.get("admin_id"):
        return jsonify({"error": "Not logged in"}), 403
    
    args = request.args
    id= str(session.get("admin_id"))
    searchQuery = args.get("SearchQuery").strip()

    if searchQuery:
        camps = Camp.query.filter(
            and_(or_(Camp.CampName.like(f"%{searchQuery}%"),
                 Camp.CampAddress.like(f"%{searchQuery}%"),
                 Camp.CampEmail.like(f"%{searchQuery}%"),
            ))
            ).order_by(Camp.created_at.desc()).all()
    else:
       camps = Camp.query.all()

    if camps is None or len(camps) == 0:
        print("LLOOLOLOL" ,camps)
        return jsonify({"error": "No camps found"}),404

    camps_list = []
    for camp in camps:
        camp_details = {
            "CampID": camp.CampID,
            "CampName": camp.CampName,
            "CampAddress": camp.CampAddress,
            "CampEmail": camp.CampEmail,
            "NumberOfRefugees": camp.NumberOfRefugees,
            "created_at": camp.created_at,
            "verified": camp.verified,
        }
        camps_list.append(camp_details)
    
    return jsonify({"data":camps_list}),200
 