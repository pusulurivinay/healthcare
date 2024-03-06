// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//import axios from 'axios';
import "./App.css";
import Home from "./Pages/Home";
import UserLogin from "./Components/UserLogin";
import GuestLogin from "./Components/GuestLogin";
import DoctorLogin from "./Components/DoctorLogin";
import UserSignup from "./Components/UserSignup";
import GuestSignup from "./Components/GuestSignup";
import DoctorSignup from "./Components/DoctorSignup";

function App() {
  const [isAuthenticated] = useState(false);
  const [isGuest] = useState(false);
  const [isDoctor] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/check-connection')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error checking SQL connection:', error.message);
      });
  }, []);
 

  return (
    <div className="App">
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/guest-login" element={<GuestLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />

          {isAuthenticated && <Route path="/user-signup" element={<Navigate to="/home" />} />}
          {isGuest && <Route path="/guest-signup" element={<Navigate to="/home" />} />}
          {isDoctor && <Route path="/doctor-signup" element={<Navigate to="/home" />} />}

          {!isAuthenticated && <Route path="/user-signup" element={<UserSignup />} />}
          {!isGuest && <Route path="/guest-signup" element={<GuestSignup />} />}
          {!isDoctor && <Route path="/doctor-signup" element={<DoctorSignup />} />}

          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
