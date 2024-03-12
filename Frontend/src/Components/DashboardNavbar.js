// Import necessary React components
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Navbar.css";
import { Link } from "react-router-dom";


function DashboardNavbar({ toggleServices , user}) {
  const [nav, setNav] = useState(false);

  const openNav = () => {
    setNav(!nav);
  };

  // const navigateToProfile = () => {
  //   navigate("/user-login-userDashboard-userProfile", { state: { user } });
  // };


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
          <span onClick={toggleServices} className="navbar-links">
            Services
          </span>
        </li>

        <li>
          <a href="#about" className="navbar-links">
            About
          </a>
        </li>
        <li>
          <a href="#plan" className="navbar-links">
            Plans & Pricing
          </a>
        </li>
        <li>
          <a href="#contact" className="navbar-links">
            Contact
          </a>
        </li>
        <li className="profile-icon-desktop" >
            {user && (
              <>
                <Link to="/user-profile" state={{ user }}>
            <span className="profile-label">{user ? user.userName : ""}</span>
            <FontAwesomeIcon icon={faCircleUser} className="profile-icon" />
          </Link>
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
            <Link onClick={openNav} to="#categories">
              Services
            </Link>
          </li>
          <li>
            <Link onClick={openNav} href="#about">
              About
            </Link>
          </li>
          <li>
            <Link onClick={openNav} href="#plan">
              Plans & Pricing
            </Link>
          </li>
          <li>
            <Link onClick={openNav} href="#contact">
              Contact
            </Link>
          </li>
          <li className="profile-icon-mobile">
  {user && (
    <>
      <Link to="/user-profile" state={{ user }}>
              <span className="profile-label-mobile">{user ? user.userName : ""}</span>
              <FontAwesomeIcon icon={faCircleUser} className="profile-icon" />
            </Link></>
  )}
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
