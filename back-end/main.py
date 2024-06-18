"""
Application Factory

This module contains the application factory function to create the Flask application.
"""

from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restx import Api
from flask import Flask
from exts import db
from models import User, Playlist, Video
from playlists_videos import playlists_videos_ns
from auth import auth_ns
from flask_cors import CORS


def create_app(config):
    """
    create_app

    Factory function to create the Flask application.

    Parameters:
        config: Configuration class for the application.

    Returns:
        Flask application instance.
    """
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "https://portfolio-project-1-vs55.onrender.com"}})

    migrate = Migrate(app, db)
    JWTManager(app)
    api = Api(app, doc='/docs')
    api.add_namespace(playlists_videos_ns)
    api.add_namespace(auth_ns)

    # Shell context for flask shell
    @app.shell_context_processor
    def make_shell_context():
        """
        make_shell_context

        Provides objects to the Flask shell context.

        Returns:
            Dictionary containing objects for the Flask shell context.
        """
        return dict(db=db, User=User, Playlist=Playlist, Video=Video)

    return app
