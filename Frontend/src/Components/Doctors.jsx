import React from "react";
import DoctorCard from "./DoctorCard";
import profile1 from "../Assets/profile-1.png";
import profile2 from "../Assets/profile-2.png";
import profile3 from "../Assets/profile-3.png";
import "../Styles/Doctors.css";

function Doctors() {
  return (
    <div className="doctor-section" id="doctors">
      <div className="dt-title-content">
        <h3 className="dt-title">
          <span>Meet Our Doctors</span>
        </h3>

        <p className="dt-description">
          Meet our exceptional team of specialist doctors, dedicated to
          providing top-notch healthcare services at Health Plus. Trust in their
          knowledge and experience to lead you towards a healthier and happier
          life.
        </p>
      </div>

      <div className="dt-cards-content">
        <DoctorCard
          img={profile1}
          name="Dr. Emily Chen"
          title="MD, Family Medicine Specialist"
          description="Dr. Emily Chen is a board-certified family 
          medicine physician with over 10 years of 
          experience in providing comprehensive 
          primary care services to patients of all 
          ages. She is known for her compassionate 
          approach to patient care and her 
          commitment to promoting preventive 
          health measures."
        />
        <DoctorCard
          img={profile2}
          name="Dr. Sarah Patel"
          title="PhD, Clinical Psychologist"
          description="Dr. Sarah Patel is a licensed clinical 
          psychologist specializing in the assessment 
          and treatment of mental health disorders. 
          With expertise in cognitive-behavioral 
          therapy and mindfulness-based 
          interventions, she helps individuals 
          overcome challenges such as anxiety, 
          depression, and trauma. Dr. Patel is 
          dedicated to creating a supportive and 
          non-judgmental environment where her 
          patients feel heard and understood."
        />
        <DoctorCard
          img={profile3}
          name="Dr. Michael Johnson"
          title="DO, Internal Medicine Physician"
          description="Dr. Michael Johnson is a skilled internal 
          medicine physician with a focus on 
          managing complex medical conditions and 
          promoting overall wellness. With a 
          background in osteopathic medicine, he 
          takes a holistic approach to patient care, 
          addressing not only the physical aspects of 
          health but also the emotional and social 
          factors that impact well-being."
        />
        
      </div>
    </div>
  );
}

export default Doctors;
