import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import '../Styles/Common.css';

const ProfileCard = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get the currently logged-in user
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // If user is logged in, fetch the username from the database
      const db = getDatabase();
      const userRef = ref(db, `healthify/doctor/${user.uid}/username`);
      onValue(userRef, (snapshot) => {
        const name = snapshot.val();
        setUserName(name); // Set the username in the state
      });
    }
  }, []);

  return (
    <div className="CareTeam-Container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <h2 className="text-2xl-font-bold">Hello {userName}</h2>
    </div>
  );
};

export default ProfileCard;
