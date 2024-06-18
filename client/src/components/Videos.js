import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Form ,Container} from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';
import BASEURL from "./config";

const VideosPage = () => {
    const { playlist_id } = useParams();
    const [videos, setVideos] = useState([]);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const [playlistName, setPlaylistName] = useState('');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [counter, setCounter] = useState(0);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        fetchVideos();
        fetchPlaylistDetails();
    }, [playlist_id]);
    
    const fetchPlaylistDetails = async () => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
        const decodedToken = jwtDecode(token);
        const user_id = decodedToken.sub;


        fetch(`/playlist_video/playlists?user_id=${user_id}`, {
           headers: {
               'Authorization': `Bearer ${JSON.parse(token)}`,
               'Content-Type': 'application/json',
               'accept': 'application/json'
           }
        })
        .then(res => res.json())
        .then(data => {
           console.log('Fetched playlists:', data);
           if (data && data.length > 0) {
            setPlaylistName(data[0].name);
        }
        })
        .catch(err => console.error('Error fetching playlists:', err));
   };
    
    
    const fetchVideos = () => {
        fetch(`/playlist_video/playlist/${playlist_id}/videos`)
            .then(response => response.json())
            .then(data => {
                setVideos(data);
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });
    };

    const handleDelete = (video) => {
        setVideoToDelete(video);
        deleteVideo();
        fetchVideos();
    };

    const deleteVideo = () => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
        fetch(`/playlist_video/playlist/${playlist_id}/video/${videoToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Video deleted successfully:', data);
            setVideos(videos.filter(video => video.id !== videoToDelete.id));
            setVideoToDelete(null);
        })
        .catch(error => {
            console.error('Error deleting video:', error);
        });
    };

    const handleCreate = () => {
        const data = {
            title: title,
            url: url
        };
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
        fetch(`/playlist_video/playlist/${playlist_id}/videos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Video created successfully:', data);
            setTitle('');
            setUrl('');
            fetchVideos();
        })
        .catch(error => {
            console.error('Error creating video:', error);
        });
    };



const VideoPlayer = ({ url }) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = getYouTubeVideoId(url);
        return (
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
            ></iframe>
        );
    } else {
        return <video src={url} controls />;
    }
};

const getYouTubeVideoId = (url) => {
    let videoId = '';
    if (url.includes('youtube.com')) {
        videoId = url.split('v=')[1];
    } else if (url.includes('youtu.be')) {
        videoId = url.split('/').pop();
    }
    return videoId;
};
const changeVideo = (index) => {
    if (index >= 0 && index < videos.length) {
        setCounter(index);
        setClicked(false);
    } else {
        console.warn('Index out of bounds:', index);
    }
};
return (
    <div className="videos-page">
    <h1>Videos</h1>
    <Container>
    <div className="main">
        <div className="videoCon">
            {videos.length > 0 ? (
                <>
                    <h1 className="textHeader">{videos[counter].title}</h1>
                    <div className="vide">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(videos[counter].url)}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </>
            ) : (
                <p>No videos available</p>
            )}
        </div>
        
        <div className="contentCont">
            <span onClick={() => setClicked(!clicked)} className={`iconS ${!clicked ? "clicked" : "clickedN"}`}>
                <img src="/path/to/arrow/image" alt="" />
            </span>
            <ul className={`slide ${!clicked ? "clicked" : ""}`}>
                <h4 className="listTitle">My List</h4>
                {videos.map((elm, index) => (
                    <li key={elm.id}>
                        <div onClick={() => changeVideo(index)}>
                            {elm.title} {counter === index && <img src="/path/to/video/icon" alt="" />}
                        </div>
                        <Button
                            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                            onClick={() => handleDelete(elm)}
                        >
                            X
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
</Container>

            <Form className="create-video-form">
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="url">
                    <Form.Label>URL</Form.Label>
                    <Form.Control type="text" value={url} onChange={e => setUrl(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={handleCreate}>Create</Button>
            </Form>
        </div>
    );
};

export default VideosPage;