from flask import Blueprint

# Create a Blueprint
bp = Blueprint('refugee_endpoints', __name__)

# Importing the endpoints
from app.refugee_endpoints import endpoints