import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import "../styles/Navbar.css"; // Adjust path as needed

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
      <div className="logo">
        <Link to="/dashboard" className="nav-link">
          Rentify
        </Link>
      </div>
      <ul className="nav-links">
        
          {user?.isAdmin && (
            <li>
              <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
            </li>
          )}
        
        {/* <li>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li> */}
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
    </nav>
  );
};

export default Navbar;
