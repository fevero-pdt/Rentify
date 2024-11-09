import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  
  return (
    <div>
      <h1>Profile</h1>
      {user && <p>Email: {user.email}</p>}
    </div>
  );
};

export default Profile;
