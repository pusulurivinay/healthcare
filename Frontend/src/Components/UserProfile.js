import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../Styles/ProfilePage.css';
import { useLocation } from "react-router-dom";


const UserProfile = () => {
// const navigation = useNavigation();
const location = useLocation();
const { user } = location.state || {};
const [userData, setUserData] = useState(user);
const [editing, setEditing] = useState(false);
const [profileUpdated, setProfileUpdated] = useState(false);
// const [medicalHistoryUpdated, setMedicalHistoryUpdated] = useState(false);
const [saveButtonClicked, setSaveButtonClicked] = useState(false);

// Add this above your component
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone number is required'),
  userName: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
});

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveProfile = async (values) => {
    console.log("it true",editing);
    if (editing) {
      try {

        const token = localStorage.getItem('token'); // Retrieve the token from storage
        const config = {
        headers: {
          Authorization: `Bearer ${token}`,
                },
        };

        // Assume there is an endpoint for updating profile details
        await axios.put('http://localhost:3001/editProfile', values, config);
        setEditing(false);
        setProfileUpdated(true);
        setUserData(values);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
      finally {
        setSaveButtonClicked(false);
      }
    }
  };
  const handleSaveButton = () => {
    setSaveButtonClicked(true);
  };
  // const handleSaveMedicalHistory = async () => {
  //   try {
  //     // Assume there is an endpoint for updating medical history
  //     await axios.put('http://localhost:3001/user-login-userDashboard-userProfile/edit/medical-history', userData);
  //     setEditing(false);
  //     setMedicalHistoryUpdated(true);
  //   } catch (error) {
  //     console.error('Error updating medical history:', error);
  //   }
  // };

  // Delete account (Note that other details also to be deleted related to the user)
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Assume there is an endpoint for deleting the account
        await axios.delete('http://localhost:3001/deleteAccount', config);

        // navigation.navigate('Home');
        
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {/* Profile Details Section */}
      <div className="section">
        <h3>Profile Details</h3>
        <Formik
        initialValues={userData}
        onSubmit={(values) => {
          console.log("save",saveButtonClicked);
          if(saveButtonClicked){
          handleSaveProfile(values);

          }
        }}
        validationSchema={validationSchema}
      >
        <Form>
          <div className="form-group">
            <label htmlFor="userName">User Name</label>
            {editing ? (
              <Field type="text" name="userName"/>
            ) : (
              <div>{userData.userName}</div>
            )}
            <ErrorMessage name="userName" component="div" className="field-error" />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Email</label>
            {editing ? (
              <Field type="text" name="phoneNumber" />
            ) : (
              <div>{userData.phoneNumber}</div>
            )}
            <ErrorMessage name="phoneNumber" component="div" className="field-error" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            {editing ? (
              <Field type="email" name="email" />
            ) : (
              <div>{userData.email}</div>
            )}
            <ErrorMessage name="email" component="div" className="field-error" />
          </div>
          <div className="pbutton-container">
          {editing ? (
            <button type="submit" onClick={
              handleSaveButton}>Save</button>
          ) : (
            <button type="button" onClick={handleEditClick}>Edit</button>
          )}
    </div>
        </Form>
      </Formik>

      {/* Display info message if profile is updated */}
      {profileUpdated && (
        <p className="info-message">Profile details updated successfully!</p>
      )}
      </div>

      {/* <div className="section">
        <h3>Medical History</h3>
        {editing ? (
          <>
          
            <button onClick={handleSaveMedicalHistory}>Save</button>
          </>
        ) : (
          <>
      
            <button onClick={handleEditClick}>Edit</button>
          </>
        )}
        {medicalHistoryUpdated && <p className="info-message">Medical history updated successfully!</p>}
      </div> */}

      {/* Manage Account Section */}
      <div className="section">
        <h3>Manage Account</h3>
        <button onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
};

export default UserProfile;
