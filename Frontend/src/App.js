import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import UserLogin from "./Components/UserLogin";
import GuestLogin from "./Components/GuestLogin";
import DoctorLogin from "./Components/DoctorLogin";
import UserSignup from "./Components/UserSignup";
import GuestSignup from "./Components/GuestSignup";
import DoctorSignup from "./Components/DoctorSignup";

import UserDashboard from "./Pages/UserDashboard";
import UserProfile from "./Components/UserProfile";
import { getDatabase, ref, set, onValue } from "firebase/database";
import UserForgetPassword from "./Components/UserForgetPassword";


function App() {
  const [isUser] = useState(false);
  const [isGuest] = useState(false);
  const [isDoctor] = useState(false);
  const [setData] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, '/healthify'); // Corrected path

    // onValue(dbRef, (snapshot) => {
    //   setData(snapshot.val());
    // });
  }, []);

  const handleWriteData = () => {
    const db = getDatabase();
    set(ref(db, '/healthify'), 'Hello, Firebase!'); // Corrected path
  };

  return (
    <div className="App">
      <Router>
        <Routes> {/* Wrap your Route components within Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/guest-login" element={<GuestLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          


          {/* Conditional navigation */}
          {isUser && <Route path="/user-signup" element={<UserDashboard />} />}
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
          {/* <Route path="/user-profile" element={<UserProfile />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
