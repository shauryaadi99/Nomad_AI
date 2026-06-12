import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails } from "@/service/GlobalApi";
import { motion } from "framer-motion";

// Fallback image
const fallbackImage =
  "https://img.freepik.com/free-photo/3d-icon-traveling-vacation_23-2151037394.jpg?t=st=1742924976~exp=1742928576~hmac=cb77b1782812df2f91fd49f214ff73952797fd7ed487e85b8e2a0be9cf1b2a5c&w=1380";

// Function to construct photo URL using the backend proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://nomad-ai-backend.vercel.app";

const getPhotoUrl = (photoReference, maxWidth = 600, maxHeight = 600) => {
  return photoReference
    ? `${API_BASE_URL}/api/place-photo?name=${photoReference}&maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}`
    : fallbackImage;
};

const InfoSection = ({ trip = { userSelection: {} } }) => {
  const location = trip?.userSelection?.location || "Unknown Location";
  const [imageUrl, setImageUrl] = useState(fallbackImage);

  // Fetch place photo when component mounts or location changes
  useEffect(() => {
    if (location && location !== "Unknown Location") {
      fetchPlacePhoto(location);
    }
  }, [location]);

  // Function to fetch and set place photo
  const fetchPlacePhoto = async (locationName) => {
    try {
      const result = await GetPlaceDetails(locationName);

      if (!result || !result.places || !result.places[0]) {
        throw new Error("No places found in the API response.");
      }

      const photoReference = result?.places?.[0]?.photos?.[0]?.name || null;

      if (photoReference) {
        const photoURL = getPhotoUrl(photoReference);
        setImageUrl(photoURL);
      } else {
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
    <div className="flex flex-col gap-6">
      {/* Responsive Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
      >
        <img
          src={imageUrl}
          className="h-64 sm:h-72 md:h-80 lg:h-96 w-full object-cover"
          alt={`${location}`}
          onError={() => setImageUrl(fallbackImage)} 
        />
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="font-extrabold text-3xl md:text-5xl text-white">{location}</h2>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-slate-800/80 text-indigo-300 rounded-full text-sm font-medium border border-slate-700/50">
                🗓️ {trip?.userSelection?.noOfDays > 1 ? `${trip?.userSelection?.noOfDays} Days` : `${trip?.userSelection?.noOfDays || "N/A"} Day`}
              </span>
              <span className="px-4 py-2 bg-slate-800/80 text-indigo-300 rounded-full text-sm font-medium border border-slate-700/50">
                💰 {trip?.userSelection?.budget || "N/A"}
              </span>
              <span className="px-4 py-2 bg-slate-800/80 text-indigo-300 rounded-full text-sm font-medium border border-slate-700/50">
                🥂 {trip?.userSelection?.Travelers || "N/A"}
              </span>
            </div>
          </div>

          <Button
            onClick={shareTrip}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 py-6 shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 group w-full md:w-auto justify-center border border-indigo-500/50"
          >
            <span className="font-semibold">Share Trip</span>
            <IoIosSend className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoSection;
