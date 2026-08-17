import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import { useAuth } from '../../context/AuthContext';
import './navbar.css';

export default function Navbar() {
    const [authMode, setAuthMode] = useState(null);
    const { user, isAuthLoading, logout } = useAuth();

    let authArea = null;
    if (!isAuthLoading && user) {
        authArea = (
            <>
                <Link to="/account" className="secondary-button navbar-account">
                    <i className="fa-regular fa-user"></i>
                    {user.name}
                </Link>
                <button className="secondary-button" onClick={logout}>
                    Logout
                </button>
            </>
        );
    } else if (!isAuthLoading) {
        authArea = (
            <>
                <button className="secondary-button" onClick={() => setAuthMode('login')}>
                    Login
                </button>
                <button className="cta-button" onClick={() => setAuthMode('register')}>
                    Start free
                </button>
            </>
        );
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <img src="/logo-svg.svg" alt="Logo" /> <h3>PageCraft</h3>
                </div>
                <ul className="navbar-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <div className="navbar-logo login">
                    {authArea}
                </div>
            </nav>

            {authMode && (
                <AuthModal
                    mode={authMode}
                    onClose={() => setAuthMode(null)}
                    onSwitch={setAuthMode}
                />
            )}
        </>
    );
}
