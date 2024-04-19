// UpcomingAppointments.js
import React, { useState, useEffect } from 'react';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([
    // This is mock data, you'd fetch this from your backend normally
    { doctor: 'Dr. Smith' },
    { doctor: 'Dr. Johnson' },
  ]);

  useEffect(() => {
    // Fetch upcoming appointments from the backend and set them in state
    // This is where you'd make an API call to your backend
    // For example:
    // fetch('/api/appointments/upcoming')
    //   .then(response => response.json())
    //   .then(data => setAppointments(data));
  }, []);

  return (
    <div className="upcoming-appointments">
      <h2>Upcoming Appointments</h2>
      {appointments.map(appointment => (
        <div key={appointment.id} className="appointment">
          <p><strong>Patient:</strong> {appointment.name}</p>
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
          <p><strong>Doctor:</strong> {appointment.doctor}</p>
        </div>
      ))}
    </div>
  );
};

export default UpcomingAppointments;
