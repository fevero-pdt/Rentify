
import React from "react";
import { useDispatch } from "react-redux";
import { deleteBike } from "../redux/bikeSlice";

const BikeItem = ({ bike, user }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (user && (user.id === bike.ownerId || user.role === "admin")) {
      dispatch(deleteBike(bike.id));
    } else {
      alert("You do not have permission to delete this bike.");
    }
  };

  return (
    <div>
      <h3>{bike.name}</h3>
      <p>{bike.model}</p>
      <p>{bike.price}</p>
      {(user.id === bike.ownerId || user.role === "admin") && (
        <button onClick={handleDelete}>Delete</button>
      )}
    </div>
  );
};

export default BikeItem;
