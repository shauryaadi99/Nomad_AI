import React from "react";
import { FaPlay, FaMapMarkerAlt, FaUsers, FaWallet } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  const destinations = [
    {
      id: "1742629727148",
      name: "Jaipur, Rajasthan",
      imageUrl: "https://media.istockphoto.com/id/1135820309/photo/amber-fort-and-maota-lake-jaipur-rajasthan-india.jpg?s=2048x2048&w=is&k=20&c=Y65U6Irmz_G8qtReqCF-u_e-BGXR1z_qj3B8Clr73F8=",
      budget: "Luxury Trip",
      travelers: "Family",
    },
    {
      id: "1742629844738",
      name: "Goa",
      imageUrl: "https://media.istockphoto.com/id/157579910/photo/the-beach.jpg?s=2048x2048&w=is&k=20&c=ZUR-RzIYa6Cz5dcHzXED49D_evIPbJElchb5QhQQ7aM=",
      budget: "Moderate Trip",
      travelers: "2-5 People",
    },
    {
      id: "1742629920549",
      name: "Manali, Himachal Pradesh",
      imageUrl: "https://media.istockphoto.com/id/2158819973/photo/aerial-view-of-beas-river-by-the-pine-trees-forest-in-manali-city-of-himachal-pradesh-of-india.jpg?s=2048x2048&w=is&k=20&c=OeAG_UvHELE7-0zeh7nmOuoeTOBF5nKBp0gCzP5MTH4=",
      budget: "Luxury Trip",
      travelers: "2-6 People",
    },
    {
      id: "1742629986684",
      name: "Varanasi, Uttar Pradesh",
      imageUrl: "https://media.istockphoto.com/id/537988165/photo/varanasi.jpg?s=2048x2048&w=is&k=20&c=kTj8njrwskmoiIzifXa71ch8uZjn2gbAe_RrVxRVwDE=",
      budget: "Cheap Trip",
      travelers: "1-3 People",
    },
  ];

  const handleClick = (id) => {
    navigate(`/view-trip/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">

      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src="/NomadAI_Herosection.jpeg"
            alt="Scenic India"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950 z-10" />
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium tracking-wide backdrop-blur-md mb-6 inline-block">
              AI-Powered Itineraries
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
          >
            Discover the Magic of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Nomad AI
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl font-light"
          >
            Experience personalized travel planning powered by advanced AI. We craft the perfect journey tailored to your budget, style, and dreams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/create-trip" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(99,102,241,0.4)]">
              <span className="relative z-10">Start Your Journey</span>
              <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 text-white group-hover:bg-indigo-600 transition-colors">
                <FaPlay className="w-3 h-3 ml-0.5" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity z-0" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="relative z-20 px-6 py-24 md:px-12 lg:px-24 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Trending Destinations
              </h2>
              <p className="text-slate-400 text-lg">Curated experiences from our top travelers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => handleClick(dest.id)}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl hover:shadow-indigo-500/20"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
                      <FaMapMarkerAlt className="text-white w-4 h-4" />
                    </div>
                    <span className="text-white font-semibold text-lg drop-shadow-md">{dest.name}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-slate-400">
                      <FaWallet className="text-indigo-400 w-4 h-4" />
                      <span className="text-sm font-medium">{dest.budget}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <FaUsers className="text-pink-400 w-4 h-4" />
                      <span className="text-sm font-medium">{dest.travelers}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center group-hover:border-indigo-500/30 transition-colors">
                    <span className="text-indigo-400 text-sm font-semibold group-hover:text-indigo-300">View Itinerary</span>
                    <span className="text-slate-600 group-hover:text-indigo-400 transition-colors transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
