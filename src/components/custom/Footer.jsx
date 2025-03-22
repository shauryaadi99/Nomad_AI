import React from "react";
import { Heart, Linkedin, Instagram, Github, TreePalm } from "lucide-react"; // Icons

const Footer = () => {
  return (
    <footer className="w-full bg-black/80 text-white py-5 px-6 md:px-10 text-center">
      <div className="flex flex-col items-center gap-3">
        {/* Made with love message */}
        <p className="text-gray-400 flex items-center gap-1">
          Made with <Heart size={18} className="text-red-500" /> Support for more brewed-up apps ☕
        </p>

        {/* Social Media Links */}
        <div className="flex gap-5">
          <a href="https://www.linkedin.com/in/shauryaaditya99/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
            <Linkedin size={24} />
          </a>
          <a href="https://www.instagram.com/vermibites" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">
            <Instagram size={24} />
          </a>
          <a href="https://github.com/shauryaadi99/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
            <Github size={24} />
          </a>
          <a href="https://linktr.ee/Shaurya_Aditya_Verma" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 transition">
            <TreePalm size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
