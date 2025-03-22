import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col items-center gap-6 px-5 md:px-16 lg:px-28 xl:px-56 text-center mt-16">
      <h1 className="font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight">
        <span className="text-[#f56551]">Discover Your Next Adventure with AI:</span> <br className="hidden md:block" />
        Personalized Itineraries at Your Fingertips
      </h1>

      <p className="text-lg md:text-xl text-gray-500">
        Your personal trip planner and travel curator, creating itineraries tailored to your interests and budget.
      </p>

      <Link to="/create-trip">
        <Button className="px-6 py-3 text-lg md:text-xl">Get Started, It's Free</Button>
      </Link>
    </div>
  );
};

export default Hero;
