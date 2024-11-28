import React, { useState } from "react";
import { addItem } from "../services/api";
import "./AddItem.css";

const AddItem = ({ user }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]); // State to hold image files
  const [message, setMessage] = useState(""); // Message for success or error

  // Handle image file change
  const handleImageChange = (e) => {
    setImages(e.target.files); // Update images with selected files
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
  
    // Log form data to debug
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Price:", price);
  
    // Check if images are selected
    console.log("Images:", images);

    if (!name || !description || !price) {
      setMessage("All fields must be filled!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
  
    // Append selected image files to FormData if available
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    } else {
      setMessage("Please select at least one image.");
      return;
    }

    try {
      const response = await addItem(formData);
      alert(response.data.message); // Set success message
    } catch (error) {
      console.error("Failed to add item:", error.response || error.message);
      alert("Failed to add item. Please try again.");
    }
  };
  

  if (!user) return <p>Loading...</p>;

  return (
    <div className="add-item-container">
      <h2>Add Item</h2>
      <form onSubmit={handleAddItem} encType="multipart/form-data">
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
        
        {/* Image input field */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <button type="submit">Add Item</button>
      </form>
      <p>{message}</p> {/* Display the message (error or success) */}
    </div>
  );
};

export default AddItem;
