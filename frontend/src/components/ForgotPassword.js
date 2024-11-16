import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h3>Forgot Password</h3>
      <form onSubmit={handleForgotPassword}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Verification Code</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
