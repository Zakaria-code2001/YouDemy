"""
Playlists and Videos Namespace API

This module provides the API endpoints for playlist and video-related functionalities,
including a simple hello world endpoint.
"""

from flask import request, make_response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, fields, Namespace

from models import Playlist, Video

playlists_videos_ns = Namespace('playlist_video', description='views namescpace for playlists and videos')

playlist_model = playlists_videos_ns.model(
    "Playlist",
    {
        "id": fields.Integer(),
        "name": fields.String(required=True, description="Playlist name"),
        "image_file": fields.String(description="Image file name"),
        "user_id": fields.Integer(required=True, description="The ID of the user who owns the playlist")
    }
)

# Model serializer for videos
video_model = playlists_videos_ns.model(
    "Video",
    {
        "id": fields.Integer(),
        "title": fields.String(required=True, description="Video title"),
        "url": fields.String(required=True, description="Video URL")
    }
)


@playlists_videos_ns.route('/hello')
class HelloResource(Resource):
    """
        HelloResource

        A simple resource that returns a "Hello World" message.
    """
    def get(self):
        """
            Handle GET request.
            Returns:
                JSON response with a "Hello World" message.
        """
        return {"message": "Hello World"}


@playlists_videos_ns.route('/playlists')
class PlaylistsResource(Resource):
    """
        PlaylistsResource

        Handles retrieving and creating playlists.
    """
    @playlists_videos_ns.marshal_list_with(playlist_model)
    @jwt_required()
    def get(self):
        """
            Get all playlists.
            Returns:
                JSON response with a list of all playlists.
        """
        user_id = get_jwt_identity()
        user_playlists = Playlist.query.filter_by(user_id=user_id).all()
        return user_playlists

    @playlists_videos_ns.expect(playlist_model)
    @playlists_videos_ns.marshal_with(playlist_model)
    @jwt_required()
    def post(self):
        """
        Create a new playlist.

        Expects a JSON payload with 'name' and 'image_file' fields.
        Requires JWT authentication for user identification.
        Creates a new playlist associated with the authenticated user.

        Returns:
            JSON response with the newly created playlist and HTTP status code.
        """
        user_id = get_jwt_identity()
        data = request.get_json()

        new_playlist = Playlist(
            name=data.get('name'),
            image_file=data.get('image_file'),
            user_id=user_id
        )

        new_playlist.save()
        return new_playlist, 201


@playlists_videos_ns.route('/playlist/<int:id>')
class PlaylistResource(Resource):
    """
        PlaylistResource

        Handles operations on individual playlists by ID.
    """
    @playlists_videos_ns.marshal_with(playlist_model)
    def get(self, id):
        """
        Get a playlist by ID.

        Parameters:
            id (int): The ID of the playlist.

        Returns:
            JSON response with the playlist details and HTTP status code.
        """
        playlist = Playlist.query.get_or_404(id)
        return make_response(playlist, 200)

    @playlists_videos_ns.expect(playlist_model)
    @playlists_videos_ns.marshal_with(playlist_model)
    @jwt_required()
    def put(self, id):
        """
        Update a playlist by ID.

        Parameters:
            id (int): The ID of the playlist.

        Expects a JSON payload with 'name' and 'image_file' fields.
        Requires JWT authentication for user authorization.
        Updates the specified playlist with the provided data.

        Returns:
            JSON response with the updated playlist and HTTP status code.
        """
        playlist_to_update = Playlist.query.get_or_404(id)
        data = request.get_json()

        playlist_to_update.update(
            name=data.get('name'),
            image_file=data.get('image_file')
        )

        return playlist_to_update, 200

    @playlists_videos_ns.marshal_with(playlist_model)
    @jwt_required()
    def delete(self, id):
        """
        Delete a playlist by ID.

        Parameters:
            id (int): The ID of the playlist.

        Requires JWT authentication for user authorization.
        Deletes the specified playlist.

        Returns:
            JSON response with a success message and HTTP status code.
        """
        playlist = Playlist.query.get_or_404(id)
        playlist.delete()
        return {'message': 'Playlist deleted successfully'}, 204


@playlists_videos_ns.route('/playlist/<int:playlist_id>/videos')
class PlaylistVideosResource(Resource):
    """
        PlaylistVideosResource

        Handles operations on videos within a specific playlist.
    """
    @playlists_videos_ns.marshal_list_with(video_model)
    def get(self, playlist_id):
        """
            Get all videos in a playlist.
            Parameters:
                playlist_id (int): The ID of the playlist.
            Returns:
                JSON response with a list of videos in the playlist and HTTP status code.
        """
        playlist = Playlist.query.get_or_404(playlist_id)
        return playlist.videos, 200

    @playlists_videos_ns.expect(video_model)
    @playlists_videos_ns.marshal_with(video_model)
    def post(self, playlist_id):
        """
        Add a new video to a playlist.

        Parameters:
            playlist_id (int): The ID of the playlist.

        Expects a JSON payload with 'title' and 'url' fields.
        Requires JWT authentication for user authorization.
        Adds a new video to the specified playlist.

        Returns:
            JSON response with the newly added video and HTTP status code.
        """
        data = request.get_json()
        new_video = Video(
            title=data.get('title'),
            url=data.get('url'),
            playlist_id=playlist_id
        )
        new_video.save()
        return new_video, 201


@playlists_videos_ns.route('/playlist/<int:playlist_id>/video/<int:video_id>')
class PlaylistVideoResource(Resource):
    """
        PlaylistVideoResource

        Handles operations on a specific video within a playlist.
    """
    @playlists_videos_ns.marshal_with(video_model)
    def get(self, playlist_id, video_id):
        """
        Get a specific video in a playlist by ID.

        Parameters:
            playlist_id (int): The ID of the playlist.
            video_id (int): The ID of the video.

        Returns:
            JSON response with the video details and HTTP status code.
        """
        video = Video.query.filter_by(id=video_id, playlist_id=playlist_id).first_or_404()
        return video, 200

    @playlists_videos_ns.expect(video_model)
    @playlists_videos_ns.marshal_with(video_model)
    def put(self, playlist_id, video_id):
        """
        Update a video in a playlist.

        Parameters:
            playlist_id (int): The ID of the playlist.
            video_id (int): The ID of the video.

        Expects a JSON payload with 'title' and 'url' fields.
        Requires JWT authentication for user authorization.
        Updates the specified video with the provided data.

        Returns:
            JSON response with the updated video and HTTP status code.
        """
        video_to_update = Video.query.filter_by(id=video_id, playlist_id=playlist_id).first_or_404()
        data = request.get_json()
        video_to_update.update(
            title=data.get('title'),
            url=data.get('url')
        )
        return video_to_update, 201

    def delete(self, playlist_id, video_id):
        """
        Delete a video from a playlist.

        Parameters:
            playlist_id (int): The ID of the playlist.
            video_id (int): The ID of the video.

        Requires JWT authentication for user authorization.
        Deletes the specified video.

        Returns:
            JSON response with a success message and HTTP status code.
        """
        video = Video.query.filter_by(id=video_id, playlist_id=playlist_id).first_or_404()
        video.delete()
        return {'message': 'Video deleted successfully'}, 204
