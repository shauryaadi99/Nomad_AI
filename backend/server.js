const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const apiRoutes = require("./routes/api.routes");

// Load environment variables from frontend's .env.local if present, or backend's .env
dotenv.config({ path: path.join(__dirname, '../frontend/.env.local') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow all origins for now, configure later for production
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
