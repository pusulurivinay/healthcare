import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../Components/firebase-config';
// import UserDashboard from "../Pages/Home";
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
  };
  const validateEmailOnBlur = () => {
    if (!email) {
      setEmailError('Email is required');
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
    }
    else{
      setEmailError("");
    }
  };

  // Password format validation
  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;
    return re.test(password);
  };

  // Handle Password Change
  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    validatePasswordOnInput(newPassword);
  };

  const validatePasswordOnInput = (password) => {

    if (!password) {
      setPasswordError('Password is required');
      return;
    }
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
  };
    
  const handleLogin = async () => {
    // Basic field validations
    // Clear previous error messages
    setEmailError('');
    setPasswordError('');
    setError('');
    if (!email || !password || !validateEmail(email) || !validatePassword(password)) {
      if (!email) {
        setEmailError('Email is required');
      } else if (!validateEmail(email)) {
        setEmailError('Invalid email format');
      }
  
      if (!password) {
        setPasswordError('Password is required');
      } else if (!validatePassword(password)) {
        validatePasswordOnInput(password);  
      }
  
      return;
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
      setError(error.message);
      // Optionally, update UI to reflect the error
    }
  };

  return (
<div className="container">
      <h2 className="h2">Login</h2>
      {/* Login form fields */}
      <div className="formGroup">
        <label className="label">Email</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={validateEmailOnBlur} // Validate email onBlur
          className={`input ${emailError ? 'error' : ''}`}
        />
        {emailError && <p className="fieldError">{emailError}</p>}
      </div>
      <div className="formGroup">
        <label className="label">Password</label>
        <input
          type="password"
          // placeholder="Password@123"
          value={password}
          onChange={(e) => {
            handlePasswordChange(e.target.value);

          }}
          className={`input ${passwordError ? 'error' : ''}`}
        />
       {password && passwordError && (
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
      {error && <p className="fieldError">{error}</p>}
      <p>
        <Link to="/user-login-forgotPassword">Forgot password?</Link>
      </p>
      <p>
        Don't have an account? <Link to="/user-signup">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
