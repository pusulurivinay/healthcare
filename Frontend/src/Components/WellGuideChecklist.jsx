import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/WellGuideChecklist.css';

const WellGuideChecklist = () => {
  const navigate = useNavigate();

  const handleAppointmentClick = (doctor) => {
    navigate('/schedule-appointment', { state: { doctor } });
  };

  // Assuming you have a list of doctor IDs and corresponding titles
  const checklistItems = [
    // Add more details as needed
    { id: 1, title: 'Annual Physical', doctor: 'Dr. Adams' },
    { id: 2, title: 'Skin Screening', doctor: 'Dr. Brown' },
    { id: 3, title: 'Skin Screening', doctor: 'Dr. Brown3' },
    { id: 4, title: 'Skin Screening', doctor: 'Dr. Brown4' },
    // Continue for other items
  ];

  
return (
  <div className="checklist-container">
    <h3 className="checklist-header">Well Guide Checklist</h3>
    {checklistItems.map((item) => (
      <div key={item.id} className="checklist-item">
        <h4 className="checklist-item-title">{item.title}</h4>
        <button onClick={() => handleAppointmentClick(item.doctor)} className="book-appointment-btn">
          Book your appointment
        </button>
      </div>
    ))}
  </div>
);
};

export default WellGuideChecklist;