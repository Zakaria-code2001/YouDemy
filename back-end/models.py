from exts import db

"""
Playlist Model Module

This module contains the SQLAlchemy models for User, Playlist, and Video.
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import DateTime
from sqlalchemy.ext.declarative import declarative_base

Model = db.Model


# Base model for timestamping
class TimeStampModel(db.Model):
    """
    TimeStampModel

    Base model class for timestamping database entries.
    """

    __abstract__ = True
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


# User model
class User(TimeStampModel):
    """
    User

    Represents a user in the system.
    """

    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(80), nullable=False)
    last_name = Column(String(80), nullable=False)
    email = Column(String(320), nullable=False, unique=True)
    image_file = Column(String(20), nullable=True, default='default.jpg')
    password = Column(String(320), nullable=False)
    playlists = relationship('Playlist', back_populates='user', passive_deletes=True)

    def __repr__(self):
        return f"<User {self.first_name} {self.last_name}>"

    def save(self):
        """
        Save the user object to the database.
        """
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """
        Delete the user object from the database.
        """
        db.session.delete(self)
        db.session.commit()

    def update(self, name=None, image_file=None):
        """
        Update user attributes and commit changes to the database.

        Parameters:
            name (str): New name for the user.
            image_file (str): New image file for the user.
        """
        if name:
            self.name = name
        if image_file:
            self.image_file = image_file
        db.session.commit()


# Playlist model
class Playlist(TimeStampModel):
    """
    Playlist

    Represents a playlist entity.
    """

    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(80), nullable=False)
    image_file = Column(String(50), nullable=True, default='default.jpg')
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    user = relationship("User", back_populates="playlists")
    videos = relationship("Video", back_populates="playlist", cascade="all, delete, delete-orphan")

    def __repr__(self):
        return f"<Playlist name: {self.name}>"

    def save(self):
        """
        Save the playlist object to the database.
        """
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """
        Delete the playlist object from the database.
        """
        db.session.delete(self)
        db.session.commit()

    def update(self, name=None, image_file=None):
        """
        Update playlist attributes and commit changes to the database.

        Parameters:
            name (str): New name for the playlist.
            image_file (str): New image file for the playlist.
        """
        if name:
            self.name = name
        if image_file:
            self.image_file = image_file
        db.session.commit()


# Video model
class Video(TimeStampModel):
    """
    Video

    Represents a video entity.
    """

    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    url = Column(String(255), nullable=False)
    playlist_id = Column(Integer, ForeignKey("playlists.id", ondelete="CASCADE"))
    playlist = relationship("Playlist", back_populates="videos")

    def __repr__(self):
        return f"<Video id={self.id} title={self.title}>"

    def save(self):
        """
        Save the video object to the database.
        """
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """
        Delete the video object from the database.
        """
        db.session.delete(self)
        db.session.commit()

    def update(self, title=None, url=None):
        """
        Update video attributes and commit changes to the database.

        Parameters:
            title (str): New title for the video.
            url (str): New URL for the video.
        """
        if title:
            self.title = title
        if url:
            self.url = url
        db.session.commit()
