const express = require("express");
const cors = require("cors"); // Import CORS
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bikeRoutes = require("./routes/bikeRoutes");
// const authRoutes = require("./routes/auth"); // Import auth routes

require("dotenv").config();
const app = express();
connectDB();

app.use(cors()); // Enable CORS
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/bikes", bikeRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


