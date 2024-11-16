import React, { useState } from "react";
import { registerUser, verifyUser } from "../services/api";
// import axios from "axios";
import { Navigate } from "react-router-dom";

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
      const response = await registerUser({ email, password });
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
      // i want to send an alert to the user that the verification was successful
      alert(response.data.message);

      // setMessage(response.data.message);
      setRedirectToLogin(true); // Trigger redirection
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed.");
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {step === 1 && (
        <div>
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
            <button type="submit">Register</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
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
      )}
      <p>{message}</p>
    </div>
  );
};

export default Register;
