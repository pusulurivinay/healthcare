// AppointmentForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/AppointmentForm.css';

const AppointmentForm = () => {
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: '',
    date: '',
    time: '',
    doctor: '',
  });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Here you would typically handle the form submission to your backend server
    console.log(appointmentDetails);

    // Navigate to upcoming appointments page after submission
    navigate('/upcoming-appointments');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAppointmentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <h2>Schedule an Appointment</h2>
      <label htmlFor="name" className='label'>Patient Name:</label>
      <input
      className='text-field'
        type="text"
        id="name"
        name="name"
        value={appointmentDetails.name}
        onChange={handleChange}
        required
      />
      <label htmlFor="date">Date:</label>
      <input
        type="date"
        id="date"
        name="date"
        value={appointmentDetails.date}
        onChange={handleChange}
        required
      />
      <label htmlFor="time">Time:</label>
      <input
        type="time"
        id="time"
        name="time"
        value={appointmentDetails.time}
        onChange={handleChange}
        required
      />
      <label htmlFor="doctor">Doctor:</label>
      <input
        type="text"
        id="doctor"
        name="doctor"
        value={appointmentDetails.doctor}
        onChange={handleChange}
        required
      />
      <button type="submit">Schedule Appointment</button>
    </form>
  );
};

export default AppointmentForm;
