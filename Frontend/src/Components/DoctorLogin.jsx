import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../Components/firebase-config';
import "../Styles/Common.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation after successful login

  // Email Validation on change
  const validateEmail = (email) => {
    const re = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    return re.test(email);
  };

  const handleEmailChange = (newEmail) => {
    setEmail(newEmail);
    setEmailError("");
  };

  // Password format validation
  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;
    return re.test(password);
  };

  // Handle Password Change
  const handlePasswordChange = (password) => {
    validatePasswordOnInput(password);

  };

  const validatePasswordOnInput = (password) => {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>?]/;

    const isLowercaseValid = lowercaseRegex.test(password);
    const isUppercaseValid = uppercaseRegex.test(password);
    const isNumberValid = numberRegex.test(password);
    const isSpecialCharValid = specialCharRegex.test(password);
    const isLengthValid = password.length >= 8;

    setPasswordError(
      (!isLowercaseValid ? 'Password must contain at least one lowercase letter\n' : '') +
      (!isUppercaseValid ? 'Password must contain at least one uppercase letter\n' : '') +
      (!isNumberValid ? 'Password must contain at least one number\n' : '') +
      (!isSpecialCharValid ? 'Password must contain at least one special character\n' : '') +
      (!isLengthValid ? 'Password must be at least 8 characters long\n' : '')
    );
    setPassword(password);
    if(password === ''){
    setPasswordError("");
    }
  };
    
  const handleLogin = async () => {
    // Basic field validations
    // Clear previous error messages
    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email || !validateEmail(email)) {
      if (!email) {
        setEmailError('Email is required');
      } else if (!validateEmail(email)) {
        setEmailError('Invalid email format');
      }
      return;
    }
  
    if (!password || !validatePassword(password)) {
      if(!password){
        setPasswordError('Password is required');
        return;
      }
      else if (!validatePassword(password)) {
        validatePasswordOnInput(password);
        return;
      }
    }
    
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, navigate to the dashboard or home page
      console.log("Logged in");
      // Optionally, you can navigate to the dashboard here
      navigate('/user-dashboard');
    } catch (error) {
      // Handle login errors here
      console.log("Error code:", error);
      // Check if the error has a 'code' property
      if (error.code) {
        // Access the error code
        console.log("Error code:", error.code);

        // Handle different error codes accordingly
        if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
          setError("Incorrect email/password combination! Please try again.");
        } else if (error.code === "auth/wrong-password") {
          setError("Incorrect password! Please try again.");
        } else {
          setError("Login failed! Please try again later.");
        }
      } else {
        // If the error object does not have a 'code' property, handle it generically
        setError("Login failed! Please try again later.");
      }
    }
  };
  
  return (
<div className="container">
      <h1 className="h1">
        <Link to="/">
          <img src="/favicon/logo1.ico" alt="Healthify" className="logo" />
        </Link>
      </h1>
      {error && <p className="fieldError">{error}</p>}
      <div className="formGroup">
        <label className="label"><span className="required">*</span>Email</label>
        
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          className={`input ${emailError ? 'error' : ''}`}
        />
        {emailError && <p className="fieldError">{emailError}</p>}
      </div>
      <div className="formGroup">
        <label className="label"><span className="required">*</span>Password</label>
        <input
          type="password" 
          value={password}
          placeholder="Password@123"
          onChange={(e) => handlePasswordChange(e.target.value)}
          className={`input ${passwordError ? 'error' : ''}`}
        />
      {passwordError && (
        <div className="passwordError">
          <p>Password must meet the following criteria:</p>
          <ul>
            {passwordError.split('\n').filter(Boolean).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      </div>
      <div className="buttonContainer">
        <button onClick={handleLogin} className="button">Login</button>
      </div>
      
      <p>
        <Link to="/doctor-login-forgotPassword">Forgot password?</Link>
      </p>
      <p>
        Don't have an account? <Link to="/doctor-signup">Create an account</Link>
      </p>
    </div>
  );
};
//Login page
export default Login;
