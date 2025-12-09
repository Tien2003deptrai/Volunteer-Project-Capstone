import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch();//eta jokhon volunteer job search korbe tokhon query ta set hobe
    navigate("/browse");
  };
  return (
    <div
      className="h-[70vh] md:h-[80vh] w-[90%] md:w-[85%] mx-auto flex items-center justify-center 
    bg-cover md:bg-cover bg-center rounded-3xl px-6"
      style={{
        backgroundImage: "url('images/July.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center gap-5 text-center my-10 w-full px-4">
        {/* Tagline */}
        <span className="px-4 py-2 rounded-full bg-[#D0F0DD] text-[#2A4B37] font-medium text-sm md:text-base">
          Inspired by the Spirit of July — Uniting Volunteers to Uplift Nations
        </span>

        {/* Heading */}
        <h1 className="text-2xl text-[#B1DDC3] md:text-5xl font-bold leading-tight">
         From Protest to Progress <br />
          This Is <span className="text-[#FF5555]">Bangladesh 2.0</span>
        </h1>

        {/* Description */}
        <p className="text-sm md:text-lg text-[#B1DDC3] max-w-2xl">
          Inspired by the July Revolution, Change Makers connects passionate volunteers with impactful opportunities across the Bangladesh — because real change begins with people
        </p>

        {/* Search Bar */}
        <div className="flex bg-[#D0F0DD] w-full sm:w-[80%] md:w-[60%] lg:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-2">
          <input
            type="text"
            placeholder="Search for volunteer opportunities..."
            className="outline-none border-none w-full bg-transparent px-3 text-black text-sm md:text-base"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-r-full bg-[#FF5555] hover:bg-[#FD3535] px-4 py-2"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;