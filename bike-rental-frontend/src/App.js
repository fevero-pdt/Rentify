import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Home from "./pages/Home";
import AddBike from "./pages/AddBike";
import Profile from "./pages/Profile";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Signup from './components/Signup';


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-bike" element={<AddBike />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
