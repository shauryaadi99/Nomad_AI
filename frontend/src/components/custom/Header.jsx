import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GoogleSignIn from "@/view-trip/components/GoogleSignIn.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TreePalm, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const syncUserFromStorage = () => setUser(getStoredUser());
    window.addEventListener("storage", syncUserFromStorage);
    return () => window.removeEventListener("storage", syncUserFromStorage);
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-3 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-[0_10px_30px_rgba(99,102,241,0.1)]" : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105 p-1.5">
            <img src="/bagicon.svg" alt="Nomad AI Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            Nomad AI
          </h2>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="https://linktr.ee/Shaurya_Aditya_Verma"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-white px-3 py-2 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition duration-300 backdrop-blur-sm hover:border-indigo-500/50"
          >
            <TreePalm size={16} className="text-indigo-400" />
            <span className="hidden sm:inline text-sm font-medium">Linktree</span>
          </a>

          {user ? (
            <div className="flex items-center gap-4">
              {user.picture ? (
                <img src={user.picture} alt="Profile" className="w-9 h-9 rounded-full ring-2 ring-indigo-500/50 shadow-md shadow-indigo-500/20" />
              ) : (
                <UserCircle size={36} className="text-slate-400" />
              )}
              <span className="hidden md:inline text-slate-200 text-sm font-medium">{user.email || "Guest"}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full px-5 transition-colors"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setShowSignIn(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full px-6 shadow-lg shadow-indigo-600/30 transition-all font-semibold border border-indigo-500/50 hover:scale-105"
              >
                Sign In
              </Button>
              <GoogleSignIn open={showSignIn} setOpen={setShowSignIn} setUser={setUser} />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
