import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from flask_migrate import Migrate 

load_dotenv()

app = Flask(__name__)
CORS(app)

SECRET_KEY = os.environ.get('SECRET_KEY')
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
SQLALCHEMY_TRACK_MODIFICATIONS = False

db = SQLAlchemy(app)
# app.config['SQLALCHEMY_DATABASE_URI'] likeee mysql://username:password@host:port/database_name

migrate = Migrate(app, db)

from core import views


