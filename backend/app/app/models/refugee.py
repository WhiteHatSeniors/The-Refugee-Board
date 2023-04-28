from app.extensions import db
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from dataclasses import dataclass

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
    
    camp=relationship("Camp", back_populates="refugees") 

    def __repr__(self):
        return f'<Refugee Board {self.Name}>'
