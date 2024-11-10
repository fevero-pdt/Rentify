import React, { useState } from 'react';
import { addBike } from '../api';

const AddBike = () => {
    const [bike, setBike] = useState({ name: '', type: '', hourlyRate: '', location: '' });

    const handleChange = (e) => setBike({ ...bike, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await addBike(bike);
        if (response.ok) alert('Bike added successfully');
        else alert('Failed to add bike');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Bike Name" onChange={handleChange} required />
            <input name="type" placeholder="Bike Type" onChange={handleChange} required />
            <input name="hourlyRate" placeholder="Hourly Rate" onChange={handleChange} required />
            <input name="location" placeholder="Location" onChange={handleChange} required />
            <button type="submit">Add Bike</button>
        </form>
    );
};

export default AddBike;
