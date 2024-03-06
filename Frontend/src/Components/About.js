import React from "react";
import Doctor from "../Assets/doctor-group.png";
import "../Styles/About.css";

function About() {
  return (
    <div className="about-section" id="about">
      <div className="about-image-content">
        <img src={Doctor} alt="Doctor Group" className="about-image1" />
      </div>

      <div className="about-text-content">
        <h3 className="about-title">
          <span>About Us</span>
        </h3>
        <p className="about-description">
        At Healthify, our purpose is simple yet profound: to provide 
        compassionate, high-quality healthcare that empowers 
        individuals to live their best lives. Our dedicated team of 
        healthcare professionals is committed to delivering 
        exceptional care tailored to your unique needs.
        </p>
        <p className="about-description">
        We believe in the importance of building trust and fostering 
        positive relationships with our patients. With a focus on 
        empathy, respect, and integrity, we strive to create a 
        supportive environment where you feel valued and heard.

        Beyond medical expertise, we are deeply rooted in our 
        community, working to address broader health and wellness 
        needs through outreach programs and partnerships. At 
        Healthify, we are honored to be your partners in wellness, 
        guiding you on your health journey with compassion and 
        dedication.
        </p>

        <div className="text-stats">
            <div className="text-stats-container">
              <p>10+</p>
              <p>Years of Experience</p>
            </div>

            <div className="text-stats-container">
              <p>250+</p>
              <p>Operations</p>
            </div>

            <div className="text-stats-container">
              <p>800+</p>
              <p>patient Treatments</p>
            </div>
          </div>
      </div>
    </div>
  );
}

export default About;
