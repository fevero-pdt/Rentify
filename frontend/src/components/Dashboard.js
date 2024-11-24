import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkSession, fetchItems, searchItems } from "../services/api";
import RentalRequestButton from "./RentalRequestButton";
import ViewRequests from "./ViewRequests";
import "./dashboard.css"

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
    <div className="hehe">
      <div className="top-container">
      <img src="/CCCCC.jpg" alt="car" className="cc"/>
        <div className="writing">
          <h1 className="text-center mb-4">Rentify</h1>
          <p>Your <span className="pro">go-to</span> platform for rentals</p>
        </div>
      </div>
      <div className="add-item-dash">
        <ul>
         <p className="dramatic-text">
        You have something to give out for rent? <br /> 
        <strong>Go ahead, buddy!</strong>
        </p>
        <li>
        <Link to="/addItem" className="dramatic-link">
          Add Items Now 🚀
        </Link>
         </li>
        </ul>
      </div>


      <div className="dsearch-bar">
        <p style={{ width:"80%",paddingBottom:"5px"}}>Wanna search something???</p>
        <input style={{ display: "flex", width:"80%",paddingBottom:"5px"}}
          type="text"
          placeholder="Search items by name..."
          value={query}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <h2 style={{ display: "flex", justifyContent: "center" }}>
  {query.trim() ? "Results based on your search" : "Items Listed"}
</h2>
      <div className="available-items">
      {searchResults.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {searchResults.map((item) => (
            <li key={item._id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              <p>Owner: {item.owner?.email || "Unknown"}</p>
              
              <span
            className={`status-badge ${
              item.isAvailable ? "available" : "rented"
            }`}
          >
            {item.isAvailable ? "Available" : "Rented"}
          </span>
              {/* Rental Request Button */}
              {/* {item.isAvailable ? (
                <RentalRequestButton itemId={item._id} />
              ) : (
                <p>This item is currently rented.</p>
              )} */}
              {item.isAvailable ? (
        item.owner?._id === user._id ? (
          <p>You cannot rent your own item.</p>
        ) : (
          <RentalRequestButton itemId={item._id} />
        )
      ) : (
        <p>This item is currently rented.</p>
      )}

              {/* Toggle to View Requests */}
              <div className="button-group">
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
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
