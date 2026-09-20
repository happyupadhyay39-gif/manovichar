import React from "react";
import "./Hero.css";
import heroImg from "./hero-image.png"; 

function Hero() {
  return (
    <section 
      className="hero" 
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-label-badge">
            <span className="dot"></span>
            <span>A GENTLE PATH TO CLARITY</span>
          </div>

          <h1 className="hero-title">
            A Space to <br />
            <span className="italic-highlight">Understand Yourself</span>, <br />
            Gently and Openly.
          </h1>

          <p className="hero-description">
            Manovichar offers a calm, supportive, and compassionate environment 
            where you can pause, reflect, and embrace a journey toward a deeper 
            understanding of your well-being.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="btn-primary">
              Book Your Session
            </a>
            <a href="#about" className="btn-secondary">
              Explore Manovichar
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle-floating">
            <div className="hero-circle-inner">
              <span className="devanagari-text">मन</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;