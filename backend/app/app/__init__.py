from flask import Flask
from config import Config

# This is the heart of the application factory pattern, our entry point to the application
# This is where we initialize the Flask application and all the Flask extensions
# This file will import all other files and packages; No other file can import from this file.
# This is to avoid circular imports

from app.extensions import db,bcrypt,mail,cors

def create_app(config_class = Config):
    app = Flask(__name__)
    app.config.from_object(Config) # Loading the config file

    # Initializing Flask extensions here

    # Flask SQLAlchemy
    db.init_app(app)

    # Creating the database tables (if not present)

    from app.models.refugee import Refugee
    from app.models.camp import Camp
    
    with app.app_context():
        db.create_all()
    
    # Redis - No need to initialize here, already initialized in extensions.py
    
    # Flask Mail
    mail.init_app(app)

    # Bcrypt
    bcrypt.init_app(app)

    # Flask session
    from flask_session import Session
    # server_session = Session(app)
    Session(app)

    # Flask CORS
    cors.init_app(app)

    # Registering the blueprints here
    from app.refugee_endpoints import bp as refugee_bp
    app.register_blueprint(refugee_bp)

    from app.camp_endpoints import bp as camp_bp
    app.register_blueprint(camp_bp)

    from app.admin_functions_endpoints import bp as admin_functions_bp
    app.register_blueprint(admin_functions_bp)
    
    # @app.route('/test/')
    # def test_page():
    #     return '<h1>Testing the Flask Application Factory Pattern</h1>'

    return app