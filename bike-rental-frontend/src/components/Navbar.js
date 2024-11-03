import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>

        )}
        
      </ul>
    </nav>
  );
};

export default Navbar;
