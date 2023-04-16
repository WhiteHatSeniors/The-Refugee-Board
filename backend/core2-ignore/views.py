from database import db
from flask import Blueprint, jsonify, request
hish = Blueprint('hish', __name__, url_prefix='/')

from database import Camp, Refugee



# API Routes

# Create routes:

@hish.route('/api/post/camp',methods=["POST"])
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


@hish.route('/api/post/refugee',methods=["POST"])
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

