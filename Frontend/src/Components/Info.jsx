// Info.js
import React from "react";
import Doctor from "../Assets/doctor-book-appointment.png";
import "../Styles/Info.css";

function Info() {
  return (
    <div className="info-section" id="services">
      <div className="info-image-content">
        <img src={Doctor} alt="Doctor Group" className="info-image1" />
      </div>
      <div className="info-title-content">
        <h3 className="info-title">
          <span>Why Choose us?</span>
        </h3>
        <p className="info-description">
          At Healthify, our mission is to prioritize your well-being through every step of your healthcare journey. We understand the importance of feeling confident in your healthcare choices, which is why we offer dependable care and personalized services tailored to your individual needs. Our commitment to excellence means that you can expect high-quality treatment from our skilled and compassionate team. Whether it's a routine check-up or a specialized procedure, we're dedicated to providing you with the best possible care.
        </p>
      </div>
    </div>
  );
}

export default Info;
