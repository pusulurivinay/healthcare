import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation , useNavigate} from 'react-router-dom';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const UserProfile = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const [userData, setUserData] = useState(user);
  const [editing, setEditing] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone number is required'),
    userName: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  });

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    const db = getDatabase();
    const userRef = ref(db, `healthify/users/${userId}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      setUserData(snapshot.val());
      setLoading(false); // Set loading to false when data is fetched
    });

    return () => {
      unsubscribe(); // Cleanup subscription on component unmount
    };
  }, []);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveProfile = async (values) => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    try {
      const db = getDatabase();
      const userRef = ref(db, `healthify/users/${userId}`);

      // Update user profile in Firebase Realtime Database
      await set(userRef, values);
      setEditing(false);
      setProfileUpdated(true);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const navigate = useNavigate();

const handleBackToDashboard = () => {
  navigate('/user-dashboard');
};


  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Profile Details Section */}
          <div className="section">
            <h3>Profile Details</h3>
            <Formik
              initialValues={userData}
              onSubmit={(values) => handleSaveProfile(values)}
              validationSchema={validationSchema}
            >
              <Form>
                <div className="form-group">
                  <label htmlFor="userName">User Name</label>
                  {editing ? (
                    <Field type="text" name="userName" />
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
                    <button type="submit">Save</button>
                  ) : (
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
            </Formik>

            {/* Display info message if profile is updated */}
            {profileUpdated && (
              <p className="info-message">Profile details updated successfully!</p>
            )}
          </div>

          {/* Manage Account Section */}
          <div className="section">
            <h3>Manage Account</h3>
            {/* Add your delete account button here */}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
