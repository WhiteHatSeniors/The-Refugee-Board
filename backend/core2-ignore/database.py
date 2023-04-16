from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

db = SQLAlchemy()

# Models

# CampDetails
class Camp(db.Model):
    CampID = db.Column(db.Integer, primary_key=True)
    AdminName = db.Column(db.String(90))
    CampName = db.Column(db.String(90))
    CampAddress = db.Column(db.String(90))
    NumberOfRefugees = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

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
    