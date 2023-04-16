from core import db

# class CampDetails(db.Model):
#     CampID = db.Column(db.Integer, primary_key=True)
#     AdminName = db.Column(db.String(90))
#     CampName = db.Column(db.String(90))
#     CampAddress = db.Column(db.String(90))
#     NumberOfRefugees = db.Column(db.Integer)
#     created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

#     def __repr__(self):
#          return '<Camp Details {self.title}>'

# class RefugeeBoard(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(140))
#     date = db.Column(db.Date())
#     time = db.Column(db.Time())
#     category= db.Column(db.String, db.ForeignKey('category.id'))

#     def __repr__(self):
#         return '<Refugee Board {self.title}>'
    

