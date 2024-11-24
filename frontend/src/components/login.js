import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate} from "react-router-dom";
import "./login.css"

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email domain (optional, uncomment if required)
    // if (!email.endsWith("@nitc.ac.in")) {
    //   setMessage("Only emails with @nitc.ac.in domain are allowed.");
    //   return;
    // }

    try {
      const { data } = await loginUser({ email, password });
      setUser(data); // Update user state
      navigate("/dashboard"); // Navigate to dashboard after successful login
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
          </form>
          {message && <p className="error-message">{message}</p>}
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
          <p>
            Forgot your password? <a href="/forgot-password">Reset it here</a>
          </p>
        </div>
        <div className="info-container">
          <h3 className="welcome-text">Welcome to Rentify!</h3>
        </div>

      </div>
    </div>
  );
};

export default Login;
