"""
Auth Namespace API

This module provides the API endpoints for user authentication, including signup, login, and token refresh.
"""
import json
from flask import Flask, request, jsonify, Response, make_response
from flask_jwt_extended import (JWTManager,
create_access_token, create_refresh_token,
get_jwt_identity,
jwt_required)
from flask_restx import Resource, fields, Namespace
from werkzeug.security import generate_password_hash, check_password_hash
from models import User

auth_ns = Namespace('auth', description='A namespace for our authentication')

signup_model = auth_ns.model(
    "SignUp",
    {
        "first_name": fields.String(required=True),
        "last_name": fields.String(required=True),
        "email": fields.String(required=True),
        "password": fields.String(required=True)
    }
)

login_model = auth_ns.model(
    "Login",
    {
        "email": fields.String(required=True),
        "password": fields.String(required=True)
    }
)


@auth_ns.route('/signup')
class SignUp(Resource):
    """
        SignUp Resource

        This resource handles user signup functionality.
    """
    @auth_ns.expect(signup_model)
    def post(self):
        """
            Handle user signup.
            This method handles the POST request for user signup. It expects a JSON payload with
            the following fields:
            - first_name: The first name of the user (string).
            - last_name: The last name of the user (string).
            - email: The email address of the user (string).
            - password: The password for the user (string).
            The method performs the following steps:
            1. Parses the JSON payload.
            2. Checks if a user with the provided email already exists.
            3. If the user exists, returns a message indicating the email is already in use.
            4. If the user does not exist, creates a new user, saves it to the database, and returns a success message.
            Returns:
                Response: A JSON response with a message and an appropriate HTTP status code.
                - 200 if the user already exists.
                - 201 if the user is created successfully.
        """
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')

        # Check if user with the provided email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            # Log that the user already exists
            print("User with email {} already exists.".format(email))
            return jsonify({"message": "User with this email already exists"})

        # Creating a new user
        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=generate_password_hash(password)
        )

        new_user.save()
        return make_response(jsonify({"message": "User created successfully"}), 201)


@auth_ns.route('/login')
class Login(Resource):
    """
        Login Resource

        This resource handles user login functionality.
    """
    @auth_ns.expect(login_model)
    def post(self):
        """
            Handle user login.
            This method handles the POST request for user login. It expects a JSON payload with
            the following fields:
            - email: The email address of the user (string).
            - password: The password for the user (string).
            The method performs the following steps:
            1. Parses the JSON payload.
            2. Retrieves the user based on the provided email.
            3. Checks if the provided password matches the stored password.
            4. If the credentials are valid, generates and returns access and refresh tokens.
            5. If the credentials are invalid, returns an error message.
            Returns:
                Response: A JSON response with a message and an appropriate HTTP status code.
                - 200 if the login is successful, including access and refresh tokens.
                - 401 if the email or password is incorrect.
        """
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Retrieve user ID based on email
        user_id = User.query.filter_by(email=email).first()

        if user_id and check_password_hash(user_id.password, password):
            access_token = create_access_token(identity=user_id.id)
            refresh_token = create_refresh_token(identity=user_id.id)
            response_data = {"access_token": access_token, "refresh_token": refresh_token}
            return make_response(jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200)
        else:
            return make_response(jsonify({"message": "Invalid email or password"}), 401)

@auth_ns.route('/refresh')
class RefreshResource(Resource):
    """
        RefreshResource

        This resource handles the refresh functionality for JWT tokens.
    """
    @jwt_required(refresh=True)
    def post(self):
        """
            Handle token refresh.
            This method handles the POST request for refreshing JWT tokens. It requires a valid
            refresh token to be included in the request. The method performs the following steps:
            1. Extracts the current user identity from the refresh token.
            2. Creates a new access token for the current user.
            3. Returns the new access token.
            Returns:
                Response: A JSON response with the new access token and an appropriate HTTP status code.
                - 200 if the token is refreshed successfully.
        """
        current_user = get_jwt_identity()

        new_access_token=create_access_token(identity=current_user)

        return make_response(jsonify({"access_token":new_access_token}),200)

@auth_ns.route('/user/<int:user_id>')
class UserResource(Resource):
    """
        UserResource

        This resource handles operations related to individual users.
    """
    def delete(self, user_id):
        """
            Delete a user.
            This method handles the DELETE request to delete a user with the specified ID.
            The method performs the following steps:
            1. Retrieves the user based on the provided user ID.
            2. If the user exists, deletes the user from the database.
            3. Returns a success message.
            Returns:
                Response: A JSON response with a message and an appropriate HTTP status code.
                - 200 if the user is deleted successfully.
                - 404 if the user with the specified ID is not found.
        """
        user = User.query.get(user_id)
        if user:
            user.delete()
            return make_response(jsonify({"message": "User deleted successfully"}), 200)
        else:
            return make_response(jsonify({"message": "User not found"}), 404)