import React, { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Toggle mobile menu drawer
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Add shadow/border depth on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#" className="logo" onClick={handleLinkClick}>
          <div className="logo-mark">
            <span>M</span>
          </div>
          <span className="logo-text">Manovichar</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <a href="#about" onClick={handleLinkClick}>
            About
          </a>
          <a href="#services" onClick={handleLinkClick}>
            Services
          </a>
          <a href="#how-it-works" onClick={handleLinkClick}>
            How It Works
          </a>
          <a href="#team" onClick={handleLinkClick}>
            Our Team
          </a>
          <a href="#faq" onClick={handleLinkClick}>
            FAQ
          </a>

          {/* CTA Mobile Version */}
          <a
            href="#contact"
            className="nav-button mobile-cta"
            onClick={handleLinkClick}
          >
            Book a Session
          </a>
        </div>

        {/* CTA Desktop Version */}
        <div className="nav-actions">
          <a href="#contact" className="nav-button desktop-cta">
            Book a Session
          </a>

          {/* Mobile Hamburger / Cross Toggle */}
          <button
            className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            type="button"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;