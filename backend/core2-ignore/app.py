import os
from flask import Flask,jsonify,request
from flask_cors import CORS
from dotenv import load_dotenv

from database import db


def create_app():
    # load_dotenv()
    app = Flask(__name__)
    CORS(app)

    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:12345678@localhost/therefugeeboard"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    return app

def setup_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()



if __name__ == '__main__':
    app = create_app()
    setup_db(app)
    app.run(debug=True)