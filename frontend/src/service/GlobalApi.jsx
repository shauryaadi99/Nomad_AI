import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://nomad-ai-backend.vercel.app";

/**
 * Fetch place details using the custom backend
 * @param {string} query - The place query (e.g., "Las Vegas, NV, USA")
 * @returns {Promise<Object|null>} - The place details or null if failed
 */
export const GetPlaceDetails = async (query) => {
  try {
    const requestBody = {
      textQuery: query,
      languageCode: "en",
      maxResultCount: 5,
    };

    const response = await axios.post(`${API_BASE_URL}/api/place-details`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching place details:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Fetch itinerary (same endpoint proxy since it uses textQuery)
 */
export const GetItinerary = async (destination) => {
  try {
    const requestBody = {
      textQuery: destination,
      languageCode: "en",
      maxResultCount: 5,
    };

    // Use /api/place-details as proxy since we are searching places
    const response = await axios.post(`${API_BASE_URL}/api/place-details`, requestBody, {
      headers: {
        "Content-Type": "application/json",
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
        // First attempt: Fetch image using text query
        let response = await axios.post(
            `${API_BASE_URL}/api/place-details`,
            {
                textQuery: placeName,
                languageCode: 'en',
                maxResultCount: 1
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.places?.[0]?.photos?.length) {
            // Placeholder logic if we need to extract from first response
        }

        // Second attempt: Fetch image using Nearby Search with geo-coordinates
        response = await axios.get(`${API_BASE_URL}/api/nearby-search`, {
            params: {
                location: `${lat},${lng}`,
                radius: 5000,
                keyword: placeName
            }
        });

        if (response.data.results?.[0]?.place_id) {
            const placeId = response.data.results[0].place_id;
            return `${API_BASE_URL}/api/proxy-image?placeId=${placeId}`;
        }

        // Fallback: Return a default image if no photos are found
        return '/fallback-image.jpg';
    } catch (error) {
        console.error('Error fetching itinerary photos:', error);
        return '/fallback-image.jpg';
    }
};
