// Services.js
import React from "react";
import InformationCard from "./InformationCard";
import { faHeartPulse, faTruckMedical, faTooth } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Service.css";

function Services() {
  return (
    <div className="service-section" id="services">
      <div className="service-title-content">
        <h3 className="service-title">
          <span>What We Provide</span>
        </h3 >
        <p className="service-description">
          At Healthify, we offer personalized healthcare services to support your well-being. From preventive care to specialized treatments, our compassionate team is here to guide your health journey. Trust us for quality care that prioritizes your needs.
        </p>
      </div>

      <div className="service-cards-content">
        <InformationCard
          title="Personal Care"
          description="At Healthify, personal care means tailoring your healthcare experience to your unique needs. Our compassionate team listens, supports, and empowers you to make informed decisions about your health. Experience the difference of personalized care at Healthify."
          icon={faTruckMedical}
        />

        <InformationCard
          title="Arthritis Care"
          description="With a focus on education and support, we empower you to take control of your arthritis management plan. Whether you're newly diagnosed or have been living with arthritis for years, we're here to support you every step of the way."
          icon={faHeartPulse}
        />

        <InformationCard
          title="Dementia Care"
          description="At Healthify, we specialize in dementia care tailored to your unique needs. Our compassionate team understands the challenges faced by individuals living with dementia and is dedicated to providing personalized support and assistance to enhance quality of life."
          icon={faTooth}
        />

        <InformationCard
          title="Diabetes Care"
          description="We offer a comprehensive range of diabetes care services, including medication management, blood sugar monitoring, nutritional counseling, and lifestyle modifications. Our goal is to empower you to take control of your diabetes and achieve optimal health outcomes."
          icon={faTooth}
        />

        <InformationCard
          title="Live-In Care"
          description="At Healthify, we understand the importance of providing compassionate live-in care tailored to your unique needs. Our dedicated team is committed to ensuring that you receive the highest level of support and assistance, right in the comfort of your own home."
          icon={faTooth}
        />
      </div>
    </div>
  );
}

export default Services;
