import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails } from "@/service/GlobalApi";

const API_KEY = import.meta.env.VITE_GMAPS_API_KEY;

// Function to construct photo URL using photoReference
const getPhotoUrl = (photoReference, maxWidth = 600, maxHeight = 600) => {
  if (!photoReference) return null;

  return `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&maxwidth=${maxWidth}&maxheight=${maxHeight}&key=${API_KEY}`;
};

// Default fallback image
const fallbackImage = "https://img.freepik.com/free-photo/3d-icon-traveling-vacation_23-2151037394.jpg?t=st=1742924976~exp=1742928576~hmac=cb77b1782812df2f91fd49f214ff73952797fd7ed487e85b8e2a0be9cf1b2a5c&w=1380";

const InfoSection = ({ trip = { userSelection: {} } }) => {
  const location = trip?.userSelection?.location || "Unknown Location";
  const [imageUrl, setImageUrl] = useState(fallbackImage);

  // Fetch place photo when component mounts or location changes
  useEffect(() => {
    if (location && location !== "Unknown Location") {
      fetchPlacePhoto(location);
    }
  }, [location]);

  const fetchPlacePhoto = async (locationName) => {
    try {
      console.log(`Fetching details for: ${locationName}`);
      const result = await GetPlaceDetails(locationName);

      if (!result || !result.places || !result.places[0]) {
        throw new Error("No places found in the API response.");
      }

      console.log("API Response:", result);

      // Extract photoReference safely
      const photoReference = result?.places?.[0]?.photos?.[0]?.photo_reference || null;

      if (photoReference) {
        const photoURL = getPhotoUrl(photoReference);
        setImageUrl(photoURL);
      } else {
        console.warn(`No photo found for ${locationName}. Using fallback image.`);
        setImageUrl(fallbackImage);
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
      setImageUrl(fallbackImage);
    }
  };

  // Function to share trip details
  const shareTrip = () => {
    const websiteUrl = window.location.href;
    const message = `📍 Check out my travel plan to ${location}!\n🗓️ Duration: ${
      trip?.userSelection?.noOfDays || "N/A"
    } days\n💰 Budget: ${trip?.userSelection?.budget || "N/A"}\n🥂 Travelers: ${
      trip?.userSelection?.Travelers || "N/A"
    }\n🔗 ${websiteUrl}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this travel plan!",
          text: message,
          url: websiteUrl,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md max-w-5xl mx-auto mt-10">
      {/* Responsive Image */}
      <img
        src={imageUrl}
        className="h-48 sm:h-56 md:h-64 lg:h-80 w-full object-cover rounded-xl shadow-lg"
        alt={`${location}`}
        onError={() => setImageUrl(fallbackImage)} // Handle broken images
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-5 gap-4">
        {/* Station Details */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl md:text-3xl">{location}</h2>
          <div className="flex flex-wrap gap-3">
            <h2 className="p-2 px-4 bg-gray-800 text-gray-200 rounded-full text-sm md:text-md">
              🗓️{" "}
              {trip?.userSelection?.noOfDays > 1
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
