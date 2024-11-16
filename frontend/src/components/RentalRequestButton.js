import React from "react";
import axios from "axios";

const RentalRequestButton = ({ itemId }) => {
  const sendRentalRequest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5002/items/${itemId}/request`,
        {},
        { withCredentials: true }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending rental request:", error);
      alert(error.response?.data?.message || "Failed to send request.");
    }
  };

  return (
    <button onClick={sendRentalRequest} className="btn btn-primary">
      Request Rental
    </button>
  );
};

export default RentalRequestButton;
