import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, push, set } from 'firebase/database';
import '../Styles/AppointmentForm.css';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedDoctor = location.state?.doctor || '';
  const db = getDatabase();
  const firestore = getFirestore();

  const [appointmentDetails, setAppointmentDetails] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    doctor: preselectedDoctor,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const appointmentsRef = ref(db, '/healthify/appointments');
      const newAppointmentRef = push(appointmentsRef);
      await set(newAppointmentRef, appointmentDetails);

      // Send an appointment confirmation email
      await sendAppointmentConfirmationEmail(appointmentDetails);

      navigate('/upcoming-appointments');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const sendAppointmentConfirmationEmail = async (appointmentDetails) => {
    try {
      await addDoc(collection(firestore, 'mail'), {
        to: appointmentDetails.email,
        message: {
          subject: 'Appointment Confirmation',
          text: `Your appointment on ${appointmentDetails.date} at ${appointmentDetails.time} has been confirmed.`,
          html: `<p>Hi,<br><br>Your appointment on <strong>${appointmentDetails.date}</strong> at <strong>${appointmentDetails.time}</strong> has been confirmed.</p><br><br>
                <p>Thank you,<br>
                The Healthify Team</p>
                `,
        },
        timestamp: serverTimestamp(), // Add timestamp
      });
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <h2>Schedule an Appointment</h2>
      <label htmlFor="name" className="label">
        Patient Name:
      </label>
      <input className="text-field" type="text" id="name" name="name" value={appointmentDetails.name} onChange={handleChange} required />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" value={appointmentDetails.email} onChange={handleChange} required />
      <label htmlFor="date">Date:</label>
      <input type="date" id="date" name="date" min={today} value={appointmentDetails.date} onChange={handleChange} required />
      <label htmlFor="time">Time:</label>
      <input type="time" id="time" name="time" value={appointmentDetails.time} onChange={handleChange} required />
      <label htmlFor="doctor">Doctor:</label>
      <input type="text" id="doctor" name="doctor" value={appointmentDetails.doctor} onChange={handleChange} required />
      <button type="submit">Schedule Appointment</button>
    </form>
  );
};

export default AppointmentForm;
