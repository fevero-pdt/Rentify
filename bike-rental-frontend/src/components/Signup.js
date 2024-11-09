import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import api from '../api'; // Import the Axios instance
import { setUser, setMessage } from '../redux/userSlice'; // Import actions
// import './Signup.css'; // Import CSS for Signup styling

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch(); // Get the dispatch function

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/signup', {
                username,
                email,
                password,
            });
            dispatch(setUser(response.data.user)); // Dispatch setUser action
            dispatch(setMessage(response.data.message)); // Dispatch setMessage action
            // Reset form fields
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (error) {
            dispatch(setMessage(error.response.data.message || "Something went wrong."));
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
