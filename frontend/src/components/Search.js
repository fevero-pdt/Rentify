import React, { useState } from "react";
import { searchItems } from "../services/api";
import "./search.css"

const Search = () => {
  const [query, setQuery] = useState(""); // Search query
  const [results, setResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]); // Clear results if query is empty
      return;
    }

    setLoading(true);

    try {
      const response = await searchItems(value); // Call the search API
      setResults(response.data); // Update search results
    } catch (error) {
      console.error("Error searching items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by item name or owner email..."
        value={query}
        onChange={handleSearch}
        style={{ width: "300px", padding: "10px" }}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {results.length === 0 && query.trim() !== "" && !loading && <p>No results found.</p>}
        {results.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Owner: {item.owner?.email || "Unknown"}</p>
            <p>Status: {item.isAvailable ? "Available" : "Rented"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
