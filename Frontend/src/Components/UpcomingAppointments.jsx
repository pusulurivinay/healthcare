import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove, off } from 'firebase/database';
import '../Styles/Common.css';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const fetchAppointments = () => {
      const appointmentsRef = ref(db, 'healthify/appointments');
      onValue(appointmentsRef, (snapshot) => {
        const appointmentsData = snapshot.val();
        if (appointmentsData) {
          const loadedAppointments = Object.keys(appointmentsData).map(id => ({ id, ...appointmentsData[id] }));
          setAppointments(loadedAppointments);
        } else {
          setAppointments([]);
        }
      });
    };

    fetchAppointments();

    return () => {
      // Clean up the listener when the component unmounts
      const appointmentsRef = ref(db, 'healthify/appointments');
      off(appointmentsRef);
    };
  }, [db]);

  const cancelAppointment = async (id) => {
    const appointmentRef = ref(db, `healthify/appointments/${id}`);
    await remove(appointmentRef);
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
