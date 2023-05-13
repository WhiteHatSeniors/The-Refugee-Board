import os
import redis

class Config:
    '''Set Flask configuration vars from .env file.'''
    # General Config
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    
    # For uploading files
    UPLOAD_FOLDER = "./app/upload_folder"
    # MAX_CONTENT_PATH = # Maximum Uploadable Bytes # (Not decided yet)

    # For Flask-Session and Redis
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379/0")
    SESSION_USE_SIGNER = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "None"
    # For Mail
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get("EMAIL")
    MAIL_DEFAULT_SENDER = os.environ.get("EMAIL")
    MAIL_PASSWORD = os.environ.get("APP_PASSWORD")
    UPLOAD_FOLDER =  'static/files'