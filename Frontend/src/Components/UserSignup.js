import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');

  const handleSignup = async () => {
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

      // Handle post-sign-up logic (e.g., redirecting to a dashboard)
    } catch (error) {
      // Handle sign-up errors (e.g., email already in use)
      console.error(error.message);
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
    </div>
  );
};

export default Signup;
