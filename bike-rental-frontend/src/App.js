import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./components/Login";
import Navbar from "./components/Navbar"; // Import Navbar
import Signup from './components/Signup'; // Import the Signup component


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar /> {/* Add Navbar here */}
        {/* <Signup /> Render the Signup component */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
