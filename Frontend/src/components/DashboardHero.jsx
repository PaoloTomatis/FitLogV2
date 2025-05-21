import React, { useEffect, useRef } from 'react';
import runningVideo from '../assets/running.mp4';
import '../styles/dashboard-hero.css';
import { useNavigate } from 'react-router-dom';

function DashboardHero() {
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1;
        }
    }, []);

    return (
        <div className="hero">
            <video
                className="hero-video"
                ref={videoRef}
                src={runningVideo}
                autoPlay
                muted
                loop
            ></video>
            <div className="hero-txt">
                <h1 className="hero-tit">FITLOG</h1>
                <p className="hero-desc">
                    Un'app all-in-one semplice ed efficace per principianti e
                    atleti professionisti
                </p>
                <p className="hero-btn" onClick={() => navigate('/login/2')}>
                    Unisciti Ora
                </p>
            </div>
        </div>
    );
}

export default DashboardHero;
