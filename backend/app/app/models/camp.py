from app.extensions import db
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from dataclasses import dataclass

@dataclass
class Camp(db.Model):
    CampID: int = db.Column(db.Integer, primary_key=True, unique=True)
    CampEmail: str = db.Column(db.String(90),nullable=False)
    password: str=db.Column(db.Text, nullable=False)
    CampName: str = db.Column(db.String(90),nullable=False)
    CampAddress: str = db.Column(db.String(90),nullable=False)
    NumberOfRefugees: int = db.Column(db.Integer, default=0)
    created_at: datetime = db.Column(db.DateTime(timezone=True), server_default=func.now())
    verified: bool = db.Column(db.Boolean, default=False)
    
    # On Delete Cascade
    refugees = relationship("Refugee", back_populates="camp",cascade="all, delete-orphan") 
    
    def __repr__(self):
         return f'<Camp Details {self.CampName}>'
    