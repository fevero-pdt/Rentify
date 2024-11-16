import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewRequests = ({ itemId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/items/${itemId}/requests`,
          { withCredentials: true }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        alert("Failed to fetch rental requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [itemId]);

  const respondToRequest = async (requestId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/items/${itemId}/requests/${requestId}`,
        { status },
        { withCredentials: true }
      );
      alert(response.data.message);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );
    } catch (error) {
      console.error("Error responding to request:", error);
      alert("Failed to respond to rental request.");
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div>
      <h3>Rental Requests</h3>
      {requests.length === 0 ? (
        <p>No rental requests.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req._id}>
              <p>
                <strong>Renter Email:</strong> {req.renter?.email || "Unknown"}{" "}
                <strong>Status:</strong> {req.status}
              </p>
              {req.status === "pending" && (
                <div>
                  <button
                    onClick={() => respondToRequest(req._id, "accepted")}
                    className="btn btn-success"
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
    </div>
  );
};

export default ViewRequests;
