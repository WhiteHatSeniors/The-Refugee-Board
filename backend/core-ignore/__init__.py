import os
from flask import Flask,jsonify,request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from flask_migrate import Migrate 



# load_dotenv()
app = Flask(__name__)
CORS(app)

SECRET_KEY = os.environ.get('SECRET_KEY')
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:12345678@localhost/therefugeeboard"
SQLALCHEMY_TRACK_MODIFICATIONS = False

db = SQLAlchemy()

from core import models,views



