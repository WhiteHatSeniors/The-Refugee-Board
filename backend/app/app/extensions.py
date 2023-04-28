# File for managing extensions

# Flask SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

# Redis
from redis import Redis
r = Redis(host='localhost', port=6379, decode_responses=True, db=1)

# Flask Bcrypt
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()

# Flask Mail
from flask_mail import Mail
mail = Mail()

# Flask CORS
from flask_cors import CORS
cors = CORS()

# Validate Password
import re

def validate_password(password):

    # Password checker
    # Primary conditions for password validation:
    # Minimum 8 characters.
    # The alphabet must be between [a-z]
    # At least one alphabet should be of Upper Case [A-Z]
    # At least 1 number or digit between [0-9].
    # At least 1 character from [ _ or @ or $ ]. 

    #\s- Returns a match where the string contains a white space character
    if len(password) < 8 or re.search("\s" , password):  
        return False  
    if not (re.search("[a-z]", password) and re.search("[A-Z]", password) and re.search("[0-9]", password) ):
        return False  
    return True  


