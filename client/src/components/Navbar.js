import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth, logout } from '../auth';
import '../styles/main.css';

const LoggedInLinks = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link active text-white" to="/">Home</Link>
      </li>
      <li className="nav-item">
        <a className="nav-link active text-white" href="#how-to-use">Tutorial</a>
      </li>
      <li className="nav-item">
        <Link className="nav-link active text-white" to="/Playlists">Playlists</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active text-white" to="/" onClick={() => { logout() }}>Log Out</Link>
      </li>
    </>
  )
}

const LoggedOutLinks = () => {
  return (
    <>
      <li className="nav-item">
        <a className="nav-link active text-white" href="#about">About</a>
      </li>
      <li className="nav-item">
        <a className="nav-link active text-white" href="#services">Services</a>
      </li>
      <li className="nav-item">
        <a className="nav-link active text-white" href="#contact">Contact Us</a>
      </li>
      <li className="nav-item">
        <Link className="nav-link active text-white" to="/signup">Sign Up</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active text-white" to="/login">Login</Link>
      </li>
    </>
  )
}

const NavBar = () => {
  const [logged] = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  }

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'black' }}>
      <div className="container-fluid">
        <Link
          className="navbar-brand text-white"
          to="/"
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          YouDemy
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ marginLeft: '8px', width: '24px', height: '24px' }}
          >
            <path d="M12 2L1 9l11 7 9-5.46V17h2V9l-11-7zm-1.5 8h3v2h-3v-2z" />
          </svg>
        </Link>
        <button className="navbar-toggler" type="button" onClick={handleToggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${showMenu ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
