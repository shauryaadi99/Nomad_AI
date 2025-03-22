import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Adjust path accordingly
import GoogleSignIn from "@/view-trip/components/GoogleSignIn.jsx"; // Adjust path accordingly
import { Link, useNavigate } from "react-router-dom";
import { TreePalm, UserCircle } from "lucide-react"; // Tree icon & Default DP

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="absolute top-0 left-0 w-full p-3 bg-black/30 backdrop-blur-md z-50 flex justify-between items-center px-4 md:px-6">
      {/* Brand Name */}
      <Link to="/">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-400">NomadAI!</h2>
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Linktree Button (Always Visible) */}
        <a
          href="https://linktr.ee/Shaurya_Aditya_Verma"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white bg-gray-800 px-2 py-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          <TreePalm size={18} />
          <span className="hidden sm:inline">Linktree</span>
        </a>

        {/* User Section */}
        {user ? (
          <>
            {user.picture ? (
              <img src={user.picture} alt="Profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
            ) : (
              <UserCircle size={32} className="text-white" />
            )}
            <span className="hidden sm:inline text-white">{user.email || "Guest"}</span>
            <Button variant="destructive" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="default" size="sm" onClick={() => setShowSignIn(true)}>
              Sign In
            </Button>
            <GoogleSignIn open={showSignIn} setOpen={setShowSignIn} setUser={setUser} />
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
