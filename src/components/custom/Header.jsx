import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GoogleSignIn from "@/view-trip/components/GoogleSignIn.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TreePalm, UserCircle } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Detects navigation changes

  const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const syncUserFromStorage = () => {
      setUser(getStoredUser()); // Update state when localStorage changes
    };

    window.addEventListener("storage", syncUserFromStorage);
    return () => window.removeEventListener("storage", syncUserFromStorage);
  }, []);

  useEffect(() => {
    // Force state update on route change
    setUser(getStoredUser());
  }, [location]); // Runs when the route changes

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="absolute top-0 left-0 w-full p-3 bg-black/30 backdrop-blur-md z-50 flex justify-between items-center px-4 md:px-6">
      <Link to="/">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-400">NomadAI!</h2>
      </Link>

      <div className="flex items-center gap-3 sm:gap-5">
        <a
          href="https://linktr.ee/Shaurya_Aditya_Verma"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white bg-gray-800 px-2 py-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          <TreePalm size={18} />
          <span className="hidden sm:inline">Linktree</span>
        </a>

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
