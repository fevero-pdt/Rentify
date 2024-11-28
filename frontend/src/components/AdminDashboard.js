import React, { useState, useEffect } from "react";
import { deleteAdminUser, deleteAdminItem, addAdminUser, addAdminItem } from "../services/api";
import axios from "axios";
import "./admindashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]); // State to hold image files
  const [error, setError] = useState(null);

  // States for adding users and items
  const [newUser, setNewUser] = useState({ email: "", password: "", phone: "", roles: "Renter" });
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", ownerEmail: "" });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:5002/admin/users", {
          withCredentials: true,
        });
        const itemsResponse = await axios.get("http://localhost:5002/admin/items", {
          withCredentials: true,
        });

        setUsers(usersResponse.data);
        setItems(itemsResponse.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Handle image file change
  const handleImageChange = (e) => {
    setImages(e.target.files); // Update images with selected files
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await addAdminUser(newUser);
      setUsers((prev) => [...prev, response.data.user]);
      alert("User added successfully.");
      setNewUser({ email: "", password: "", phone: "", roles: "Renter" }); // Reset form
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user.");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price);
    formData.append('ownerEmail', newItem.ownerEmail);
  
    // Append all selected images to formData
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
  
    try {
      const response = await addAdminItem(formData);
      setItems((prev) => [...prev, response.data.item]);
      alert("Item added successfully.");
      setNewItem({ name: "", description: "", price: "", ownerEmail: "" }); // Reset form
      setImages([]); // Reset image state
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item.");
    }
  };
  

  const handleDeleteUser = async (userId) => {
    const reason = window.prompt("Please provide a reason for deleting this user:");
    if (!reason) {
      alert("Deletion cancelled. A reason is required.");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteAdminUser(userId, { reason }); // Pass the reason in the body
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        alert("User deleted successfully.");
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };  

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteAdminItem(itemId);
        setItems((prev) => prev.filter((item) => item._id !== itemId));
        alert("Item deleted successfully.");
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Failed to delete item.");
      }
    }
  };

  if (loading) return <p>Loading admin data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="hihi">
      <h1>Admin Dashboard</h1>

      {/* Add User Form */}
      <div className="admin-add-user-form">
        <h2>Add User</h2>
        <form onSubmit={handleAddUser}>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            required
          />
          <select
            value={newUser.roles}
            onChange={(e) => setNewUser({ ...newUser, roles: e.target.value })}
          >
            <option value="Renter">Renter</option>
            <option value="Owner">Owner</option>
          </select>
          <button type="submit">Add User</button>
          </form>
      </div>
      <div className="admin-add-user-form">
        {/* Add Item Form */}
      <h2>Add Item</h2>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Owner Email"
          value={newItem.ownerEmail}
          onChange={(e) => setNewItem({ ...newItem, ownerEmail: e.target.value })}
          required
        />
        {/* Image input field */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <button type="submit">Add Item</button>
        </form>
      </div>

      {/* Manage Users */}
      <h2 className="color">Manage Users</h2>
      <div className="manage-user">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p>
                  <strong>Email:</strong> {user.email}
                  <br />
                  <strong>Phone:</strong> {user.phone || "Not Provided"} {/* Display phone */}
                </p>
                <button onClick={() => handleDeleteUser(user._id)} className="btn btn-danger">
                  Delete User
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Manage Items */}
      <h2 className="color">Manage Items</h2>
      <div className="manage-item">
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p>
                  <strong>Name:</strong> {item.name}
                  <br />
                  <strong>Owner:</strong> {item.owner?.email || "Unknown"}
                </p>
                <button onClick={() => handleDeleteItem(item._id)} className="btn btn-danger">
                  Delete Item
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
