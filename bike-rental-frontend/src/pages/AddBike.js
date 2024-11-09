import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Assuming Redux for user state
import { addBike } from "../redux/bikeSlice"; // Redux action to add bike

const AddBike = () => {
  const [bikeDetails, setBikeDetails] = useState({
    name: "",
    model: "",
    price: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      dispatch(addBike({ ...bikeDetails, ownerId: user.id }));
    } else {
      alert("Please login to add a bike.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Bike Name"
        value={bikeDetails.name}
        onChange={(e) => setBikeDetails({ ...bikeDetails, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Model"
        value={bikeDetails.model}
        onChange={(e) => setBikeDetails({ ...bikeDetails, model: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price per day"
        value={bikeDetails.price}
        onChange={(e) => setBikeDetails({ ...bikeDetails, price: e.target.value })}
      />
      <button type="submit">Add Bike</button>
    </form>
  );
};

export default AddBike;

