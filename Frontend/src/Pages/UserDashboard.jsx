import React, {useEffect, useState} from "react";
import DashboardNavbar from "../Components/DashboardNavbar";
import Services from "../Components/Services";
// import Plans from "../Components/Plans";
import Footer from "../Components/Footer";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from '../Components/Header';
import ProfileCard from '../Components/ProfileCard';
import CareTeamCard from '../Components/CareTeamCard';
import WellGuideChecklist from '../Components/WellGuideChecklist';


function UserDashboard() {
  const [showServices, setShowServices] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // Use a more descriptive name

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Extract only necessary information
        const { uid, email, displayName, phoneNumber } = user;
        setUserDetails({ uid, email, displayName, phoneNumber });
      } else {
        setUserDetails(null); // Handle the case when the user is not logged in
      }
    });

    return () => {
      unsubscribe(); // Cleanup subscription on component unmount
    };
  }, []);

  const navigate = useNavigate(); // useNavigate hook

  const toggleServices = () => {
    setShowServices(!showServices);
  };

  const navigateToUserProfile = () => {
    navigate('/user-profile'); // Navigate to the user profile page
  };

  return (
    <div className="home-section">
      <DashboardNavbar
        toggleServices={toggleServices}
        user={userDetails}
        navigateToUserProfile={navigateToUserProfile}
      />
      {showServices && <Services />}
      <Header />
      <main className="container mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <ProfileCard />
            <CareTeamCard />
          </div>
          <WellGuideChecklist />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UserDashboard;