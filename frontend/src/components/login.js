import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate} from "react-router-dom";

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
    <div>
      <h1>Login</h1>
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
      <p>{message}</p>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
      <p>
        Forgot your password? <a href="/forgot-password">Reset it here</a>
      </p>
      {/* <p>
        Are you an admin? <a href="/admin/login">Go to Admin Login</a>
      </p> */}
    </div>
  );
};

export default Login;
