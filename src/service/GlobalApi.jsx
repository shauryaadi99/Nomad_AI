import axios from "axios";

const API_KEY = import.meta.env.VITE_GMAPS_API_KEY;
const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";

/**
 * Fetch place details using the Places (New) API
 * @param {string} query - The place query (e.g., "Las Vegas, NV, USA")
 * @returns {Promise<Object|null>} - The place details or null if failed
 */
export const GetPlaceDetails = async (query) => {
  try {
    const requestBody = {
      textQuery: query, // Ensure query is correctly formatted
      languageCode: "en", // Optional: Set language
      maxResultCount: 5, // Optional: Limit results
    };

    const response = await axios.post(PLACES_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY, // API key in headers
        "X-Goog-FieldMask": "places.displayName,places.photos,places.formattedAddress",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching place details:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Fetch photos for itinerary places using the Places (New) API
 * @param {string} placeName - Name of the place (e.g., "Eiffel Tower")
 * @returns {Promise<string>} - URL of the place photo or a fallback image
 */
export const GetItinerary = async (destination) => {
  try {
    const requestBody = {
      textQuery: destination, // Ensures the query is formatted properly
      languageCode: "en", // Optional: Set language preference
      maxResultCount: 5, // Optional: Limit results
    };

    const response = await axios.post(ITINERARY_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY, // API key in headers
        "X-Goog-FieldMask": "itinerary.days,itinerary.activities,itinerary.location",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching itinerary:", error.response?.data || error.message);
    return null;
  }
};






export const GetItineraryPhotos = async (placeName, lat, lng) => {
    try {
        // First attempt: Fetch image using text query (New Google Places API)
        let response = await axios.post(
            `https://places.googleapis.com/v1/places:searchText`,
            {
                textQuery: placeName,
                languageCode: 'en',
                maxResultCount: 1
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': API_KEY,
                    'X-Goog-FieldMask': 'places.name,places.photos'
                }
            }
        );

        if (response.data.places?.[0]?.photos?.length) {
            const photoReference = response.data.places[0].photos[0].name;
            return `https://places.googleapis.com/v1/${photoReference}/media?maxWidthPx=400&key=${API_KEY}`;
        }

        // Second attempt: Fetch image using Nearby Search (Places API) with geo-coordinates
        response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${lat},${lng}`,
                radius: 5000,  // Search within 5km radius
                keyword: placeName,
                key: API_KEY
            }
        });

        if (response.data.results?.[0]?.photos?.length) {
            const photoReference = response.data.results[0].photos[0].photo_reference;
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${API_KEY}`;
        }

        // Fallback: Return a default image if no photos are found
        return '/fallback-image.jpg';
    } catch (error) {
        console.error('Error fetching itinerary photos:', error);
        return '/fallback-image.jpg';
    }
};
