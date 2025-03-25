import React, { useEffect, useState } from "react";
import { GetPlaceDetails } from "@/service/GlobalApi";
import { FaMapMarkerAlt } from "react-icons/fa"; // Importing a map marker icon

const API_KEY = import.meta.env.VITE_GMAPS_API_KEY;

// Function to construct photo URL using photoReference
const getPhotoUrl = (photoReference, maxWidth = 600, maxHeight = 600) => {
  if (!photoReference) return null;
  return `https://places.googleapis.com/v1/${photoReference}/media?maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}&key=${API_KEY}`;
};

// Default fallback image
const fallbackImage =
  "https://www.uniqhotels.com/media/cache/b9/37/b9379a51c0b0db5e3af64eaa97e91584.webp";

const Hotels = ({ trip = {} }) => {
  const hotels = trip?.tripData?.hotelOptions || [];
  console.log(hotels);
  const [hotelImages, setHotelImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const images = {};
      for (const hotel of hotels) {
        const imageUrl = await fetchHotelPhoto(hotel.hotelName);
        images[hotel.hotelName] = imageUrl;
      }
      setHotelImages(images);
    };

    if (hotels.length) fetchImages();
  }, [hotels]);

  const fetchHotelPhoto = async (hotelName) => {
    try {
      const result = await GetPlaceDetails(hotelName);
      const photoReference = result?.places?.[0]?.photos?.[0]?.name || null;

      if (photoReference) {
        return getPhotoUrl(photoReference);
      } else {
        return fallbackImage;
      }
    } catch (error) {
      console.error(`Error fetching image for ${hotelName}:`, error);
      return fallbackImage;
    }
  };

  const openHotelOnMap = (hotelName, hotelAddress) => {
    if (hotelName && hotelAddress) {
      // Combine the hotel name with the address for the search
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName)}+${encodeURIComponent(hotelAddress)}`;
      window.open(googleMapsUrl, "_blank"); // Open in a new tab
    } else {
      alert("Hotel name or address not available.");
    }
  };
  return (
    <div className="mt-6 max-w-6xl mx-auto px-1">
      <h2 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">
        🏨 Hotel Recommendations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hotels.length > 0 ? (
          hotels.map((hotel, index) => (
            <div
              key={index}
              className="relative bg-gray-800 p-1 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 border border-gray-700"
              onClick={() =>
                openHotelOnMap(
                  hotel.hotelName,
                  hotel.hotelAddress)
              }
            >
              {/* Map Icon */}
              <div className="absolute top-2 right-2 bg-black text-white p-2 rounded-full opacity-80 hover:opacity-100 cursor-pointer">
                <FaMapMarkerAlt />
              </div>

              {/* Hotel Image */}
              <img
                src={hotelImages[hotel.hotelName] || fallbackImage}
                className="rounded-lg w-full h-48 object-cover"
                alt={hotel.hotelName || "Hotel Image"}
              />

              {/* Hotel Details */}
              <div className="mt-3">
                <h3 className="text-lg font-semibold text-white">
                  {hotel.hotelName || "Hotel Name Not Available"}
                </h3>
                <p className="text-sm text-gray-400">
                  📍 {hotel.hotelAddress || "No Address Available"}
                </p>
                <p className="text-sm text-gray-400">
                  💰 {hotel.price || "Pricing Not Available"}
                </p>
                <p className="text-sm text-yellow-400">
                  ⭐ {hotel.rating || "N/A"}
                </p>
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
