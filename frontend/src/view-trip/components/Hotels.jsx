import React, { useEffect, useState } from "react";
import { GetPlaceDetails } from "@/service/GlobalApi";
import { FaMapMarkerAlt, FaStar, FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";

// Function to construct photo URL using backend proxy
const getPhotoUrl = (photoReference, maxWidth = 600, maxHeight = 600) => {
  if (!photoReference) return null;
  return `/api/place-photo?name=${photoReference}&maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}`;
};

// Default fallback image
const fallbackImage =
  "https://www.uniqhotels.com/media/cache/b9/37/b9379a51c0b0db5e3af64eaa97e91584.webp";

const Hotels = ({ trip = {} }) => {
  const hotels = trip?.tripData?.hotelOptions || trip?.tripData?.hotels || [];
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
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName)}+${encodeURIComponent(hotelAddress)}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      alert("Hotel name or address not available.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="mt-2 w-full">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {hotels.length > 0 ? (
          hotels.map((hotel, index) => (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              key={index}
              className="group relative bg-slate-900/80 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer border border-slate-800 hover:border-indigo-500/50 overflow-hidden flex flex-col"
              onClick={() => openHotelOnMap(hotel.hotelName, hotel.hotelAddress)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={hotelImages[hotel.hotelName] || fallbackImage}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  alt={hotel.hotelName || "Hotel Image"}
                />
                
                {/* Rating Badge */}
                <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 border border-slate-700 shadow-sm">
                  <FaStar className="text-yellow-400 w-3 h-3" />
                  <span className="text-white text-xs font-bold">{hotel.rating || "N/A"}</span>
                </div>

                {/* Map Icon */}
                <div className="absolute top-4 right-4 z-20 bg-slate-950/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm hover:bg-indigo-600 border border-slate-700 transition-colors">
                  <FaMapMarkerAlt className="text-white w-4 h-4" />
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {hotel.hotelName || "Hotel Name Not Available"}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {hotel.hotelAddress || "No Address Available"}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 mt-1">
                    <span className="text-lg">💰</span>
                    <span className="font-semibold">{hotel.price || hotel.pricePerNight || "Contact for price"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            No hotel recommendations found for this trip.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Hotels;
