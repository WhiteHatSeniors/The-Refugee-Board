import os
from flask import Flask,jsonify,request
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from flask_migrate import Migrate 
from datetime import datetime
import dataclasses
from dataclasses import dataclass
import json
from json import JSONEncoder
# https://linuxpip.org/object-of-type-is-not-json-serializable/

class CustomEncoder(json.JSONEncoder):
    def default(self, o):
        if dataclasses.is_dataclass(o): # this serializes anything dataclass can handle  
            return dataclasses.asdict(o)
        if isinstance(o, datetime): # this adds support for datetime
            return o.isoformat()
        return super().default(o)

load_dotenv()
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

bcrypt = Bcrypt(app)


app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
# "mysql://root:12345678@localhost/therefugeeboard"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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

# Sign Up
# Creating a new camp
@app.route('/api/post/camp',methods=["POST"])
def createNewCamp():
    # Recieving details of the camp
    camp_details = request.get_json()
    print(camp_details)
    email=camp_details["CampEmail"]
    password=camp_details["password"]
    confirmPassword=camp_details["confirmPassword"]

    user_exists=Camp.query.filter_by(CampEmail=email).first() is not None

    if(user_exists):
        return jsonify({"error": "User already exists"}),409
    
    if(password!=confirmPassword):
        return jsonify({"error": "Passwords not matching"}),401
    
    hashed_password=bcrypt.generate_password_hash(password)

    # Adding it to the database
    new_camp = Camp(CampEmail=camp_details["CampEmail"],
        password=hashed_password,
                    CampName=camp_details["CampName"],
                    CampAddress=camp_details["CampAddress"],
                    )
    print(new_camp)
    db.session.add(new_camp)
    db.session.commit()
        # "data": CustomEncoder().encode(new_camp)
    return json.dumps({
        "data": new_camp,
    },indent=4,cls=CustomEncoder),201

# Adding a refugee
@app.route('/api/post/refugee',methods=["POST"])
@cross_origin()
def createNewRefugee():
    # Recieving details of the refugee
    refugee_details = request.get_json()
    # Creating a new refugee object
    print("Ref details: ",refugee_details)
    new_refugee = Refugee(CampID= 1 
                        #   or refugee_details["CampID"]
                          ,
                            Name = refugee_details["Name"],
                            Gender = refugee_details["Gender"],
                            Age = refugee_details["Age"],
                            CountryOfOrigin = refugee_details["CountryOfOrigin"],
                            Message = refugee_details["Message"])
    db.session.add(new_refugee)
    db.session.commit()
    return jsonify(refugee_details)

# Deleting a refugee
@app.route('/api/delete/refugee/<id>',methods=["DELETE"])
def deleteRefugee(id):
    # Recieving details of the refugee
    # Getting the refugee object from the database
    # Look up the refugeeID in the refugee table
    # refugee_to_delete = db.session.execute(db.select(Refugee).filter_by(Name=refugee_details["Name"])).scalar_one()
    ref = Refugee.query.get(id)
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
    return jsonify(deletedRefugee)

# Deleting a camp
@app.route('/api/delete/camp',methods=["POST"])
def deleteCamp():
    # Recieving details of the camp
    camp_details = request.get_json()
    # Getting the camp object from the database
    camp_to_delete = Camp.query.filter_by(CampID=camp_details["CampID"]).first()
    db.session.delete(camp_to_delete)
    db.session.commit()
    return jsonify(camp_details)

# Getting all the camps
@app.route('/api/get/all/camps',methods=["POST"])
def getAllCamps():
    # Getting all the camps from the database
    camps = Camp.query.all()
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
    return jsonify(camps_list)

# Getting all the refugees
@app.route('/api/get/all/refugees',methods=["GET"])
def getAllRefugees():
    # Getting all the refugees from the database
    refugees = Refugee.query.all()
    # Creating a list of all the refugees
    refugees_list = []
    for refugee in refugees:
        refugee_details = {
            "RefugeeID": refugee.RefugeeID,
            "CampID": refugee.CampID,
            "Name": refugee.Name,
            "Age": refugee.Age,
            "Gender": refugee.Gender,
            "CountryOfOrigin": refugee.CountryOfOrigin,
            "Message": refugee.Message,
            "MessageDate": refugee.MessageDate
        }
        refugees_list.append(refugee_details)
    return jsonify(refugees_list)

# Getting the camp based on the campID
@app.route('/api/get/camp/campID/<campID>',methods=["GET"])
def getCampByCampID(campID):
    # Getting the camp from the database
    camp = Camp.query.filter_by(CampID=campID).first()
    # Creating the camp details
    camp_details = {
        "CampID": camp.CampID,
        "AdminName": camp.AdminName,
        "CampName": camp.CampName,
        "CampAddress": camp.CampAddress,
        "NumberOfRefugees": camp.NumberOfRefugees,
        "created_at": camp.created_at
    }
    return jsonify(camp_details)

# Getting the camp based on the camp name
@app.route('/api/get/camp/campName',methods=["POST"])
def getCampByCampName():
    # Getting the camp from the database
    campName = request.get_json()
    camp = Camp.query.filter_by(CampName=campName["CampName"]).first()
    # Creating the camp details
    camp_details = {
        "CampID": camp.CampID,
        "AdminName": camp.AdminName,
        "CampName": camp.CampName,
        "CampAddress": camp.CampAddress,
        "NumberOfRefugees": camp.NumberOfRefugees,
        "created_at": camp.created_at
    }
    return jsonify(camp_details)
    
# Dummy method to add all the data to the camp table
@app.route('/api/post/camp/all',methods=["POST"])
def addAllCamps():
    # return {"Not allowed":"Not allowed"}
    camps = request.get_json()
    for camp in camps:
        new_camp = Camp(AdminName=camp["AdminName"],
                    CampName=camp["CampName"],
                    CampAddress=camp["CampAddress"],
                    NumberOfRefugees=camp["NumberOfRefugees"])
    
        db.session.add(new_camp)
        db.session.commit()
    return jsonify(camps)

# Dummy method to add all the data to the refugee table
@app.route('/api/post/refugee/all',methods=["POST"])
@cross_origin()
def addAllRefugees():
    # return {"Not allowed":"Not allowed"}
    refugees = request.get_json()
    print(refugees)
    for refugee in refugees:
        new_refugee = Refugee(CampID= 1, #   or refugee_details["CampID"]
                            Name = refugee["Name"],
                            Gender = refugee["Gender"],
                            Age = refugee["Age"],
                            CountryOfOrigin = refugee["CountryOfOrigin"],
                            Message = refugee["Message"])
        db.session.add(new_refugee)
        db.session.commit()
    return jsonify(refugees)

# Updating a refugees details
@app.route('/api/update/refugee',methods=["POST"])
def updateRefugee():
    # Recieving details of the refugee
    refugee = Refugee.query.get_or_404(request.form["RefugeeID"])

    if request.method == 'POST':
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