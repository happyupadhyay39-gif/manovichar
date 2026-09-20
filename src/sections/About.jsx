import React, { useEffect } from "react";
import "./About.css";
// import aboutImage from "./about-us.png"; // Placeholder for future asset

function About() {
  useEffect(() => {
    // Basic Intersection Observer to add 'visible' class when seen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 } // Starts when 10% visible
    );

    // Observe each element intended to animate
    document.querySelectorAll(".animate-item").forEach((item) => {
      observer.observe(item);
    });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-us" id="about">
      <div className="about-container">
        {/* Title and Intro Text */}
        <div className="about-header">
          <h2 className="about-title animate-item cascade-1">
            Our Commitment to Your <br />
            <span className="serif-highlight">Well-Being and Clarity</span>.
          </h2>
          <p className="about-intro animate-item cascade-2">
            Manovichar provides a gentle, professional pathway toward understanding yourself more deeply. We cultivate a secure space for reflection, healing, and personal growth, offering empathetic guidance at every step of your emotional journey.
          </p>
        </div>

        {/* Dynamic Value Cards */}
        <div className="about-values">
          <div className="value-card animate-item cascade-3">
            <div className="value-icon">🌱</div>
            <h3>Safe Space</h3>
            <p>Confidential and non-judgmental environment.</p>
          </div>
          <div className="value-card animate-item cascade-4">
            <div className="value-icon">🤝</div>
            <h3>Expert Guidance</h3>
            <p>Experienced professionals dedicated to your growth.</p>
          </div>
          <div className="value-card animate-item cascade-5">
            <div className="value-icon">🧡</div>
            <h3>Compassionate Care</h3>
            <p>A personal touch focusing on your unique needs.</p>
          </div>
        </div>

        {/* Optional Image or Final Callout (Animate in last) */}
        {/* <img src={aboutImage} alt="Supportive wellness setting" className="about-final-img animate-item cascade-6" /> */}
      </div>
    </section>
  );
}

export default About;