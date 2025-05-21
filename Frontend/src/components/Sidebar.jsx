import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/sidebar.css';
import hamburgerBlack from '../assets/hamburger-black.png';
import hamburgerWhite from '../assets/hamburger-white.png';
import accountIcon from '../assets/account.png';

function Sidebar({ links }) {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const { logout, logged } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="sidebar">
            <>
                <ul className={`nav-links ${visible ? 'visible' : 'hidden'}`}>
                    {links.map((link, index) => (
                        <li
                            className="nav-link"
                            key={index}
                            onClick={() => navigate(link.url)}
                        >
                            <img
                                src={link.img}
                                alt="Navigation Icon"
                                className="nav-img"
                            />
                            {link.text}
                        </li>
                    ))}
                    <div className="account">
                        {logged ? (
                            <>
                                <img
                                    src={accountIcon}
                                    alt="Account Icon"
                                    className="account-img"
                                />
                                <p className="nav-link" onClick={handleLogout}>
                                    Logout
                                </p>
                            </>
                        ) : (
                            <>
                                <p
                                    className="nav-link"
                                    onClick={() => navigate('/login/1')}
                                >
                                    Login
                                </p>
                                <p
                                    className="nav-link"
                                    onClick={() => navigate('/login/2')}
                                >
                                    Register
                                </p>
                            </>
                        )}
                    </div>
                </ul>
            </>
            <img
                src={visible ? hamburgerBlack : hamburgerWhite}
                alt="hamburger"
                className="hamburger-icon"
                onClick={() => setVisible((prevVisible) => !prevVisible)}
            />
        </div>
    );
}

export default Sidebar;
