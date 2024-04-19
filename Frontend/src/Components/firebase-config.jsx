import React, { Component } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBQZVL3bFE9ObKfIjbHcmgV_JGvnoo14XA",
    authDomain: "healthcare-77225.firebaseapp.com",
    projectId: "healthcare-77225",
    storageBucket: "healthcare-77225.appspot.com",
    messagingSenderId: "718428462129",
    appId: "1:718428462129:web:dad83caa6b29af7b110910",
    measurementId: "G-JFSB56V33M"
};

const app = initializeApp(firebaseConfig);

const TestFirebase = () => {
  try {
    const auth = getAuth(app);
    console.log('Firebase Auth:', auth);
    return <p>Firebase initialized successfully.</p>;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return <p>Error initializing Firebase.</p>;
  }
};

export default app;
