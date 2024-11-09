import React from "react";
import { useSelector } from "react-redux";
import BikeItem from "./BikeItem";

const BikeList = () => {
  // Retrieve the list of bikes from the Redux store
  const bikes = useSelector((state) => state.bikes);
  // Retrieve the current user from the Redux store
  const user = useSelector((state) => state.user);

  return (
    <div>
      {bikes.map((bike) => (
        <BikeItem key={bike.id} bike={bike} user={user} />
      ))}
    </div>
  );
};

export default BikeList;
