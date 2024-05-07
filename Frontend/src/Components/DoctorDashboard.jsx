import React, { useState, useEffect } from 'react';
import { getDatabase, ref, orderByChild, equalTo, query, get, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import DashboardNavbar from '../Components/DoctorDashboardNavbar';
import Footer from "../Components/Footer";
import ProfileCard from '../Components/ProfileCardDoctor';




const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const [showServices, setShowServices] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // Use a more descriptive name

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("text",user)
        // Extract only necessary information
        const { uid, email, username, phoneNumber } = user;
        setUserDetails({ uid, email, username, phoneNumber });
      } else {
        setUserDetails(null); // Handle the case when the user is not logged in
      }
    });

    return () => {
      unsubscribe(); // Cleanup subscription on component unmount
    };
  }, []);
  useEffect(() => {
    
    const fetchAppointments = async () => {
      if (!auth.currentUser) {
        console.log('Doctor not logged in');
        navigate('/doctor-login'); // Redirect to login page if not logged in
        return;
      }

      const db = getDatabase();
      const doctorId = auth.currentUser.uid;
      const doctorRef = ref(db, `healthify/doctor/${doctorId}`);

      try {
        const doctorSnapshot = await get(doctorRef);
        if (doctorSnapshot.exists()) {
          const doctorData = doctorSnapshot.val();
          const doctorName = doctorData.username;

          const appointmentsRef = ref(db, 'healthify/appointments');
          const appointmentsQuery = query(appointmentsRef, orderByChild('doctor'), equalTo(doctorName));
          const appointmentsSnapshot = await get(appointmentsQuery);

          if (appointmentsSnapshot.exists()) {
            const appointmentsData = Object.keys(appointmentsSnapshot.val()).map(key => ({
              id: key,
              ...appointmentsSnapshot.val()[key]
            }));
            setAppointments(appointmentsData);
          } else {
            setAppointments([]);
          }
        } else {
          console.log('Doctor data not found');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [auth, navigate]);

  const handleDeleteAppointment = async (appointmentId) => {
    const db = getDatabase();
    const appointmentRef = ref(db, `healthify/appointments/${appointmentId}`);

    try {
      await remove(appointmentRef);
      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
      console.log('Appointment deleted successfully');
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  const navigateToUserProfile = () => {
    navigate('/doctor-profile'); 
  };
  const toggleServices = () => {
    setShowServices(!showServices);
  };

  return (
    <div className="home-section">
  <DashboardNavbar 
  toggleServices={toggleServices}
        user={userDetails}
        navigateToUserProfile={navigateToUserProfile}
  />
  
  <main className="dashboard-container">
    <div className="grid-md-cols-2-gap-4">
      <div> {/* This might be the tag that is not properly closed */}
        <ProfileCard />

        <h1>Appointments</h1>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.name}</td>
                <td>
                  <button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </main>
  <Footer />
</div>

    

  );
};

export default DoctorDashboard;
