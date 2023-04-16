import os
from flask import Flask,jsonify,request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from flask_migrate import Migrate 

# load_dotenv()
app = Flask(__name__)
CORS(app)

SECRET_KEY = os.environ.get('SECRET_KEY')
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:12345678@localhost/therefugeeboard"
SQLALCHEMY_TRACK_MODIFICATIONS = False

db = SQLAlchemy(app)

# migrate = Migrate(app, db) WHYYY?


# Models

# CampDetails
class Camp(db.Model):
    CampID = db.Column(db.Integer, primary_key=True)
    AdminName = db.Column(db.String(90))
    CampName = db.Column(db.String(90))
    CampAddress = db.Column(db.String(90))
    NumberOfRefugees = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    # refugees = db.relationship("Refugee")

    def __repr__(self):
         return '<Camp Details {self.title}>'
    
# RefugeeBoard
class Refugee(db.Model):
    # Photo?
    RefugeeID = db.Column(db.Integer, primary_key=True)
    CampID= db.Column(db.Integer, db.ForeignKey('camp.CampID'))
    Name = db.Column(db.String(140))
    Gender = db.Column(db.String(1))
    Age = db.Column(db.Integer)
    CountryOfOrigin = db.Column(db.String(50))
    MessageDate = db.Column(db.DateTime(timezone=True), server_default=func.now()) # Check this btw, does it set the now time?
    Message = db.Column(db.String(1000))
    

    def __repr__(self):
        return '<Refugee Board {self.title}>'

with app.app_context():  
    db.create_all()

@app.route('/api/post/camp',methods=["POST"])
def createNewCamp():
    # Recieving details of the camp
    camp_details = request.get_json()
    # Adding it to the database
    new_camp = Camp(AdminName=camp_details["AdminName"],
                    CampName=camp_details["CampName"],
                    CampAddress=camp_details["CampAddress"],
                    NumberOfRefugees=camp_details["NumberOfRefugees"])
    
    db.session.add(new_camp)
    db.session.commit()
    return jsonify(camp_details)


@app.route('/api/post/refugee',methods=["POST"])
def createNewRefugee():
    # Recieving details of the refugee
    refugee_details = request.get_json()
    # Creating a new refugee object
    new_refugee = Refugee(CampID= refugee_details["CampID"],
                            Name = refugee_details["Name"],
                            Gender = refugee_details["Gender"],
                            Age = refugee_details["Age"],
                            CountryOfOrigin = refugee_details["CountryOfOrigin"],
                            Message = refugee_details["Message"])
    db.session.add(new_refugee)
    db.session.commit()
    return jsonify(refugee_details)

    

# Running the app
if(__name__=="__main__"):
    app.run(debug=True)