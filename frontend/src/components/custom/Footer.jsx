import React from "react";
import {
  Heart,
  Linkedin,
  Instagram,
  Github,
  TreePalm,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 text-white relative pt-12 pb-8 border-t border-slate-800 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-32 bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center gap-8 relative z-10">
        {/* Logo or Brand */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 p-2">
            <img
              src="/bagicon.svg"
              alt="Nomad AI Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white mt-2">
            Nomad AI
          </h2>
          <p className="text-slate-400 text-sm max-w-sm text-center mt-1 leading-relaxed">
            Your personal AI travel planner. Explore the world seamlessly with
            AI-crafted itineraries.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-slate-800 transition-all shadow-md group"
          >
            <Home
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
          </Link>
          <a
            href="https://www.linkedin.com/in/shauryaaditya99/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-800 transition-all shadow-md group"
          >
            <Linkedin
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
          </a>
          <a
            href="https://www.instagram.com/vermibites"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-slate-800 transition-all shadow-md group"
          >
            <Instagram
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
          </a>
          <a
            href="https://github.com/shauryaadi99/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/50 hover:bg-slate-800 transition-all shadow-md group"
          >
            <Github
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
          </a>
          <a
            href="https://linktr.ee/Shaurya_Aditya_Verma"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/50 hover:bg-slate-800 transition-all shadow-md group"
          >
            <TreePalm
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
          </a>
        </div>

        <div className="w-full h-px bg-slate-800/50" />

        {/* Made with love message */}
        <p className="text-slate-500 flex flex-col md:flex-row items-center gap-1.5 text-sm font-medium">
          <span>
            Made with{" "}
            <Heart size={16} className="text-red-500 inline fill-red-500/20" />{" "}
            by Shaurya Aditya Verma.
          </span>
          <span className="hidden md:inline">•</span>
          <span>Support for more brewed-up apps ☕</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
