import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from 'firebase/database'; // Import Firebase database methods
import "../Styles/Navbar.css";

function DashboardNavbar({ toggleServices, user }) {
  const [nav, setNav] = useState(false);
  const [userName, setUserName] = useState(""); // State to store the user's name
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchUserName = async () => {
        try {
          const db = getDatabase();
          const userRef = ref(db, `healthify/users/${user.uid}/username`);
          onValue(userRef, (snapshot) => {
            const name = snapshot.val();
            setUserName(name); // Set the user's name in the state
          });
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      };

      fetchUserName();
    }
  }, [user]);

  const openNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    // Implement logout functionality here
    // For example, clear user session and navigate to the home page
    navigate("/");
  };

  return (
    <div className="navbar-section">
      <h1 className="navbar-title">
        <Link to="/">
          <img src="/favicon/logo1.ico" alt="Healthify" className="logo" />
        </Link>
      </h1>

      {/* Desktop */}
      <ul className="navbar-items">

        <li>
          <a href="#about" className="navbar-links">
            About
          </a>
        </li>
        {/* Link to the Plans component */}
        <li>
          <a href="#contact" className="navbar-links">
            Contact
          </a>
        </li>
        <li className="profile-icon-desktop">
          {user && (
            <>
              <Link to="/user-profile" state={{ user }}>
                <span className="profile-label">{userName}</span>
                <FontAwesomeIcon icon={faCircleUser} className="profile-icon" />
              </Link>
              <Link to="/" onClick={handleLogout} className="navbar-links logout-link">Logout</Link>
            </>
          )}
        </li>
      </ul>

      {/* Mobile */}
      <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar-close">
          <FontAwesomeIcon icon={faXmark} className="hamb-icon" />
        </div>

        <ul className="mobile-navbar-links">
          <li>
            <Link onClick={openNav} href="#about">
              About
            </Link>
          </li>
          {/* Link to the Plans component */}
          <li>
            <Link onClick={openNav} href="#contact">
              Contact
            </Link>
          </li>
          <li className="profile-icon-mobile">
            {user && (
              <>
                <Link to="/user-profile" state={{ user }}>
                  <span className="profile-label-mobile">{userName}</span>
                  <FontAwesomeIcon icon={faCircleUser} className="profile-icon" />
                </Link>
              </>
            )}
          </li>
          <li className="logout">
          <Link to="/" onClick={handleLogout} className="navbar-links logout-link">Logout</Link>
          </li>
        </ul>
      </div>
      <div className="mobile-nav">
        <FontAwesomeIcon
          icon={faBars}
          onClick={openNav}
          className="hamb-icon"
        />
      </div>
    </div>
  );
}

export default DashboardNavbar;
