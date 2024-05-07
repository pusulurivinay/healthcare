import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, off, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../Styles/UserProfile.css'; // Ensure this is the correct path to your CSS file

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const defaultProfilePic = 'C:/Users/naden/Desktop/CapstoneProject/Git/healthcare-main/healthcare-main/Frontend/src/Assets/Profilepic.jpeg' // Update this path
  const [profilePic, setProfilePic] = useState(defaultProfilePic);

  const validationSchema = Yup.object({
    phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    zipCode: Yup.string().required('Zip code is required'),
  });

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const userId = auth.currentUser ? auth.currentUser.uid : null;
  
      if (!userId) {
        console.log('User not authenticated.');
        return;
      }
  
      const db = getDatabase();
      const userRef = ref(db, `healthify/doctor/${userId}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log('User data:', data);
          setUserData(data);
          setProfilePic(data.profilePic || defaultProfilePic);
        } else {
          console.log('No user data found.');
          setUserData({});
        }
        setLoading(false);
      });
      return () => off(userRef);
    };
  
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const storage = getStorage();
    const newStorageRef = storageRef(storage, `profilePics/${userId}`);
    await uploadBytes(newStorageRef, imageFile);
    const url = await getDownloadURL(newStorageRef);
    setProfilePic(url);
    setUserData({ ...userData, profilePic: url });
    await set(ref(getDatabase(), `healthify/doctor/${userId}/profilePic`), url);
  };

  const handleSaveProfile = async (values, { setSubmitting }) => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const db = getDatabase();
      await set(ref(db, `healthify/doctor/${userId}`), { ...values, profilePic });
      setProfileUpdated(true);
      setUserData({ ...values, profilePic });
      console.log('Profile updated:', values);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/doctor-dashboard');
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="profile-picture-section">
            <img src={profilePic} alt="Profile" className="profile-picture" />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Picture</button>
          </div>
          <div className="section">
            <h3>Profile Details</h3>
            <Formik
              initialValues={{
                username: userData.username || '',
                phoneNumber: userData.phoneNumber || '',
                email: userData.email || '',
                address: userData.address || '',
                zipCode: userData.zipCode || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSaveProfile}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field name="username" type="text" placeholder="Username" />
                  <ErrorMessage name="username" component="div" />
                  <Field name="phoneNumber" type="text" placeholder="Phone Number" />
                  <ErrorMessage name="phoneNumber" component="div" />
                  <Field name="email" type="email" placeholder="Email" />
                  <ErrorMessage name="email" component="div" />
                  <Field name="address" type="text" placeholder="Address" />
                  <ErrorMessage name="address" component="div" />
                  <Field name="zipCode" type="text" placeholder="Zip Code" />
                  <ErrorMessage name="zipCode" component="div" />
                  <div className="button-container">
                    <button type="submit" disabled={isSubmitting}>
                      Save
                    </button>
                    <button type="button" onClick={handleBackToDashboard}>
                      Back to Dashboard
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            {profileUpdated && <p className="info-message">Profile details updated successfully!</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorProfile;
