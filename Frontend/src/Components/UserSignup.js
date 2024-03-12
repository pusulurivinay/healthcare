import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    // Basic field validations
    if (!email || !password || !phoneNumber || !username) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      return;
    }

    // Password validation (add more criteria as needed)
    if (password.length < 8) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Phone number validation (add more criteria as needed)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Invalid phone number');
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
        "phone number": phoneNumber,
        password: password, // Storing passwords in plaintext is not recommended
      });

      // Reset error state
      setError('');

      // Handle post-sign-up logic (e.g., redirecting to a dashboard)
    } catch (error) {
      // Handle sign-up errors (e.g., email already in use)
      setError(error.message);
    }
  };

  return (
    <div>
      {/* Signup form fields */}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Signup;
