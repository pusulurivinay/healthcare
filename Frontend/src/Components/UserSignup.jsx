import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import "../Styles/Common.css";
import { useNavigate, Link } from 'react-router-dom';
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handlePhoneNumberChange = (newPhone) => {
    setPhoneNumber(newPhone);
    setPhoneNumberError("");
  };
  

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };
    
  const handleSignup = async () => {
    // Basic field validations
    setEmailError('');
    setPasswordError('');
    setPhoneNumberError('');
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

    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      if (!phoneNumber) {
        setPhoneNumberError('Phone Number is required');
      } else if (!validatePhoneNumber(phoneNumber)) {
        setPhoneNumberError('Invalid Phone Number format');
      }
      return;
    }

    

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // User is successfully created, now let's add additional information to the Realtime Database
      const db = getDatabase();

      set(ref(db, `healthify/users/${user.uid}`), {
        username: username,
        phoneNumber: phoneNumber,
        password: password, // Storing passwords in plaintext is not recommended
        email: email,
      });

      // Reset error state
      setError('Sign Up Successfull !!');
      // Navigate to home page after successful signup
      navigate('/user-login');

      // Handle post-sign-up logic (e.g., redirecting to a dashboard)
    } catch (error) {
      // Handle sign-up errors (e.g., email already in use)
      setError(error.message);
      if (error.code) {
        // Access the error code
        console.log("Error code:", error.code);
        // Handle different error codes accordingly
        if (error.code === "auth/email-already-in-use") {
          setError("Email already exists! Please use different email.");
        } else {
          setError("Sign Up failed! Please try again later.");
        }
      } else {
        // If the error object does not have a 'code' property, handle it generically
        // setError("Sign Up failed! Please try again later.");
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
    
    <div className="formGroup">
      <label className="label"><span className="required">*</span>Phone Number</label>
      
      <input
        type="text"
        placeholder="1234567890"
        value={phoneNumber}
        onChange={(e) => handlePhoneNumberChange(e.target.value)}
        className={`input ${phoneNumberError ? 'error' : ''}`}
      />
      {phoneNumberError && <p className="fieldError">{phoneNumberError}</p>}
    </div>
    <div className="formGroup">
      <label className="label">User Name</label>
      <input
        type="text"
        placeholder="abcxyz"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>
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
      <button onClick={handleSignup} className="button">Sign Up</button>
        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
    </div>
  </div>
  );
};

export default Signup;
