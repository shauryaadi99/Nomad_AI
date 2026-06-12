import React, { useState, useEffect } from "react";
import { GetPlaceDetails } from "@/service/GlobalApi";
import { FaMapMarkerAlt } from "react-icons/fa"; 
import { HiArrowUp } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

// Fallback image for missing images
const fallbackImage =
  "https://media.istockphoto.com/id/1083982928/photo/jaipur-metro.jpg?s=612x612&w=0&k=20&c=gLJrIg6X9XvumVlMLyZ-RUi3SZJa0Yu4O4UfWVoJc0c=";

const PlacesToVisit = ({ trip = {} }) => {
  const [updatedItinerary, setUpdatedItinerary] = useState([]);
  const itineraryArray = Array.isArray(trip?.tripData?.itinerary)
    ? trip.tripData.itinerary
    : [];

  // Function to generate photo URL using backend proxy
  const getPhotoUrl = (photoReference, maxWidth = 600, maxHeight = 600) => {
    return photoReference
      ? `/api/place-photo?name=${photoReference}&maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}`
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

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openMap = (placeName, placeAddress) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      placeName
    )}+${encodeURIComponent(placeAddress)}`;
    window.open(mapUrl, "_blank");
  };

  return (
    <div className="mt-4 w-full relative">
      <div className="space-y-12">
        {updatedItinerary.length > 0 ? (
          updatedItinerary.map((dayData, dayIndex) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              key={dayIndex}
              className="p-6 sm:p-8 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 shadow-sm"
            >
              {/* Theme & Best Time */}
              <div className="mb-8 flex flex-col items-start gap-3">
                <div className="bg-slate-800 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-slate-700/50">
                  <span className="text-lg">📅</span> Day {dayData.day}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {dayData.theme || "No theme available"}
                </h3>
                <div className="inline-flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">🕒 Best Time:</span>
                  <span className="font-medium text-slate-200">
                    {dayData.bestTimeToVisit || "N/A"}
                  </span>
                </div>
              </div>

              {/* Itinerary Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(dayData.locations) && dayData.locations.length > 0 ? (
                  dayData.locations.map((place, placeIndex) => {
                    const imageSrc = getPhotoUrl(place.photoReference);

                    return (
                      <motion.div
                        whileHover={{ y: -4 }}
                        key={placeIndex}
                        className="group flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all cursor-pointer"
                        onClick={() => openMap(place.placeName, place.placeDetails)}
                      >
                        {/* Image Section */}
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={imageSrc}
                            alt={place.placeName}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                          
                          <div className="absolute top-4 right-4 z-20 bg-slate-950/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm hover:bg-indigo-600 transition-colors border border-slate-800">
                            <FaMapMarkerAlt className="text-white w-4 h-4" />
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4 pt-12">
                            <h4 className="font-bold text-xl text-white drop-shadow-md line-clamp-1 group-hover:text-indigo-300 transition-colors">
                              {place.placeName}
                            </h4>
                          </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-6 flex-1 flex flex-col">
                          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">
                            {place.placeDetails}
                          </p>
                          <div className="flex justify-between items-center pt-4 border-t border-slate-800 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                            <span>Explore on Map</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-slate-500 italic py-8">
                    No locations listed for this day.
                  </p>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
            <p className="text-slate-500 text-lg">No itinerary data available.</p>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all z-50 group"
            aria-label="Scroll to top"
          >
            <HiArrowUp size={24} className="transform group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlacesToVisit;
