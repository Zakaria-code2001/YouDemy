"""
Configuration Module

This module provides configuration settings for the application,
including different configurations for development, production, and testing.
"""

from decouple import config
import os

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


class Config:
    """
    Config

    Base configuration class for the application.
    """

    SECRET_KEY = config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)


class DevConfig(Config):
    """
    DevConfig

    Development configuration class.
    """

    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, 'dev.db')
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProdConfig(Config):
    """
    ProdConfig

    Production configuration class.
    """

    pass


class TestConfig(Config):
    """
    TestConfig

    Test configuration class.
    """

    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
    SQLALCHEMY_ECHO = False
    TESTING = True
