// Import necessary React components
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);

  const openNav = () => {
    setNav(!nav);
  };

  const toggleLoginDropdown = () => {
    setLoginDropdown(!loginDropdown);
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
          <Link to="/" className="navbar-links">
            Home
          </Link>
        </li>
        <li>
          <a href="#services" className="navbar-links">
            Services
          </a>
        </li>
        <li>
          <a href="#about" className="navbar-links">
            About
          </a>
        </li>
         <li className={`navbar-dropdown ${loginDropdown ? 'active' : ''}`} onClick={toggleLoginDropdown}>
          <a href="#login" className="navbar-links">
            Log In / Sign Up
          </a>
          {loginDropdown && (
            <div className="dropdown-content">
              <div className="dropdown-column">
                <Link to="/user-login">User</Link>
              </div>
              <div className="dropdown-column">
                <Link to="/guest-login">Guest</Link>
              </div>
              <div className="dropdown-column">
                <Link to="/doctor-login">Doctor</Link>
              </div>
            </div>
          )}
        </li>
        <li>
          <a href="#contact" className="navbar-links">
            Contact
          </a>
        </li>
      </ul>

      {/* Mobile */}
      <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar-close">
          <FontAwesomeIcon icon={faXmark} className="hamb-icon" />
        </div>

        <ul className="mobile-navbar-links">
          <li>
            <Link onClick={openNav} to="/">
              Home
            </Link>
          </li>
          <li>
            <a onClick={openNav} href="#services">
              Services
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#about">
              About
            </a>
          </li>
          <li className="navbar-dropdown" onClick={toggleLoginDropdown}>
            <a href="#login">
              Log In / Sign Up
            </a>
            {loginDropdown && (
              <div className="dropdown-content">
              <div className="dropdown-column">
                <Link to="/user-login">User</Link>
              </div>
              <div className="dropdown-column">
                <Link to="/guest-login">Guest</Link>
              </div>
              <div className="dropdown-column">
                <Link to="/doctor-login">Doctor</Link>
              </div>
            </div>
            )}
          </li>
          <li>
            <a onClick={openNav} href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Hamburger Icon */}
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

export default Navbar;
