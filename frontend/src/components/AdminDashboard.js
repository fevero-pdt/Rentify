import React, { useState, useEffect } from "react";
import { deleteAdminUser, deleteAdminItem, addAdminUser, addAdminItem } from "../services/api";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for adding users and items
  const [newUser, setNewUser] = useState({ email: "", password: "", roles: "Renter" });
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await addAdminUser(newUser);
      setUsers((prev) => [...prev, response.data.user]);
      alert("User added successfully.");
      setNewUser({ email: "", password: "", roles: "Renter" }); // Reset form
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user.");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await addAdminItem(newItem);
      setItems((prev) => [...prev, response.data.item]);
      alert("Item added successfully.");
      setNewItem({ name: "", description: "", price: "", ownerEmail: "" }); // Reset form
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteAdminUser(userId);
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
    <div>
      <h1>Admin Dashboard</h1>

      {/* Add User Form */}
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
        <select
          value={newUser.roles}
          onChange={(e) => setNewUser({ ...newUser, roles: e.target.value })}
        >
          <option value="Renter">Renter</option>
          <option value="Owner">Owner</option>
          {/* <option value="Admin">Admin</option> */}
        </select>
        <button type="submit">Add User</button>
      </form>

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
        <button type="submit">Add Item</button>
      </form>

      {/* Manage Users */}
      <h2>Manage Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="btn btn-danger"
              >
                Delete User
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Manage Items */}
      <h2>Manage Items</h2>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <p>
                <strong>Name:</strong> {item.name}
                <br />
                <strong>Owner:</strong> {item.owner?.email || "Unknown"}
              </p>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="btn btn-danger"
              >
                Delete Item
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
