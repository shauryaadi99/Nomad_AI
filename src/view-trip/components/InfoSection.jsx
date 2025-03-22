import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import axios from "axios";

// API Key (Keep it secure)
const API_KEY = import.meta.env.VITE_GOMAPS_API_KEY;

// Default fallback image
const fallbackImage = "https://via.placeholder.com/400";

const InfoSection = ({ trip = { userSelection: {} } }) => {
  const location = trip?.userSelection?.location || "Unknown Location";

  const [imageUrl, setImageUrl] = useState(() => {
    return JSON.parse(localStorage.getItem(`stationImage-${location}`)) || fallbackImage;
  });

  // Function to fetch railway station photo
  const fetchPhoto = async (locationName) => {
    if (!locationName || locationName === "Unknown Location") return;

    try {
      const searchQuery = `${locationName} Railway Station, India`;
      const placeSearchUrl = `https://maps.gomaps.pro/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;

      const response = await axios.get(placeSearchUrl);

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const photoReference = response.data.results[0].photos?.[0]?.photo_reference;

        if (photoReference) {
          const photoUrl = `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${API_KEY}`;

          // Cache the image URL in localStorage
          localStorage.setItem(`stationImage-${locationName}`, JSON.stringify(photoUrl));
          setImageUrl(photoUrl);
        } else {
          console.warn(`No photo reference found for ${locationName} Railway Station.`);
        }
      } else {
        console.warn(`No results found for ${locationName} Railway Station.`);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // Fetch photo when location changes
  useEffect(() => {
    if (!localStorage.getItem(`stationImage-${location}`)) {
      fetchPhoto(location);
    }
  }, [location]);

  // Function to share trip details
  const shareTrip = () => {
    const websiteUrl = window.location.href; // Get the current page URL
    const message = `📍 Check out my travel plan to ${location}!\n🗓️ Duration: ${trip?.userSelection?.noOfDays || "N/A"} days\n💰 Budget: ${trip?.userSelection?.budget || "N/A"}\n🥂 Travelers: ${trip?.userSelection?.Travelers || "N/A"}\n🔗 ${websiteUrl}`;

    if (navigator.share) {
      navigator.share({
        title: "Check out this travel plan!",
        text: message,
        url: websiteUrl,
      }).then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback: Open WhatsApp sharing
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md max-w-5xl mx-auto">
      {/* Responsive Image */}
      <img
        src={imageUrl}
        className="h-48 sm:h-56 md:h-64 lg:h-80 w-full object-cover rounded-xl shadow-lg"
        alt={`${location} Railway Station`}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-5 gap-4">
        {/* Station Details */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl md:text-3xl">{location} Railway Station</h2>
          <div className="flex flex-wrap gap-3">
            <h2 className="p-2 px-4 bg-gray-800 text-gray-200 rounded-full text-sm md:text-md">
              🗓️ {trip?.userSelection?.noOfDays > 1
                ? `Days: ${trip?.userSelection?.noOfDays}`
                : `Day: ${trip?.userSelection?.noOfDays || "N/A"}`}
            </h2>
            <h2 className="p-2 px-4 bg-gray-800 text-gray-200 rounded-full text-sm md:text-md">
              💰 Budget: {trip?.userSelection?.budget || "N/A"}
            </h2>
            <h2 className="p-2 px-4 bg-gray-800 text-gray-200 rounded-full text-sm md:text-md">
              🥂 Travelers: {trip?.userSelection?.Travelers || "N/A"}
            </h2>
          </div>
        </div>

        {/* Share Button */}
       <Button
  onClick={shareTrip}
  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:scale-105 transition-all p-3 rounded-full shadow-md self-end md:self-auto block md:hidden"
>
  <IoIosSend className="text-white text-xl" />
</Button>
      </div>
    </div>
  );
};

export default InfoSection;
