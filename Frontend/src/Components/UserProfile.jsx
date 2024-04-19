import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, off, set, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import '../Styles/UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone number is required'),
    username: Yup.string().min(3, 'username must be at least 3 characters').required('username is required'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : null;

        if (!userId) {
          console.log('User not authenticated.');
          return;
        }

        const db = getDatabase();
        const userRef = ref(db, `healthify/users/${userId}`);
        const snapshot = await onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          console.log('User data:', userData);
          setUserData(userData);
          setLoading(false);
        });
        return () => off(snapshot);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      console.log('Cleanup function called.');
    };
  }, []);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveProfile = async (values, { setSubmitting }) => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const db = getDatabase();
      const userRef = ref(db, `healthify/users/${userId}`);

      await set(userRef, values);
      setEditing(false);
      setProfileUpdated(true);
      setUserData(values);
      console.log('Profile updated:', values);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        throw new Error('User not authenticated.');
      }
  
      const userId = user.uid;
      const db = getDatabase();
      const userRef = ref(db, `healthify/users/${userId}`);
  
      // Delete user account
      await user.delete();
  
      // Remove user data from the database
      await remove(userRef);
      
  
      navigate('/'); // Redirect to the home page after deleting the account
    } catch (error) {
      console.error('Error deleting account:', error);
      // Handle the error (e.g., show error message to the user)
    }
  };
  

  const handleBackToDashboard = () => {
    navigate('/user-dashboard');
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <>
          <div className="section">
            <h3>Profile Details</h3>
            <Formik
              initialValues={{
                username: userData.username || '',
                phoneNumber: userData.phoneNumber || '',
                email: userData.email || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSaveProfile} // Call handleSaveProfile onSubmit
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="form-group">
                    <label htmlFor="username">User Name</label>
                    {editing ? (
                      <Field type="text" name="username" />
                    ) : (
                      <div>{userData.username}</div>
                    )}
                    <ErrorMessage name="username" component="div" className="field-error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    {editing ? (
                      <Field type="text" name="phoneNumber" />
                    ) : (
                      <div>{userData.phoneNumber}</div>
                    )}
                    <ErrorMessage name="phoneNumber" component="div" className="field-error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div>{userData.email}</div>
                  </div>
                  <div className="pbutton-container">
                    {editing && (
                      <button type="submit" disabled={isSubmitting}>
                        Save
                      </button>
                    )}
                    {!editing && (
                      <>
                        <button type="button" onClick={handleEditClick}>
                          Edit
                        </button>
                        <button type="button" onClick={handleBackToDashboard}>
                          Back to Dashboard
                        </button>
                      </>
                    )}
                  </div>
                </Form>
              )}
            </Formik>


            {profileUpdated && (
              <p className="info-message">Profile details updated successfully!</p>
            )}
          </div>

          <div className="section">
            <h3>Manage Account</h3>
            <button onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
