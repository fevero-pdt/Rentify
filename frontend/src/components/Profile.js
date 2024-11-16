import React, { useEffect, useState } from "react";
import { fetchProfile, deleteItem } from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null); // User profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [query, setQuery] = useState(""); // Search query
  const [filteredItems, setFilteredItems] = useState([]); // Filtered items based on search

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchProfile();
        setProfile(response.data);
        setFilteredItems(response.data.ownedItems); // Initialize filtered items with all owned items
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    // Filter owned items based on the query
    const filtered = profile.ownedItems.filter(
      (item) =>
        item.name.toLowerCase().includes(value) || item.description.toLowerCase().includes(value)
    );

    setFilteredItems(filtered);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(itemId); // Call the delete API
        // Remove the item from both the full list and filtered list
        setProfile((prev) => ({
          ...prev,
          ownedItems: prev.ownedItems.filter((item) => item._id !== itemId),
        }));
        setFilteredItems((prev) => prev.filter((item) => item._id !== itemId));
        alert("Item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete the item.");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Failed to load profile information.</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <h2>User Information</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Roles:</strong> {profile.roles.join(", ")}</p>

      <h2>Search Your Owned Items</h2>
      <input
        type="text"
        placeholder="Search items by name or description..."
        value={query}
        onChange={handleSearch}
        style={{ width: "300px", padding: "10px", margin: "20px 0" }}
      />

      <h2>Owned Items</h2>
      {filteredItems.length === 0 ? (
        <p>No items match your search.</p>
      ) : (
        <ul>
          {filteredItems.map((item) => (
            <li key={item._id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              <p>Status: {item.isAvailable ? "Available" : "Rented"}</p>
              <button
                onClick={() => handleDelete(item._id)}
                style={{ color: "white", backgroundColor: "red", padding: "5px 10px", border: "none", cursor: "pointer" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
