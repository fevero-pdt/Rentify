import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RentalRequestButton = ({ itemId }) => {
  const [desiredDate, setDesiredDate] = useState(new Date()); // State for the selected date

  const sendRentalRequest = async () => {
    try {
      const response = await axios.post(
          `http://localhost:5002/items/${itemId}/request`,
          { desiredDate }, // Correct payload
          { withCredentials: true }
      );
      alert(response.data.message);
    } catch (error) {
        console.error("Error sending rental request:", error);
        alert(error.response?.data?.message || "Failed to send request.");
    }
  };

  return (
    <div>
      <div className="date-picker-container">
        <label>Select Desired Date:</label>
        <DatePicker
          selected={desiredDate}
          onChange={(date) => setDesiredDate(date)} // Update state when date changes
          minDate={new Date()} // Prevent past dates
          className="form-control"
        />
      </div>
      <button onClick={sendRentalRequest} className="btn btn-primary" style={{ marginTop: "10px" }}>
        Request Rental
      </button>
    </div>
  );
};

export default RentalRequestButton;
