require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GMAPS_API_KEY || 'AIzaSyAaqmU2PCMXPnUEbtDjoKn4FOQqqRbUPvk';

// Middleware to enable CORS (for local testing)
app.use(cors());

// Proxy route to fetch Google Places images using Place Details
app.get("/proxy-image", async (req, res) => {
  const { placeId } = req.query;
  
  // Log the incoming placeId to ensure it's being received
  console.log("Received placeId:", placeId);
  
  if (!placeId) {
    return res.status(400).json({ error: "Missing 'placeId' query parameter" });
  }

  try {
    // Fetch place details to get photo metadata (including photo_reference)
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`;
    const response = await fetch(placeDetailsUrl);
    const data = await response.json();

    if (!response.ok || data.status !== 'OK') {
      throw new Error(`Failed to fetch place details: ${data.status}`);
    }

    // Check if photos are available in the response
    if (data.result.photos && data.result.photos.length > 0) {
      const photoReference = data.result.photos[0].photo_reference;
      const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${API_KEY}`;

      // Fetch the image using the photo reference
      const imageResponse = await fetch(imageUrl);

      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }

      // Get the content type of the image
      const contentType = imageResponse.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image')) {
        throw new Error('Invalid content type for image');
      }

      // Get image as a buffer
      const buffer = await imageResponse.buffer();
      res.set("Content-Type", contentType); // Set correct content type dynamically
      res.send(buffer);
    } else {
      throw new Error("No photos available for this place.");
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image", details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
