import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/register";
// import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import AddItem from "./components/AddItem";
// import RentItem from "./components/RentItem";
import Profile from "./components/Profile";
import Search from "./components/Search";
import Navbar from "./components/Navbar";
import ViewRequests from "./components/ViewRequests";
import { checkSession } from "./services/api";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await checkSession();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      {user && <Navbar user={user} setUser={setUser} />}
      <Routes>
        {/* Redirect to Dashboard if authenticated */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        {/* <Route
          path="/admin/login"
          element={user ? <Navigate to="/admin/dashboard" /> : <AdminLogin setUser={setUser} />}
        /> */}
        <Route
          path="/admin/dashboard"
          element={
            user && user.isAdmin ? (
              <AdminDashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to={user ? "/dashboard" : "/login"} />
            )
          }
        />

        <Route path="/addItem" element={user ? <AddItem user={user} userEmail={user.email} /> : <Navigate to="/login" />} />
        <Route path="/search" element={user ? <Search /> : <Navigate to="/login" /> } />
        {/* <Route path="/rentItems" element={user ? <RentItem /> : <Navigate to="/login" />} /> */}
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

        <Route
          path="/viewRequests"
          element={user ? <ViewRequests user={user} /> : <Navigate to="/login" />}
        />
        
      </Routes>
    </Router>
  );
};

export default App;
