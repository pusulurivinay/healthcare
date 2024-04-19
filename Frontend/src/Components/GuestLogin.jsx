import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import './firebase-config';
import UserDashboard from "../Pages/Home";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation after successful login

  const handleLogin = async () => {
    // Basic field validations
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, navigate to the dashboard or home page
      console.log("Logged in");
      // Optionally, you can navigate to the dashboard here
      // navigate('/dashboard');
    } catch (error) {
      // Handle login errors here
      setError(error.message);
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        <Link to="/guest-login-forgotPassword">Forgot password?</Link>
      </p>
      <p>
        Don't have an account? <Link to="/guest-signup">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
