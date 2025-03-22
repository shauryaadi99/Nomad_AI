import React, { useState, useEffect } from "react";
import axios from "axios";

// Fallback image for missing images
const fallbackImage = "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg";

// API Key (Keep it secure)
const API_KEY = import.meta.env.VITE_GOMAPS_API_KEY;

const PlacesToVisit = ({ trip = {} }) => {
  const itineraryArray = Array.isArray(trip?.tripData?.itinerary) ? trip.tripData.itinerary : [];
  const [imageUrls, setImageUrls] = useState(() => JSON.parse(localStorage.getItem("imageUrls")) || {});

  // Function to fetch photo reference
  const fetchPhotoReference = async (placeName) => {
    try {
      const searchUrl = `https://maps.gomaps.pro/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName)}&key=${API_KEY}`;
      const response = await axios.get(searchUrl);
      if (response.data.status === "OK" && response.data.results.length > 0) {
        return response.data.results[0].photos?.[0]?.photo_reference || null;
      }
    } catch (error) {
      console.error(`Error fetching photo reference for ${placeName}:`, error);
    }
    return null;
  };

  // Function to fetch image URL
  const fetchPhotoUrl = async (photoReference) => {
    if (!photoReference) return fallbackImage;
    return `https://maps.gomaps.pro/maps/api/place/photo?photo_reference=${photoReference}&maxwidth=500&key=${API_KEY}`;
  };

  useEffect(() => {
    const fetchImages = async () => {
      let newImageUrls = { ...imageUrls };
      let placesToFetch = [];

      for (let day of itineraryArray) {
        for (let place of day.locations || []) {
          if (!newImageUrls[place.placeName]) {
            placesToFetch.push(place.placeName);
          }
        }
      }

      // Fetch photo references in batch
      const photoReferences = await Promise.all(placesToFetch.map(fetchPhotoReference));

      // Fetch images in batch
      const photoUrls = await Promise.all(photoReferences.map(fetchPhotoUrl));

      placesToFetch.forEach((place, index) => {
        newImageUrls[place] = photoUrls[index] || fallbackImage;
      });

      setImageUrls(newImageUrls);
      localStorage.setItem("imageUrls", JSON.stringify(newImageUrls));
    };

    if (itineraryArray.length > 0) {
      fetchImages();
    }
  }, [trip]);

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-b from-[#1a1a1a] to-[#000] min-h-screen rounded-lg shadow-xl">
      <h2 className="font-extrabold text-3xl sm:text-4xl text-[#E8C547] mb-6 text-center">
        🌍 Places to Visit
      </h2>

      <div className="space-y-10">
        {itineraryArray.length > 0 ? (
          itineraryArray.map((dayData, dayIndex) => (
            <div key={dayIndex} className="relative p-5 sm:p-6 bg-[#121212] rounded-2xl shadow-lg border border-[#E8C547] overflow-hidden">
              <div className="absolute top-[-3px] left-[-15px] bg-[#E8C547] text-black px-4 py-1 rounded-tr-xl rounded-bl-xl text-lg font-bold shadow-md">
                🚀 Day {dayData.day}
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-3 sm:mt-4">
                {dayData.theme || "No theme available"}
              </h2>
              <p className="text-md text-gray-400 mt-1">
                🕒 Best Time to Visit: <span className="font-medium text-gray-200">{dayData.bestTimeToVisit || "N/A"}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {Array.isArray(dayData.locations) && dayData.locations.length > 0 ? (
                  dayData.locations.map((place, placeIndex) => (
                    <div key={placeIndex} className="flex flex-col sm:flex-row bg-gray-900 rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-300 border border-[#E8C547]">
                      <img
                        src={imageUrls[place.placeName] || fallbackImage}
                        alt={place.placeName}
                        className="w-full sm:w-[180px] h-[180px] sm:h-[140px] object-cover rounded-t-lg sm:rounded-l-lg border-b sm:border-b-0 sm:border-r border-[#E8C547]"
                      />

                      <div className="p-4 flex-1">
                        <h3 className="font-semibold text-lg sm:text-xl text-[#E8C547]">{place.placeName}</h3>
                        <p className="text-sm sm:text-md text-gray-300 mt-1">{place.placeDetails}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic mt-2 text-center">No locations listed for this day.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-center">No itinerary data available.</p>
        )}
      </div>
    </div>
  );
};

export default PlacesToVisit;
