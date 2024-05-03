// AppointmentForm.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDatabase, ref, push } from 'firebase/database';
import '../Styles/AppointmentForm.css';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedDoctor = location.state?.doctor || '';
  const db = getDatabase();
  
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: '',
    date: '',
    time: '',
    doctor: preselectedDoctor,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const appointmentsRef = ref(db, 'appointments');
      const newAppointmentRef = push(appointmentsRef);
      await newAppointmentRef.set(appointmentDetails);

      // Send an appointment confirmation email
      sendAppointmentConfirmationEmail(appointmentDetails);

      navigate('/upcoming-appointments');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const sendAppointmentConfirmationEmail = (details) => {
    const mailRef = ref(db, 'mail');
    const newMailRef = push(mailRef);
    newMailRef.set({
      to: details.name,  // Assuming you use the name field for email, replace this with the actual email if available
      message: {
        subject: "Appointment Confirmation",
        text: `Your appointment with Dr. ${details.doctor} on ${details.date} at ${details.time} has been confirmed.`
      }
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAppointmentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

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
        min={today}
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
