import React, { useEffect, useState } from "react";
import { fetchProfile, deleteItem, updatePassword } from "../services/api";
import "./profile.css"

const Profile = () => {
  const [profile, setProfile] = useState(null); // User profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [query, setQuery] = useState(""); // Search query
  const [filteredItems, setFilteredItems] = useState([]); // Filtered items based on search
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" }); // Password form state
  const [passwordMessage, setPasswordMessage] = useState(""); // Feedback message for password update

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

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updatePassword(passwordForm);
      setPasswordMessage(response.message);
      setPasswordForm({ oldPassword: "", newPassword: "" }); // Clear form after success
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordMessage(error.response?.data?.message || "Failed to update password.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Failed to load profile information.</p>;
  }

  return (
    <div className="profile-page">
      <h1 className="profile-header">Profile</h1>
      <div className="section-header">
      <h2>User Information</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Roles:</strong> {profile.roles.join(", ")}</p>
      </div>

      <div className="section-header">
        <h2 >Update Password</h2>
      <form onSubmit={handlePasswordUpdate} style={{ marginBottom: "20px" }} className="password-update-form">
        <div>
          <label>Old Password:</label>
          <input
            type="password"
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            required
          />
          <label>New Password:</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Update Password
        </button>
        </form>
      </div>
      
      {passwordMessage && <p style={{ color: passwordMessage.includes("success") ? "green" : "red" }}>{passwordMessage}</p>}

      

      <div className="section-header">
      <h2 >Search Your Owned Items</h2>
      <input
        type="text"
        placeholder="Search items by name or description..."
        value={query}
        onChange={handleSearch}
        style={{ width: "300px", padding: "10px", margin: "20px 0" }}
        className="search-bar"
      />
      <h2 >Owned Items</h2>
      <div className="owned-items">
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
              <div className="item-images">
                  {item.images && item.images.length > 0 ? (
                    item.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5002${image}`} // Prepend the base URL
                        alt={`${item.name} image ${index + 1}`}
                        className="item-image"
                      />
                    ))
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
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
      </div>
    </div>
  );
};

export default Profile;
