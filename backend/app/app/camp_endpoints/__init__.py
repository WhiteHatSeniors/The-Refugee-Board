from flask import Blueprint

# Creating a Blueprint
bp = Blueprint('camp_endpoints', __name__)

# Importing the endpoints
from app.camp_endpoints import endpoints