import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate,Link } from 'react-router-dom';
import '../Components/firebase-config';
import UserDashboard from "../Pages/Home";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // For navigation after successful login

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, navigate to the dashboard or home page
      console.log("Logged in");
    } catch (error) {
      // Handle login errors here
      console.error(error.message);
      // Optionally, update UI to reflect the error
    }
  };

  return (
    <div>
      {/* Login form fields */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
      <Link to="/doctor-login-forgotPassword">Forgot password?</Link>
    </p>
    <p>
      Don't have an account? <Link to="/doctor-signup">Create an account</Link>
    </p>
    </div>

  );
};

export default Login;

    
