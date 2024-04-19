// AppointmentForm.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import '../Styles/AppointmentForm.css';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedDoctor = location.state?.doctor || '';
  const db = getFirestore();
  
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: '',
    date: '',
    time: '',
    doctor: preselectedDoctor,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "appointments"), appointmentDetails);
      navigate('/upcoming-appointments');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
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