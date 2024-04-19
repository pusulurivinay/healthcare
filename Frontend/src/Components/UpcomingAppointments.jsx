// UpcomingAppointments.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import '../Styles/Common.css';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const loadedAppointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(loadedAppointments); // Add this line to log the data
      setAppointments(loadedAppointments);
    };

    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    await deleteDoc(doc(db, "appointments", id));
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  return (
    <div className="upcoming-appointments">
      <h2>Upcoming Appointments</h2>
      {appointments.map(appointment => (
        <div key={appointment.id} className="appointment">
          <p><strong>Patient:</strong> {appointment.name}</p>
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
          <p><strong>Doctor:</strong> {appointment.doctor}</p>
          <button onClick={() => cancelAppointment(appointment.id)}>Cancel Appointment</button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingAppointments;