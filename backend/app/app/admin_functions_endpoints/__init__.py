from flask import Blueprint

# Creating a Blueprint
bp = Blueprint('admin_functions_endpoints', __name__)

# Importing the endpoints
from app.admin_functions_endpoints import endpoints