import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBikes } from "../redux/bikeSlice";

const BikeList = () => {
  const dispatch = useDispatch();
  const bikes = useSelector((state) => state.bikes.list);

  useEffect(() => {
    dispatch(fetchBikes());
  }, [dispatch]);

  return (
    <div>
      <h2>Available Bikes</h2>
      <ul>
        {bikes.map((bike) => (
          <li key={bike._id}>
            {bike.name} - ${bike.hourlyRate}/hour
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BikeList;
