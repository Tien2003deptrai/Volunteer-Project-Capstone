import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./shared/Footer";
import { setSearchedQuery } from "@/redux/dutySlice";
import Duty from "./Duty";
import useGetAllDuties from "@/hooks/useGetAllDuties";
import BannerSlider from "./shared/BannerSlider";

const Browse = () => {
  useGetAllDuties();
  const { allDuties } = useSelector((store) => store.duty);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);
  const browseBanners = [
    {
      id: 1,
      title: "Browse Volunteer Opportunities",
      subtitle: "Search through hundreds of volunteer duties and find the perfect match",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
      ctaText: "View All Duties",
      ctaLink: "/duties",
      gradient: "from-[#467057] to-[#2A4B37]"
    },
    {
      id: 2,
      title: "Discover Your Passion",
      subtitle: "Explore diverse volunteer opportunities across various fields and causes",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop",
      ctaText: "See Upcoming Events",
      ctaLink: "/upcoming",
      gradient: "from-[#2A4B37] to-[#467057]"
    },
    {
      id: 3,
      title: "Join the Movement",
      subtitle: "Be part of a community dedicated to creating positive change",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
      ctaText: "Start Volunteering",
      ctaLink: "/duties",
      gradient: "from-[#467057] to-[#345441]"
    }
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <BannerSlider banners={browseBanners} />
        </div>
        <div className="my-10">
          <h1 className="font-bold text-xl md:text-2xl my-10">
            Search Results ({allDuties.length})
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {allDuties.map((duty) => {
              return (
                <div key={duty._id} className="h-full">
                  <Duty duty={duty} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
