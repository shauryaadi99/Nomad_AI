const axios = require('axios');

const getApiKey = () => process.env.VITE_GMAPS_API_KEY || process.env.GMAPS_API_KEY;

const getPlaceDetails = async (req, res) => {
  const { textQuery, languageCode } = req.body;
  const API_KEY = getApiKey();

  if (!API_KEY) {
    return res.status(500).json({ error: "Google Maps API key is not configured" });
  }

  if (!textQuery) {
    return res.status(400).json({ error: "Missing 'textQuery' in request body" });
  }

  try {
    const url = "https://places.googleapis.com/v1/places:searchText";
    const data = {
      textQuery: textQuery,
      languageCode: languageCode || "en"
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.photos,places.displayName,places.id",
      },
    };

    const response = await axios.post(url, data, config);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching place details:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({ error: "Failed to fetch place details" });
  }
};

const getNearbySearch = async (req, res) => {
  const API_KEY = getApiKey();

  if (!API_KEY) {
    return res.status(500).json({ error: "Google Maps API key is not configured" });
  }

  try {
    const { location, radius, type } = req.body;
    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({ error: "Missing location parameter" });
    }

    const data = {
      includedTypes: [type || "restaurant"],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng
          },
          radius: radius || 1000.0
        }
      }
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel,places.rating,places.photos",
      },
    };

    const response = await axios.post("https://places.googleapis.com/v1/places:searchNearby", data, config);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching nearby places:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({ error: "Failed to fetch nearby places" });
  }
};

const getPlacePhoto = async (req, res) => {
  const { name, maxWidthPx = 600, maxHeightPx = 600 } = req.query;
  const API_KEY = getApiKey();

  if (!API_KEY) {
    return res.status(500).json({ error: "Google Maps API key is not configured" });
  }

  if (!name) {
    return res.status(400).json({ error: "Missing 'name' query parameter" });
  }

  try {
    const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${maxWidthPx}&maxHeightPx=${maxHeightPx}&key=${API_KEY}`;
    
    // Express res.redirect is useful for images, or we can fetch and pipe. 
    // Proxying the image buffer:
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    res.setHeader("Content-Type", response.headers['content-type']);
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    return res.send(response.data);
  } catch (error) {
    console.error("Error fetching place photo:", error.message);
    return res.status(error.response?.status || 500).json({ error: "Failed to fetch place photo" });
  }
};

const getProxyImage = async (req, res) => {
  const { placeId } = req.query;
  const API_KEY = getApiKey();

  if (!API_KEY) {
    return res.status(500).json({ error: "Google Maps API key is not configured" });
  }

  if (!placeId) {
    return res.status(400).json({ error: "Missing 'placeId' query parameter" });
  }

  try {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${placeId}&key=${API_KEY}`;
    
    const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
    
    res.setHeader("Content-Type", response.headers['content-type']);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(response.data);
  } catch (error) {
    console.error("Error proxying image:", error.message);
    return res.status(error.response?.status || 500).json({ error: "Failed to proxy image" });
  }
};

module.exports = {
  getPlaceDetails,
  getNearbySearch,
  getPlacePhoto,
  getProxyImage
};
