import os
import re
import redis
import dataclasses
from flask import Flask,jsonify,request,session #client side session storing sessionID
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from flask_migrate import Migrate 
from datetime import datetime
from dataclasses import dataclass
from validate_email import validate_email  
from flask_session import Session #server side session

#Note: USE THIS ONLY WHEN return jsonify isnt working. Use this as custom encoder with json.dumps()
# import json
# from json import JSONEncoder
# https://linuxpip.org/object-of-type-is-not-json-serializable/

# class CustomEncoder(json.JSONEncoder):
#     def default(self, o):
#         if dataclasses.is_dataclass(o): # this serializes anything dataclass can handle  
#             return dataclasses.asdict(o)
#         if isinstance(o, datetime): # this adds support for datetime
#             return o.isoformat()
#         return super().default(o)

load_dotenv()
app = Flask(__name__)
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SESSION_TYPE']="redis"
app.config['SESSION_PERMANENT']=False
app.config['SESSION_REDIS']=redis.from_url("redis://127.0.0.1:6379")
app.config['SESSION_USE_SIGNER']=True
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None"

bcrypt = Bcrypt(app)
# app.secret_key = os.environ.get('SECRET_KEY')
CORS(app, supports_credentials=True)
# app.config['CORS_HEADERS'] = 'Content-Type'


server_session=Session(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# migrate = Migrate(app, db) WHYYY?


# Models

# CampDetails
@dataclass
class Camp(db.Model):
    CampID: int = db.Column(db.Integer, primary_key=True, unique=True)
    CampEmail: str = db.Column(db.String(90),nullable=False)
    password: str=db.Column(db.Text, nullable=False)
    CampName: str = db.Column(db.String(90),nullable=False)
    CampAddress: str = db.Column(db.String(90),nullable=False)
    NumberOfRefugees: int = db.Column(db.Integer, default=0)
    created_at: datetime = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    refugees = relationship("Refugee",cascade="all, delete-orphan") # On Delete Cascade

    def __repr__(self):
         return f'<Camp Details {self.CampName}>'
    
# RefugeeBoard
@dataclass
class Refugee(db.Model):
    # Photo?
    RefugeeID: int = db.Column(db.Integer, primary_key=True, unique=True)
    CampID: str= db.Column(db.Integer, db.ForeignKey('camp.CampID'))
    Name: str = db.Column(db.String(140))
    Gender: str = db.Column(db.String(15))
    Age: int = db.Column(db.Integer)
    CountryOfOrigin: str = db.Column(db.String(50))
    MessageDate: datetime = db.Column(db.DateTime(timezone=True), server_default=func.now())
    Message: str = db.Column(db.String(1000))

    

    def __repr__(self):
        return f'<Refugee Board {self.Name}>'

with app.app_context():  
    db.create_all()

def validate_password(password):

    # Password checker
    # Primary conditions for password validation:
    # Minimum 8 characters.
    # The alphabet must be between [a-z]
    # At least one alphabet should be of Upper Case [A-Z]
    # At least 1 number or digit between [0-9].
    # At least 1 character from [ _ or @ or $ ]. 

    if len(password) < 8 or re.search("\s" , password):  
        return False  
    if not (re.search("[a-z]", password) and re.search("[A-Z]", password) and re.search("[0-9]", password) ):
        return False  
    return True  
  

# Creating a new camp -  Sign Up
@app.route('/api/register',methods=["POST"])
def createNewCamp():
    # Recieving details of the camp
    camp_details = request.get_json()

    email=camp_details["CampEmail"]
    password=camp_details["password"]
    confirmPassword=camp_details["confirmPassword"]
    # confirmPassword=camp_details["CampAddress"]
    # confirmPassword=camp_details["CampName"]

    # Checking if the user exists
    user_exists=Camp.query.filter_by(CampEmail=email).first() is not None
    if user_exists:
        return jsonify({"error": "User already exists"}),409
        # 409- (Conflict) indicates that the request could not be processed because of conflict in the request

    # Validating user email
    is_valid = validate_email(email) 
    if not is_valid:  
        return jsonify({"error": "Invalid Email ID"}),401
        # 401 Unauthorized response status code indicates that the client request has not been completed because it lacks valid authentication credentials

    # Validating user password
    if password != confirmPassword:
        return jsonify({"error": "Passwords not matching"}),401
    if not validate_password(password): # Peek the definition of this function for password constraints
        return jsonify({"error": "Invaid password pattern."}),401

    # Hashing the password
    hashed_password=bcrypt.generate_password_hash(password)

    # Adding it to the database
    new_camp = Camp(CampEmail=camp_details["CampEmail"],
                    password=hashed_password,
                    CampName=camp_details["CampName"],
                    CampAddress=camp_details["CampAddress"],
                )
    db.session.add(new_camp)
    db.session.commit()

    # No need of Custom JSON encoder for this
    return jsonify({
        "data": new_camp,
    }),201

    # Alternative:
    # return json.dumps({
    #     "data": new_camp,
    # },indent=4,cls=CustomEncoder),201

    # return jsonify({"data":new_camp.__dict__})-> TypeError: Object of type InstanceState is not JSON serializable


# Log In -> Camp Admin loggging in
@app.route('/api/login',methods=["POST"])
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
    
    
    # Yet to decide on whether to implement this
    # if session.get("user_id"):
    #     return jsonify({"msg":"Login not possible as a user is already logged in"}),404

    # print(user,user.CampID)
    session["user_id"]=user.CampID
    print(session)

    # No need of Custom JSON encoder for this
    return jsonify({
        "data": user,
    })


# Log out functionality for the camp admin
@app.route("/api/logout", methods=["POST"])
def logout_user():
    if not session.get("user_id"):
        return jsonify({"msg":"Not logged in, logout not possible"}),404
    session.pop("user_id")
    return jsonify({"msg":"Succesfully logged out"}),200


# Getting the user id if logged in
@app.route("/api/getId", methods=["GET"])
def get_id():
    if not session.get("user_id"):
        return jsonify({"id": None}),404
    return jsonify({"id": session.get("user_id")}),200

# Adding a refugee
@app.route('/api/post/refugee',methods=["POST"])
def createNewRefugee():
    # Recieving details of the refugee
    print(session, session.get("user_id"), "hfgdfgd")
    if not session.get("user_id"):
        return jsonify({"error": "Not logged in"}), 403
    
    # The HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it
    logged_in_camp=Camp.query.filter_by(CampID=session.get("user_id")).first()
    refugee_details = request.get_json()
    # Creating a new refugee object
    print("Ref details: ",refugee_details)
    id=session.get("user_id");
    new_refugee = Refugee(CampID= id
                        #   or refugee_details["CampID"]
                          ,
                            Name = refugee_details["Name"],
                            Gender = refugee_details["Gender"],
                            Age = refugee_details["Age"],
                            CountryOfOrigin = refugee_details["CountryOfOrigin"],
                            Message = refugee_details["Message"],
                            # CampName=logged_in_camp.CampName,
                            # CampAddress=logged_in_camp.CampAddress
                            )
    db.session.add(new_refugee)
    # print(new_refugee.MessageDate)
    db.session.commit()
    ref_info={
            'CampID' : id,
            'Name'  :  new_refugee.Name,
            'Gender'  :  new_refugee.Gender,
            'Age'  :  new_refugee.Age,
            'CountryOfOrigin'  :  new_refugee.CountryOfOrigin,
            'Message'  :  new_refugee.Message,
            'MessageDate'  :  new_refugee.MessageDate,
            'CampName' : logged_in_camp.CampName,
            'CampAddress' : logged_in_camp.CampAddress
    }

    print("REF:: " ,ref_info)
    return jsonify({"data": ref_info }),201

# Deleting a refugee
@app.route('/api/delete/refugee/<id>',methods=["DELETE"])
def deleteRefugee(id):
    # Recieving details of the refugee
    # Getting the refugee object from the database
    # Look up the refugeeID in the refugee table
    
    # You need to be logged in to delete a refugee
    if not session.get("user_id"):
        return jsonify({"error": "Not logged in"}), 403
    
    ref = Refugee.query.get(id)
    # If the refugee doesn't exist
    if ref is None:
        return jsonify({"error": "Refugee not found"}),404
    
    # Checking if the refugee belongs to the camp logged in
    if ref.CampID != session.get("user_id"):
        return jsonify({"error": "Refugee doesn't belong to the camp logged in."}),404
    
    db.session.delete(ref)
    deletedRefugee = {
        "RefugeeID": ref.RefugeeID,
        "CampID": ref.CampID,
        "Name": ref.Name,
        "Age": ref.Age,
        "Gender": ref.Gender,
        "CountryOfOrigin": ref.CountryOfOrigin,
        "Message": ref.Message,
        "MessageDate": ref.MessageDate
    }
    db.session.commit()
    return jsonify({
        "data": ref
    }),204


# Deleting a camp -> Deleting an account
@app.route('/api/delete/camp/<id>',methods=["DELETE"])
def deleteCamp():
    # Getting the camp object from the database
    camp_to_delete = Camp.query.filter_by(CampID=id).first()

    # Checking if the camp exists
    if camp_to_delete is None:
        return jsonify({"error": "Camp not found"}),404
    
    camp_details = {
            "CampID": camp_to_delete.CampID,
            "AdminName": camp_to_delete.AdminName,
            "CampName": camp_to_delete.CampName,
            "CampAddress": camp_to_delete.CampAddress,
            "NumberOfRefugees": camp_to_delete.NumberOfRefugees,
            "created_at": camp_to_delete.created_at
    }
    db.session.delete(camp_to_delete)
    db.session.commit()
    return jsonify(camp_to_delete),204

# Getting all the camps
@app.route('/api/get/all/camps',methods=["GET"])
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
            "AdminName": camp.AdminName,
            "CampName": camp.CampName,
            "CampAddress": camp.CampAddress,
            "NumberOfRefugees": camp.NumberOfRefugees,
            "created_at": camp.created_at
        }
        camps_list.append(camp_details)
    
    return jsonify(camps_list),200

# Getting all the refugees
@app.route('/api/get/all/refugees',methods=["GET"])
def getAllRefugees():
    # Getting all the refugees from the database
    refugees = Refugee.query.all()

    # Checking if no refugees were found
    if refugees is None:
        return jsonify({"error": "No refugees found"}),404
    
    logged_in_camp=Camp.query.filter_by(CampID=session.get("user_id")).first()
    # Creating a list of all the refugees
    refugees_list = []
    for refugee in refugees:
        ref_camp=Camp.query.filter_by(CampID=refugee.CampID).first()
        refugee_details = {
            "RefugeeID": refugee.RefugeeID,
            "CampID": refugee.CampID,
            "Name": refugee.Name,
            "Age": refugee.Age,
            "Gender": refugee.Gender,
            "CountryOfOrigin": refugee.CountryOfOrigin,
            "Message": refugee.Message,
            "MessageDate": refugee.MessageDate,
            'CampName' : ref_camp.CampName,
            'CampAddress' : ref_camp.CampAddress
        }
        refugees_list.append(refugee_details)
    return jsonify(refugees_list)

# Getting refugees based on the Name, CountryOfOrigin or CampID
@app.route('/api/get/refugees',methods=["GET"])
def getRefugees():
    args = request.args
    country = args.get("CountryOfOrigin")
    campID = args.get("CampID")
    name = args.get("Name")

    if name is None:
        if country is None and campID is None:
            return jsonify({"error": "No parameters were given"}),400
        elif country is None:
            # Find refugees from a single camp
            refugees = Refugee.query.filter_by(CampID=campID).order_by(Refugee.MessageDate.desc()).all()
        elif campID is None:
            # Find refugees from a single country
            refugees = Refugee.query.filter_by(CountryOfOrigin=country).order_by(Refugee.MessageDate.desc()).all()
        else:
            # Find refugees from a single camp and country
            refugees = Refugee.query.filter_by(CampID=campID,CountryOfOrigin=country).order_by(Refugee.MessageDate.desc()).all()
    else:
        if country is None and campID is None:
            # Find refugees LIKE name
            refugees = Refugee.query.filter(Refugee.Name.like(f"%{name}%")).order_by(Refugee.MessageDate.desc()).all()
        elif country is None:
            # Find refugees with LIKE name from a single camp
            refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.CampID==campID)).order_by(Refugee.MessageDate.desc()).all()
        elif campID is None:
            # Find refugees with LIKE name from a single country
            refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.CountryOfOrigin==country)).order_by(Refugee.MessageDate.desc()).all()
        else:
            # Find refugees with a LIKE name from a single camp and country
            refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.CampID==campID,Refugee.CountryOfOrigin==country)).order_by(Refugee.MessageDate.desc()).all()
    
    # Checking if no refugees were found
    if len(refugees) == 0:
        return jsonify({"error": "No refugees found"}),404
    
    
    # Creating a list of all the refugees
    refugees_list = []
    for refugee in refugees:
        ref_camp=Camp.query.filter_by(CampID=refugee.CampID).first()
        refugee_details = {
            "RefugeeID": refugee.RefugeeID,
            "CampID": refugee.CampID,
            "Name": refugee.Name,
            "Gender": refugee.Gender,
            "Age": refugee.Age,
            "CountryOfOrigin": refugee.CountryOfOrigin,
            "Message": refugee.Message,
            "MessageDate": refugee.MessageDate,
            'CampName' : ref_camp.CampName,
            'CampAddress' : ref_camp.CampAddress
        }
        refugees_list.append(refugee_details)
    
    return jsonify(refugees_list),200


# Getting the camp based on the campID or campName
@app.route('/api/get/camp',methods=["GET"])
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
        "CampAddress": camp.CampAddress,
        "NumberOfRefugees": camp.NumberOfRefugees,
        "created_at": camp.created_at
    }
    return jsonify(camp_details),200

 
# Dummy method to add all the data to the camp table
@app.route('/api/post/camp/all',methods=["POST"])
def addAllCamps():
    # return {"Not allowed":"Not allowed"}
    camps = request.get_json()
    for camp in camps:
        new_camp = Camp(CampEmail=camp["CampEmail"],
                    CampName=camp["CampName"],
                    password = camp["password"],
                    CampAddress=camp["CampAddress"],
                    NumberOfRefugees=camp["NumberOfRefugees"]
                    )
        db.session.add(new_camp)
        db.session.commit()
    return jsonify(camps)

# Dummy method to add all the data to the refugee table
@app.route('/api/post/refugee/all',methods=["POST"])
def addAllRefugees():
    # return {"Not allowed":"Not allowed"}
    refugees = request.get_json()
    print(refugees)
    for refugee in refugees:
        new_refugee = Refugee(CampID= refugee["CampID"],
                            Name = refugee["Name"],
                            Gender = refugee["Gender"],
                            Age = refugee["Age"],
                            CountryOfOrigin = refugee["CountryOfOrigin"],
                            Message = refugee["Message"])
        db.session.add(new_refugee)
        db.session.commit()
    return jsonify(refugees)

# Updating a refugees details
@app.route('/api/update/refugee',methods=["PATCH"])
def updateRefugee():
    #### NEEDS REWORKING
    # Recieving details of the refugee
    refugee = Refugee.query.get_or_404(request.form["RefugeeID"])

    if request.method == 'PATCH':
        refugee.Name = request.form['Name']
        refugee.Gender = request.form['Gender']
        refugee.CountryOfOrigin = request.form['CountryOfOrigin']
        refugee.Age = int(request.form['Age'])
        refugee.Message = request.form['Message']
        refugee.MessageDate = datetime.now()

        db.session.add(refugee)
        db.session.commit()

        return jsonify({"RefugeeID": refugee.RefugeeID, "Success":"Thumbs up"})

# Running the app
if(__name__=="__main__"):
    app.run(debug=True)