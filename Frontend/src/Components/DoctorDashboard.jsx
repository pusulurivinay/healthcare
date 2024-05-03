import React, { useEffect, useState } from 'react';
import DoctorDashboardNavbar from '../Components/DoctorDashboardNavbar';
import AppointmentList from '../Components/AppointmentList';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import "../Styles/Common.css";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("doctorId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const apps = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAppointments(apps);
        });
        return () => unsubscribe();
      } else {
        navigate('/login');
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [auth, db, navigate]);

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setNotes('');
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const sendNotesToPatient = () => {
    if (!selectedAppointment) return;
    // Example function to send email, you need to implement this
    sendEmail(selectedAppointment.patientEmail, notes)
      .then(() => alert('Notes sent to patient'))
      .catch(error => console.error('Error sending email', error));
  };

  return (
    <div className="home-section">
      <DoctorDashboardNavbar />
      <main className="dashboard-container">
        <AppointmentList
          appointments={appointments}
          onSelectAppointment={handleSelectAppointment}
        />
        {selectedAppointment && (
          <div>
            <h2>Write Notes for {selectedAppointment.patientName}</h2>
            <textarea value={notes} onChange={handleNotesChange}></textarea>
            <button onClick={sendNotesToPatient}>Send Notes</button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default DoctorDashboard;
