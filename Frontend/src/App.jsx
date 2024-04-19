import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import UserLogin from "./Components/UserLogin";
import GuestLogin from "./Components/GuestLogin";
import DoctorLogin from "./Components/DoctorLogin";
import UserSignup from "./Components/UserSignup";
import GuestSignup from "./Components/GuestSignup";
import DoctorSignup from "./Components/DoctorSignup";
import AppointmentForm from './Components/AppointmentForm';
import UpcomingAppointments from './Components/UpcomingAppointments';
import UserDashboard from "./Pages/UserDashboard";
import UserProfile from "./Components/UserProfile";
import { getDatabase } from "firebase/database";
import UserForgetPassword from "./Components/UserForgetPassword";
import Plans from "./Components/Plans";
import PaymentDetails from "./Components/PaymentDetails";
import Payment from "./Components/Payments"; // Import the Payment component

function App() {
  const [isUser] = useState(false);
  const [isGuest] = useState(false);
  const [isDoctor] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    //const dbRef = ref(db, '/healthify'); // Corrected path

    // onValue(dbRef, (snapshot) => {
    //   setData(snapshot.val());
    // });
  }, []);

  const userId = "your_user_id"; // Set the user ID here
  const plan = "monthly"; // Set the plan here


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
          <Route path="/payment" element={<Payment plan={plan} userId={userId} />} /> {/* Pass plan and userId props */}
          <Route path="/payment-details/:paymentId" element={<PaymentDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
