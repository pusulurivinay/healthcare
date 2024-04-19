// WellGuideChecklist.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/WellGuideChecklist.css';

const checklistItems = [
  {
    id: 1,
    title: 'Annual Physical',
    description: 'The CDC recommends regular checkups once per year to catch any health problems early.',
    due: 'Due',
  },
  {
    id: 2,
    title: 'Skin Screening',
    description: 'According to the American Cancer Society, prevention and early detection are the first steps in the fight against cancer.',
    due: 'Due',
  },
  {
    id: 3,
    title: 'Dental Cleaning',
    description: 'The American Dental Association recommends regular cleanings to prevent gum disease, as well as reduce your chances of potentially deadly heart attacks and stroke.',
    due: 'Due',
  },
  {
    id: 4,
    title: 'Vision Exam',
    description: 'The American Academy of Ophthalmology recommends patients who wear contact lenses get vision screenings annually. All adults need vision screenings periodically.',
    due: 'Due',
  },
  {
    id: 5,
    title: 'Flu Shot',
    description: 'Annual flu vaccinations can reduce the risk of flu and its potentially serious complications. Flu shots are recommended every fall.',
    due: 'Due',
  }
];


const WellGuideChecklist = () => {
  let navigate = useNavigate();

  const handleAppointmentClick = () => {
    navigate('/schedule-appointment');
  };

  return (
    <div className="checklist-container">
      <h3 className="checklist-header">Well Guide checklist</h3>
      {checklistItems.map((item) => (
        <div key={item.id} className="checklist-item">
          <div>
            <h4 className="checklist-item-title">{item.title}</h4>
            <p className="checklist-item-description">{item.description}</p>
          </div>
          <button onClick={handleAppointmentClick} className="book-appointment-btn">
            {item.due} - Book your appointment
          </button>
        </div>
      ))}
    </div>
  );
};

export default WellGuideChecklist;
