import React from "react";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  // 5 Popular Indian Destinations
  const destinations = [
    {
      id: "1742629727148",
      name: "Jaipur, Rajasthan",
      imageUrl:
        "https://media.istockphoto.com/id/1135820309/photo/amber-fort-and-maota-lake-jaipur-rajasthan-india.jpg?s=2048x2048&w=is&k=20&c=Y65U6Irmz_G8qtReqCF-u_e-BGXR1z_qj3B8Clr73F8=",
      budget: "Luxury Trip",
      travelers: "Family",
    },
    {
      id: "1742629844738",
      name: "Goa",
      imageUrl:
        "https://media.istockphoto.com/id/157579910/photo/the-beach.jpg?s=2048x2048&w=is&k=20&c=ZUR-RzIYa6Cz5dcHzXED49D_evIPbJElchb5QhQQ7aM=",
      budget: "Moderate Trip",
      travelers: "2-5 People",
    },
    {
      id: "1742629920549",
      name: "Manali, Himachal Pradesh",
      imageUrl:
        "https://media.istockphoto.com/id/2158819973/photo/aerial-view-of-beas-river-by-the-pine-trees-forest-in-manali-city-of-himachal-pradesh-of-india.jpg?s=2048x2048&w=is&k=20&c=OeAG_UvHELE7-0zeh7nmOuoeTOBF5nKBp0gCzP5MTH4=",
      budget: "Luxury Trip",
      travelers: "2-6 People",
    },
    {
      id: "1742629986684",
      name: "Varanasi, Uttar Pradesh",
      imageUrl:
        "https://media.istockphoto.com/id/537988165/photo/varanasi.jpg?s=2048x2048&w=is&k=20&c=kTj8njrwskmoiIzifXa71ch8uZjn2gbAe_RrVxRVwDE=",
      budget: "Cheap Trip",
      travelers: "1-3 People",
    },
  ];

  const handleClick = (id) => {
    navigate(`/view-trip/${id}`);
  };

  return (
    <>
      <div className="bg-green-100 min-h-screen">
        <Header />

        {/* Hero Section */}
        <div className="relative w-full h-screen">
          <img
            src="https://images.pexels.com/photos/2916820/pexels-photo-2916820.jpeg"
            alt="Scenic India"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-5">
            <h1 className="text-4xl font-bold">We welcome you to</h1>
            <h2 className="text-5xl font-extrabold text-green-400 mt-2">
              NomadAI!
            </h2>
            <p className="mt-4 text-lg">Explore India's best destinations</p>

            <Link to="/create-trip">
              <div className="bg-green-500/20 backdrop-blur-md border border-green-300/30 p-3 mt-6 flex items-center justify-center transition-all hover:scale-105 hover:shadow-xl rounded-full shadow-lg space-x-2">
                <h1 className="text-bold font-black text-white">Get Started</h1>
                <button className="bg-green-500/30 backdrop-blur-lg border border-green-400/40 p-2 rounded-full hover:bg-green-500/40 transition">
                  <FaPlay className="text-white" />
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-4">
            Popular Indian Destinations
          </h2>

          {/* Destination Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2   md:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition"
                onClick={() => handleClick(dest.id)}
              >
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{dest.name}</h3>
                  <p className="text-gray-600">Budget: {dest.budget}</p>
                  <p className="text-gray-600">Travelers: {dest.travelers}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
