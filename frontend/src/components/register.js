import React, { useState } from "react";
import { registerUser, verifyUser } from "../services/api";
import axios from "axios";
import { Navigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // 1 = Register, 2 = Verify
  const [message, setMessage] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false); // For redirection

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate email domain
    // if (!email.endsWith("@nitc.ac.in")) {
    //   setMessage("Only emails with @nitc.ac.in domain are allowed.");
    //   return;
    // }

    try {
      const response = await registerUser({ email, password, roles });
      setMessage(response.data.message);
      setStep(2); // Move to verification step
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  const toggleRole = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyUser({ email, password, code });
      alert(response.data.message); // Show alert on success
      setRedirectToLogin(true); // Redirect to login page
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed.");
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="signup-container">
      {step === 1 && (
        <div className="signup-box">
          <div className="signup-form-container">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="tick-box">
                <label>
                  <input
                    type="checkbox"
                    checked={roles.includes("Owner")}
                    onChange={() => toggleRole("Owner")}
                  />
                  Owner
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={roles.includes("Renter")}
                    onChange={() => toggleRole("Renter")}
                  />
                  Renter
                </label>
              </div>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="signup-box verification-container">
          <div className="signup-form-container">
            <h1>Verify Email</h1>
            <form onSubmit={handleVerify}>
              <input
                type="text"
                placeholder="Enter Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button type="submit">Verify</button>
            </form>
          </div>
        </div>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;
