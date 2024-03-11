import React, {useState} from "react";
import DashboardNavbar from "../Components/DashboardNavbar";
import Services from "../Components/Services";
import Footer from "../Components/Footer";
import { getUserDetails } from '../Components/Auth';

function UserDashboard() {
  const [showServices, setShowServices] = useState(false);
  const user = getUserDetails(); // Retrieve user details
  console.log("user details",user);
  const toggleServices = () => {
    setShowServices(!showServices);
  };
  return (
    <div className="home-section">
      <DashboardNavbar toggleServices={toggleServices} user={user}/>
      {showServices && <Services />}
      <Footer />
    </div>
  );
}

export default UserDashboard;
