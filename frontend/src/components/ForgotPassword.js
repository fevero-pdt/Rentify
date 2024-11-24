import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./forgotpass.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5002/users/forgot-password", { email });
      setMessage(response.data.message);

      // Redirect to the reset password page and pass the email as state
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send verification code.");
    }
  };

  return (
    <div className="comp">
      <div className="forgot-password-container">
  <h3 className="forgot-password-header">Forgot Password</h3>
  <form onSubmit={handleForgotPassword} className="forgot-password-form">
    <div className="form-group">
      <label htmlFor="email" className="form-label">Email:</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="form-input"
      />
    </div>
    <button type="submit" className="form-button">Send Verification Code</button>
  </form>
  {message && <p className="form-message">{message}</p>}
</div>
    </div>

  );
};

export default ForgotPassword;
