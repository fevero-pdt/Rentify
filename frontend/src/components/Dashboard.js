import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkSession, fetchItems, searchItems } from "../services/api";
import RentalRequestButton from "./RentalRequestButton";
import ViewRequests from "./ViewRequests";

const Dashboard = ({ user, setUser }) => {
  const [items, setItems] = useState([]); // State to store all items
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [query, setQuery] = useState(""); // Search query
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null); // For showing rental requests
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndItems = async () => {
      try {
        const userResponse = await checkSession();
        setUser(userResponse.data);

        const itemsResponse = await fetchItems();
        setItems(itemsResponse.data);
        setSearchResults(itemsResponse.data); // Initialize search results with all items
      } catch (error) {
        console.error("Error fetching user or items:", error);
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndItems();
  }, [setUser, navigate]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSearchResults(items); // Reset search results if query is empty
      return;
    }

    try {
      const response = await searchItems(value); // Call the search API
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching items:", error);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await logoutUser();
  //     setUser(null);
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Failed to logout:", error);
  //   }
  // };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>

      
      <ul>
        <li><Link to="/addItem">Add Items</Link></li>
      </ul>

      <div>
        <input
          type="text"
          placeholder="Search items by name..."
          value={query}
          onChange={handleSearch}
          style={{ width: "300px", padding: "10px", margin: "20px 0" }}
        />
      </div>

      <h2>Available Items</h2>
      {searchResults.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {searchResults.map((item) => (
            <li key={item._id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              <p>Owner: {item.owner?.email || "Unknown"}</p>
              <p>Status: {item.isAvailable ? "Available" : "Rented"}</p>

              {/* Rental Request Button */}
              {item.isAvailable ? (
                <RentalRequestButton itemId={item._id} />
              ) : (
                <p>This item is currently rented.</p>
              )}

              {/* Toggle to View Requests */}
              {item.owner?._id === user._id && (
                <>
                  <button
                    onClick={() =>
                      setSelectedItemId(
                        selectedItemId === item._id ? null : item._id
                      )
                    }
                    className="btn btn-secondary"
                  >
                    {selectedItemId === item._id
                      ? "Hide Requests"
                      : "View Requests"}
                  </button>
                  {selectedItemId === item._id && <ViewRequests itemId={item._id} />}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
