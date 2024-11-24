import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import "./navbar.css"; // Adjust path as needed

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call logout API
      setUser(null); // Clear user state
      navigate("/login"); // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="nav-link">
        <img src="/sd.png" alt="Rentify Logo" className="navbar-logo" />
        </Link>
      </div>
      <div className="navbar-right">
        {user?.isAdmin && (
          <li>
            <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
          </li>
        )}
        <ul className="nav-links">
          <li>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
