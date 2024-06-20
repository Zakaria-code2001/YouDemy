import React from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../auth";
import '../styles/main.css';  // Consolidated CSS import
import Slider from "react-slick"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faFilm, faShareAlt } from '@fortawesome/free-solid-svg-icons';

const LoggedInHome = () => (
    <div className="logged-in-container">
      <section id="hero" className="hero">
        <div className="container">
          <h1>Welcome to MyWebsite</h1>
          <p>Get started by creating and exploring your playlists.</p>
          <Link to='/Playlists' className="btn">View Your Playlists</Link>
        </div>
      </section>
      <section id="how-to-use" className="how-to-use">
        <div className="container">
          <h2>How to Use</h2>
          <ol>
            <li>
              1.Create an account or log in if you already have one.
              <img src='/images/image1.png' alt="Create an account or log in" />
            </li>
            <li>
              2.Navigate to the Playlists section using the button above.
              <img src="/images/image2.png" alt="Navigate to Playlists section" />
            </li>
            <li>
              3.Click on "Create New Playlist" to start adding your favorite videos.
              <img src="/images/image3.png" alt="Create New Playlist" />
            </li>
            <li>
              4.Customize your playlist by adding a title and an image url.
              <img src="/images/image4.png" alt="Customize playlist" />
            </li>
            <li>
              5.Create a Video uaing the video link and start enjoying YouDemy.
              <img src="/images/image5.png" alt="Explore and share playlists" />
            </li>
          </ol>
        </div>
      </section>
    </div>
);


const LoggedOutHome = () => {
    return (
      <div>
        <main>
          <section id="hero" className="hero">
            <div className="container">
              <h1>Welcome to YouDemy</h1>
              <p>Your journey to amazing learning starts here.</p>
              <Link to='/Login' className="btn">Get Started</Link>
            </div>
          </section>
  
          <section id="about" className="about">
            <div className="container">
              <div className="about-content">
                <div className="about-text">
                  <h2>About Me</h2>
                  <p>Hi, I'm Zakaria Mohammadi, a passionate software engineering student with a focus on backend development. I am enthusiastic about creating efficient and scalable solutions that solve real-world problems. Currently pursuing my degree, I am eager to apply my skills in areas such as database management, server-side scripting, and API development. I thrive in collaborative environments where innovation and teamwork drive success. Let's connect and explore how we can make a positive impact through technology!</p>
                </div>
                <div className="about-image">
                  <img src="https://images.pexels.com/photos/5935791/pexels-photo-5935791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Profile" />
                </div>
              </div>
            </div>
          </section>
  
          <section id="services" className="services" style={{ backgroundColor: '#000', color: '#fff' }}>
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase">Features</h2>
              <h3 className="section-subheading" style={{ color: '#ccc' }}>Enhance your video experience with our features.</h3>
            </div>
            <div className="row text-center">
              <div className="col-md-4">
                <span className="fa-stack fa-4x">
                  <FontAwesomeIcon icon={faPlay} className="fa-stack-1x fa-inverse" />
                </span>
                <h4 className="my-3">Create Playlists</h4>
                <p style={{ color: '#ddd' }}>Organize your videos into personalized playlists.</p>
              </div>
              <div className="col-md-4">
                <span className="fa-stack fa-4x">
                  <FontAwesomeIcon icon={faFilm} className="fa-stack-1x fa-inverse" />
                </span>
                <h4 className="my-3">Manage Videos</h4>
                <p style={{ color: '#ddd' }}>Easily add and remove videos from your collection.</p>
              </div>
              <div className="col-md-4">
                <span className="fa-stack fa-4x">
                  <FontAwesomeIcon icon={faShareAlt} className="fa-stack-1x fa-inverse" />
                </span>
                <h4 className="my-3">Copy and paste links</h4>
                <p style={{ color: '#ddd' }}>Copy and paste links and enjoy crafting new playlists</p>
              </div>
            </div>
          </div>
        </section>
  
          <section id="contact" className="contact">
            <div className="container">
              <h2>Contact</h2>
              <p>Feel free to contact me for any inquiries or collaboration opportunities.</p>
              <form>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message"></textarea>
                <button type="submit" className="btn">Send Message</button>
              </form>
            </div>
          </section>
        </main>
  
        <footer>
          <div className="container">
            <p>&copy; 2024 MyWebsite. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  };


const HomePage = () => {
    const [logged] = useAuth();
    return (
        <div className="home-page">
            {logged ? <LoggedInHome /> : <LoggedOutHome />}
        </div>
    );
};

export default HomePage;
