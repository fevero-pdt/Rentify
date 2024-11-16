import React, { useState } from "react";
import { addItem } from "../services/api";

const AddItem = ({ user }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [message] = useState("");

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await addItem({ name, description, price });
      alert(response.data.message); // Success alert
    } catch (error) {
      console.error("Failed to add item:", error.response || error.message); // Log detailed error
      alert("Failed to add item. Please try again."); // User-facing error
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Add Item</h2>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AddItem;
