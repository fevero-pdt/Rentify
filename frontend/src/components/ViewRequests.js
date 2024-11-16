import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewRequests = ({ itemId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isItemReturned, setIsItemReturned] = useState(false); // Track item return status
  // const [isAvailable, setIsAvailable] = useState(true); // Track item's availability


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Fetch rental requests for the item
        const response = await axios.get(
          `http://localhost:5002/items/${itemId}/requests`,
          { withCredentials: true } // Include session cookies
        );
        setRequests(response.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to fetch rental requests.");
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchRequests();
  }, [itemId]);

  const respondToRequest = async (requestId, status) => {
    try {
      // Respond to a rental request (accept/reject)
      const response = await axios.put(
        `http://localhost:5002/items/${itemId}/requests/${requestId}`,
        { status }, // Pass the status in the request body
        { withCredentials: true }
      );
      alert(response.data.message);

      // Update the status of the request in the UI
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );
    } catch (err) {
      console.error("Error responding to request:", err);
      alert("Failed to respond to rental request.");
    }
  };

  const handleReturnItem = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5002/items/${itemId}/return`,
        {},
        { withCredentials: true }
      );
      alert(response.data.message);

      // Mark the item as returned in the UI
      setIsItemReturned(true);

      // Update the requests to reflect deletion of accepted requests
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.status !== "accepted")
      );
    } catch (err) {
      console.error("Error returning item:", err);
      alert("Failed to return the item.");
    }
  };

  if (loading) return <p>Loading requests...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Rental Requests</h3>
      {requests.length === 0 ? (
        <p>No rental requests available for this item.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {requests.map((req) => (
            <li
              key={req._id}
              style={{
                marginBottom: "1em",
                borderBottom: "1px solid #ccc",
                paddingBottom: "1em",
              }}
            >
              <p>
                <strong>Renter Email:</strong> {req.renter?.email || "Unknown"} <br />
                <strong>Status:</strong> {req.status}
              </p>
              {req.status === "pending" && (
                <div>
                  <button
                    onClick={() => respondToRequest(req._id, "accepted")}
                    className="btn btn-success"
                    style={{ marginRight: "1em" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToRequest(req._id, "rejected")}
                    className="btn btn-danger"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {!isItemReturned ? (
        <button
          onClick={handleReturnItem}
          className="btn btn-warning"
          style={{ marginTop: "1em" }}
        >
          Return Item
        </button>
      ) : (
        <p style={{ color: "green", marginTop: "1em" }}>Item has been returned successfully.</p>
      )}
    </div>
  );
};

export default ViewRequests;
