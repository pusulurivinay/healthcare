import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import UserLogin from './Components/UserLogin';
import GuestLogin from './Components/GuestLogin';
import DoctorLogin from './Components/DoctorLogin';
import UserSignup from './Components/UserSignup';
import GuestSignup from './Components/GuestSignup';
import DoctorSignup from './Components/DoctorSignup';
import AppointmentForm from './Components/AppointmentForm';
import UpcomingAppointments from './Components/UpcomingAppointments';
import UserDashboard from './Pages/UserDashboard';
import UserProfile from './Components/UserProfile';
import { getAuth } from 'firebase/auth';
import UserForgetPassword from './Components/UserForgetPassword';
import Plans from './Components/Plans';
import PaymentDetails from './Components/PaymentDetails';
import Payment from './Components/Payments';
import ViewPlans from './Components/ViewPlans';

function App() {
  const [isUser] = useState(false);
  const [isGuest] = useState(false);
  const [isDoctor] = useState(false);
  const [userId, setUserId] = useState(null);
  const auth = getAuth(); // Get the auth instance

  useEffect(() => {
    // Fetch the user ID asynchronously
    const fetchUserId = async () => {
      if (auth.currentUser) {
        setUserId(auth.currentUser.uid);
      }
    };
  
    fetchUserId();
  }, [auth]);

  return (
    <div className="App">
      <Router>
        <Routes> {/* Wrap your Route components within Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/guest-login" element={<GuestLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />

          {/* Conditional navigation */}
          {isUser && <Route path="/user-signup" element={<Navigate to="/home" replace />} />}
          {isGuest && <Route path="/guest-signup" element={<Navigate to="/home" replace />} />}
          {isDoctor && <Route path="/doctor-signup" element={<Navigate to="/home" replace />} />}

          {/* Signup routes */}
          {!isUser && <Route path="/user-signup" element={<UserSignup />} />}
          {!isGuest && <Route path="/guest-signup" element={<GuestSignup />} />}
          {!isDoctor && <Route path="/doctor-signup" element={<DoctorSignup />} />}

          {/* Additional routes */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-login-forgotPassword" element={<UserForgetPassword />} />
          <Route path="/guest-login-forgotPassword" element={<UserForgetPassword />} />
          <Route path="/doctor-login-forgotPassword" element={<UserForgetPassword />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/schedule-appointment" element={<AppointmentForm />} />
          <Route path="/upcoming-appointments" element={<UpcomingAppointments />} />
          <Route path="/plan-pricing" element={<Plans userId={userId} />} /> {/* Pass userId as prop */}
          <Route path="/payment" element={<Payment userId={userId} />} />
          <Route path="/payment-details/:paymentId" element={<PaymentDetails />} />
          <Route path="/view-plans" element={<ViewPlans />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;