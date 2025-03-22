import React, { useEffect, useState } from "react";
import axios from "axios";

// Default fallback image for hotels
const fallbackImage = "https://www.uniqhotels.com/media/cache/b9/37/b9379a51c0b0db5e3af64eaa97e91584.webp";

// Function to securely retrieve API key
const getApiKey = () => import.meta.env.VITE_GOMAPS_API_KEY || "";

const Hotels = ({ trip = {} }) => {
  const hotels = trip?.tripData?.hotelOptions || [];
  const [hotelImages, setHotelImages] = useState({});

  // Function to fetch hotel images using GoMaps.pro
  const fetchHotelPhoto = async (hotelName) => {
    try {
      if (!hotelName) return fallbackImage;

      // Check if image is already cached
      const cachedImage = localStorage.getItem(`hotelImage-${hotelName}`);
      if (cachedImage) return cachedImage;

      const API_KEY = getApiKey();
      if (!API_KEY) {
        console.error("API Key is missing!");
        return fallbackImage;
      }

      // Step 1: Get place details
      const searchQuery = `${hotelName}, Hotel, India`;
      const placeSearchUrl = `https://maps.gomaps.pro/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;
      const response = await axios.get(placeSearchUrl);

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const photoReference = response.data.results[0].photos?.[0]?.photo_reference;

        if (photoReference) {
          // Step 2: Get hotel photo using photo reference
          const photoUrl = `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${API_KEY}`;

          // Store in localStorage and return
          localStorage.setItem(`hotelImage-${hotelName}`, photoUrl);
          return photoUrl;
        }
      }
    } catch (error) {
      console.error("Error fetching hotel image:", error);
    }
    return fallbackImage; // Fallback if API fails
  };

  // Fetch images on mount
  useEffect(() => {
    const fetchImages = async () => {
      const images = {};
      for (const hotel of hotels) {
        images[hotel.hotelName] = await fetchHotelPhoto(hotel.hotelName);
      }
      setHotelImages(images);
    };
    if (hotels.length) fetchImages();
  }, [hotels]);

  // Function to open Google Maps with hotel name search
  const openHotelOnMap = (hotelName) => {
    if (hotelName) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName)}`;
      window.open(googleMapsUrl, "_blank"); // Open in a new tab
    } else {
      alert("Hotel name not available.");
    }
  };

  return (
    <div className="mt-6 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">🏨 Hotel Recommendations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hotels.length > 0 ? (
          hotels.map((hotel, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 border border-gray-700"
              onClick={() => openHotelOnMap(hotel.hotelName)}
            >
              {/* Hotel Image */}
              <img
                src={hotelImages[hotel.hotelName] || fallbackImage}
                className="rounded-lg w-full h-48 object-cover"
                alt={hotel.hotelName || "Hotel Image"}
              />

              {/* Hotel Details */}
              <div className="mt-3">
                <h3 className="text-lg font-semibold text-white">{hotel.hotelName || "Hotel Name Not Available"}</h3>
                <p className="text-sm text-gray-400">📍 {hotel.hotelAddress || "No Address Available"}</p>
                <p className="text-sm text-gray-400">💰 {hotel.price || "Pricing Not Available"}</p>
                <p className="text-sm text-yellow-400">⭐ {hotel.rating || "N/A"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No hotel data available.</p>
        )}
      </div>
    </div>
  );
};

export default Hotels;
