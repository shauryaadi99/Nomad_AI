import React, { useState, useEffect } from "react";
import { GetPlaceDetails } from "@/service/GlobalApi";
import { FaMapMarkerAlt } from "react-icons/fa"; // For the map icon

// Fallback image for missing images
const fallbackImage =
  "https://media.istockphoto.com/id/1083982928/photo/jaipur-metro.jpg?s=612x612&w=0&k=20&c=gLJrIg6X9XvumVlMLyZ-RUi3SZJa0Yu4O4UfWVoJc0c=";

const PlacesToVisit = ({ trip = {} }) => {
  const [updatedItinerary, setUpdatedItinerary] = useState([]);
  const itineraryArray = Array.isArray(trip?.tripData?.itinerary)
    ? trip.tripData.itinerary
    : [];

  const API_KEY = import.meta.env.VITE_GMAPS_API_KEY;

  // Function to generate photo URL using photo reference
  const getPhotoUrl = (photoReference, maxWidth = 600, maxHeight = 600) => {
    return photoReference
      ? `https://places.googleapis.com/v1/${photoReference}/media?maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}&key=${API_KEY}`
      : fallbackImage;
  };

  useEffect(() => {
    const fetchPhotoReferences = async () => {
      try {
        const updatedData = await Promise.all(
          itineraryArray.map(async (day) => {
            const updatedLocations = await Promise.all(
              (day.locations || []).map(async (place) => {
                if (!place.photoReference) {
                  try {
                    const details = await GetPlaceDetails(place.placeName);
                    return {
                      ...place,
                      photoReference:
                        details?.places?.[0]?.photos?.[0]?.name || null,
                    };
                  } catch (error) {
                    console.error(
                      `Error fetching photo for ${place.placeName}:`,
                      error
                    );
                    return { ...place, photoReference: null };
                  }
                }
                return place;
              })
            );
            return { ...day, locations: updatedLocations };
          })
        );
        setUpdatedItinerary(updatedData);
      } catch (error) {
        console.error("Error fetching itinerary details:", error);
      }
    };

    if (itineraryArray.length > 0) fetchPhotoReferences();
  }, [trip]);

  const openMap = (placeName, placeAddress) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      placeName
    )}+${encodeURIComponent(placeAddress)}`;
    window.open(mapUrl, "_blank");
  };

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-b from-[#1a1a1a] to-[#000] min-h-screen rounded-lg shadow-xl">
      <h2 className="font-extrabold text-3xl sm:text-4xl text-[#E8C547] mb-6 text-center">
        🌍 Places to Visit
      </h2>

      <div className="space-y-10">
        {updatedItinerary.length > 0 ? (
          updatedItinerary.map((dayData, dayIndex) => (
            <div
              key={dayIndex}
              className="relative p-5 sm:p-6 bg-[#121212] rounded-2xl shadow-lg border border-[#E8C547]"
            >
              <div className="absolute top-[-3px] left-[-15px] bg-[#E8C547] text-black px-4 py-1 rounded-tr-xl rounded-bl-xl text-lg font-bold">
                🚀 Day {dayData.day}
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-3 sm:mt-4">
                {dayData.theme || "No theme available"}
              </h2>
              <p className="text-md text-gray-400 mt-1">
                🕒 Best Time to Visit:{" "}
                <span className="font-medium text-gray-200">
                  {dayData.bestTimeToVisit || "N/A"}
                </span>
              </p>

              {/* Itinerary Layout: Horizontal for large screens, Cards for small screens */}
              <div className="mt-6">
                {Array.isArray(dayData.locations) && dayData.locations.length > 0 ? (
                  dayData.locations.map((place, placeIndex) => {
                    const imageSrc = getPhotoUrl(place.photoReference); // Assuming you have this function to get the image URL

                    return (
                      <div
                        key={placeIndex}
                        className="flex flex-col sm:flex-row bg-gray-900 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 border border-[#E8C547] mb-6"
                      >
                        <div className="relative w-full sm:w-[180px] h-[180px] sm:h-[200px]">
                          {/* Map Icon */}
                          <div
                            className="absolute top-2 right-2 bg-black text-white p-2 rounded-full opacity-80 hover:opacity-100 cursor-pointer"
                            >
                            <FaMapMarkerAlt />
                          </div>

                          {/* Itinerary Photo */}
                          <img
                            src={imageSrc}
                            onClick={() => openMap(place.placeName, place.placeDetails)}
                            alt={place.placeName}
                            cursor="pointer"
                            className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg border-b sm:border-b-0 sm:border-r border-[#E8C547]"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold text-lg sm:text-xl text-[#E8C547] group-hover:text-[#FFD700]">
                            {place.placeName}
                          </h3>
                          <p className="text-sm sm:text-md text-gray-300 mt-1">
                            {place.placeDetails}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 italic mt-2 text-center">
                    No locations listed for this day.
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-center">
            No itinerary data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlacesToVisit;