import React, { useEffect, useState } from 'react';
import { fetchBikes, deleteBike } from '../api';

const BikeList = () => {
    const [bikes, setBikes] = useState([]);

    useEffect(() => {
        const getBikes = async () => {
            const data = await fetchBikes();
            setBikes(data);
        };
        getBikes();
    }, []);

    const handleDelete = async (bike) => {
        const response = await deleteBike(bike);
        if (response.ok) setBikes(bikes.filter(b => b.name !== bike.name || b.location !== bike.location));
        else alert('Failed to delete bike');
    };

    return (
        <ul>
            {bikes.map(bike => (
                <li key={bike._id}>
                    {bike.name} - {bike.type} - {bike.location}
                    <button onClick={() => handleDelete(bike)}>Delete</button>
                </li>
            ))}
        </ul>
    );
};

export default BikeList;
