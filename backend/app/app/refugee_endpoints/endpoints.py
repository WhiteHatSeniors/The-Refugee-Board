# 6 total endpoints
from app.refugee_endpoints import bp
from app.extensions import db
from flask import jsonify, request, session
from app.models.camp import Camp
from app.models.refugee import Refugee
from datetime import datetime
from sqlalchemy import or_, and_
from werkzeug.utils import secure_filename
import os, app, json
import pandas as pd

# Test Route

# @bp.route('/r')
# def index():
#     return "Hello from Refugees!"


# Adding a refugee
@bp.route('/api/post/refugee',methods=["POST"])
def createNewRefugee():

    # Making sure the user is logged in
    if not session.get("user_id"):
        return jsonify({"error": "Not logged in"}), 403
    
    
    # The HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it
    logged_in_camp=Camp.query.filter_by(CampID=session.get("user_id")).first()
    refugee_details = request.get_json()

    Name, Age ,Gender, CountryOfOrigin,Message= refugee_details['Name'] and refugee_details['Name'].strip(),refugee_details['Age'] and refugee_details['Age'].strip(), refugee_details['Gender'] and refugee_details['Gender'].strip(),refugee_details['CountryOfOrigin'] and refugee_details['CountryOfOrigin'].strip(),refugee_details['Message'] and refugee_details['Message'].strip()

    if not(Name and Age and Gender and CountryOfOrigin and Message):
        return {"error": "All fields have to be filled"},400
    # The HyperText Transfer Protocol (HTTP) 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error 
    if not Age.isnumeric():
        return {"error": "Enter a valid age"},400
    
    # if not pycountry.countries.search_fuzzy(CountryOfOrigin):
    # if not pycountry.countries.get(name=CountryOfOrigin):
    #     return {"error": "Country Not Found"},400

    # Creating a new refugee object
    camp_id=session.get("user_id");
    new_refugee = Refugee(CampID= camp_id
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
    
    # logged_in_camp.NumberOfRefugees=logged_in_camp.NumberOfRefugees+1
    logged_in_camp.NumberOfRefugees=Camp.NumberOfRefugees+1
    
    db.session.commit()
    ref_info={
            'CampID' : logged_in_camp.CampID,
            'Name'  :  new_refugee.Name,
            'Gender'  :  new_refugee.Gender,
            'Age'  :  new_refugee.Age,
            'CountryOfOrigin'  :  new_refugee.CountryOfOrigin,
            'Message'  :  new_refugee.Message,
            'MessageDate'  :  new_refugee.MessageDate,
            'CampName' : logged_in_camp.CampName,
            'CampAddress' : logged_in_camp.CampAddress
    }

    print("REF:: " ,ref_info, type(ref_info))
    return jsonify({"data": ref_info }),201

# Deleting a refugee
@bp.route('/api/delete/refugee/<id>',methods=["DELETE"])
def deleteRefugee(id):
    # Recieving details of the refugee
    # Getting the refugee object from the database
    # Look up the refugeeID in the refugee table
    
    # You need to be logged in to delete a refugee
    if not session.get("user_id"):
        return jsonify({"error": "Not logged in"}), 403
    ref = Refugee.query.get(id)
    print(ref, id)
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
    logged_in_camp=Camp.query.filter_by(CampID=session.get("user_id")).first()

    logged_in_camp.NumberOfRefugees=Camp.NumberOfRefugees-1
    db.session.commit()
    return jsonify({
        "data": ref
    }),204

# Getting all the refugees
@bp.route('/api/get/all/refugees',methods=["GET"])
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

# Getting refugees based on the search query
@bp.route('/api/get/refugees',methods=["GET"])
def getRefugees():
    '''NOTE: CampID is given the highest priority. If it is passed, all other arguements are not considered'''
    args = request.args
    # country = args.get("CountryOfOrigin")
    # campName = args.get("CampName")
    campID = args.get("CampID")
    id= str(session.get("user_id"))
    # name = args.get("Name")
    # campAddress = args.get("CampAddress")
    searchQuery = args.get("SearchQuery").strip()

    if campID and searchQuery and (id == campID):
        refugees = Refugee.query.filter(
            and_(or_(Refugee.Name.like(f"%{searchQuery}%"),
                 Refugee.CountryOfOrigin.like(f"%{searchQuery}%"),
                 Refugee.Age == searchQuery 
                ),
                Refugee.CampID==campID
            )).order_by(Refugee.MessageDate.desc()).all()
    elif campID and (id == campID):
        refugees = Refugee.query.filter_by(CampID=campID).order_by(Refugee.MessageDate.desc()).all()
    # name, campName, country, campAddress
    else:
        refugees = Refugee.query.filter(
            or_(Refugee.Name.like(f"%{searchQuery}%"),
                 Refugee.camp.has(Camp.CampName.like(f"%{searchQuery}%")),
                 Refugee.CountryOfOrigin.like(f"%{searchQuery}%"),
                 Refugee.camp.has(Camp.CampAddress.like(f"%{searchQuery}%")),
                 Refugee.Age == searchQuery 
            )
        ).order_by(Refugee.MessageDate.desc()).all()
    # elif name:
    #     if campName:
    #         if country:
    #             if campAddress:
    #                 refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.camp.has(Camp.CampName.like(f"%{campName}%")),Refugee.CountryOfOrigin==country,Refugee.camp.has(Camp.CampAddress.like(f"%{campAddress}%")))).order_by(Refugee.MessageDate.desc()).all()
    #             else:
    #                 refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.camp.has(Camp.CampName.like(f"%{campName}%")),Refugee.CountryOfOrigin==country)).order_by(Refugee.MessageDate.desc()).all()
    #         else:
    #             if campAddress:
    #                 refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.camp.has(Camp.CampName.like(f"%{campName}%")),Refugee.camp.has(Camp.CampAddress.like(f"%{campAddress}%")))).order_by(Refugee.MessageDate.desc()).all()
    #             else:
    #                 refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.camp.has(Camp.CampName.like(f"%{campName}%")))).order_by(Refugee.MessageDate.desc()).all()
    #     else:
    #         if country:
    #             if campAddress:
    #                 refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.CountryOfOrigin==country,Refugee.camp.has(Camp.CampAddress.like(f"%{campAddress}%")))).order_by(Refugee.MessageDate.desc()).all()
    #             else:
    #                 refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.CountryOfOrigin==country)).order_by(Refugee.MessageDate.desc()).all()
    #         else:
    #             if campAddress:
    #                 refugees = Refugee.query.filter(and_(Refugee.Name.like(f"%{name}%"),Refugee.camp.has(Camp.CampAddress.like(f"%{campAddress}%")))).order_by(Refugee.MessageDate.desc()).all()
    #             else:
    #                 refugees = Refugee.query.filter(Refugee.Name.like(f"%{name}%")).order_by(Refugee.MessageDate.desc()).all()
    # else:
        # if campName:
        #     if country:
        #         if campAddress:
        #             refugees = Refugee.query.filter(and_(Refugee.camp.has(Camp.CampName.like(f"%{campName}%")),Refugee.CountryOfOrigin==country,Refugee.camp.has(Camp.CampAddress.like(f"%{campAddress}%")))).order_by(Refugee.MessageDate.desc()).all()
        #         else:
        #             refugees = Refugee.query.filter(and_(Refugee.camp.has(Camp.CampName.like(f"%{campName}%")),Refugee.CountryOfOrigin==country)).order_by(Refugee.MessageDate.desc()).all()
        #     else:
        #         if campAddress:
        #             refugees = Refugee.query.filter(and_(Refugee.camp.has(Camp.CampName.like(f"%{campName}%")),Refugee.camp.has(Camp.CampAddress.like(f"%{campAddress}%")))).order_by(Refugee.MessageDate.desc()).all()
        #         else:
        #             refugees = Refugee.query.filter(Refugee.camp.has(Camp.CampName.like(f"%{campName}%"))).order_by(Refugee.MessageDate.desc()).all()
        # else:
        #     if country:
        #         if campAddress:
        #             refugees = Refugee.query.filter(and_(Refugee.CountryOfOrigin==country,Refugee.camp.has(Camp.CampAddress.like(f"%{campAddress}%")))).order_by(Refugee.MessageDate.desc()).all()
        #         else:
        #             refugees = Refugee.query.filter(Refugee.CountryOfOrigin==country).order_by(Refugee.MessageDate.desc()).all()
        #     else:
        #         if campAddress:
        #             refugees = Refugee.query.filter(Refugee.camp.has(Camp.CampAddress.like(f"%{campAddress}%"))).order_by(Refugee.MessageDate.desc()).all()
        #         else:
        #             refugees = Refugee.query.all()
    
    # Checking if no refugees were found
    if len(refugees) == 0:
        print("LLOOLOLOL" ,refugees)
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

# Dummy method to add all the data to the refugee table
@bp.route('/api/post/refugee/all',methods=["POST"])
def addAllRefugees():
    # return {"Not allowed":"Not allowed"}
    refugees = request.get_json()
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

@bp.route('/api/post/refugee/csv',methods=["POST"])
def addRefugee():
    # The csv file is converted to a JSON object and sent to this route
    print(request, request.data, request.files)
    # data = pd.read_excel(request.data, engine='xlrd')
    # print(data)
    csv_file = request.files.get('file')
    # print("CSV FILE: ", csv_file, request.files.getlist('files[]'))
    # if csv_file.filename != '':
    #        file_path = os.path.join(app.config['UPLOAD_FOLDER'], csv_file.filename)
    #       # set the file path
    #        csv_file.save(file_path)
    #        print("CSV FILE: ", csv_file)
    
    # Making sure the user is logged in
    if not (camp_id := session.get("user_id")): # Python Walrus operator assignment expression
        return jsonify({"error": "Not logged in"}), 403
    
    refugees = request.get_json()

    try:
        for refugee in refugees:
            new_refugee = Refugee(CampID = camp_id,
                                Name = refugee["Name"],
                                Gender = refugee["Gender"],
                                Age = refugee["Age"],
                                CountryOfOrigin = refugee["CountryOfOrigin"],
                                Message = refugee["Message"]
                        )
            db.session.add(new_refugee)
            db.session.commit()
    except:
        return jsonify({"error": "Error adding refugees"}), 400

    return jsonify({"data": refugees}),200
    

# Updating a refugees details
@bp.route('/api/patch/refugee/<id>',methods=["PATCH"])
def updateRefugee(id):

    # You need to be logged in to update a refugee entry
    if not session.get("user_id"):
        return jsonify({"error": "Not logged in"}), 403
    
    # The HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it
    
    # Recieving details of the refugee
    updatedDetails = request.get_json() # Expecting a JSON object with the RefugeeID and ALL the updated details.
    # refugee = Refugee.query.filter_by(RefugeeID=id).first() 
    # refugee = Refugee.query.get_or_404(updatedDetails["RefugeeID"]) # Automatically sends a 404 if not found
    refugee = Refugee.query.get_or_404(id) # Automatically sends a 404 if not found
    print('UPDATE ', refugee)
    
    # Checking if the logged in camp representative is allowed to update the refugee
    # Checking if the refugee belongs to the same camp as the logged in camp representative.
    if refugee.CampID != session.get("user_id"):
        return jsonify({"error": "You are not allowed to update this refugee"}), 403

    Name, Age ,Gender, CountryOfOrigin,Message= updatedDetails['Name'] and updatedDetails['Name'].strip(),updatedDetails['Age'] and str(updatedDetails['Age']).strip(), updatedDetails['Gender'] and updatedDetails['Gender'].strip(),updatedDetails['CountryOfOrigin'] and updatedDetails['CountryOfOrigin'].strip(),updatedDetails['Message'] and updatedDetails['Message'].strip()

    if not(Name and Age and Gender and CountryOfOrigin and Message):
        return {"error": "All fields have to be filled"},400
    # The HyperText Transfer Protocol (HTTP) 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error 
    if not Age.isnumeric():
        return {"error": "Enter a valid age"},400

    if request.method == 'PATCH':
        # Updating the refugee
        refugee.Name = updatedDetails['Name']
        refugee.Gender = updatedDetails['Gender']
        refugee.CountryOfOrigin = updatedDetails['CountryOfOrigin']
        refugee.Age = updatedDetails['Age']
        refugee.Message = updatedDetails['Message']
        refugee.MessageDate = datetime.now()

        db.session.add(refugee) # SQL Alchemy will update if it exists.
        db.session.commit()

        return jsonify({"data": refugee}),200
    else:
        # Some other method was used
        return jsonify({"error": "Method not allowed"}),405

