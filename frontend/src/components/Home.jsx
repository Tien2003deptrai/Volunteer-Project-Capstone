// Home.jsx
import { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Hero from "./Hero";
import Footer from "./shared/Footer";
import Category from "./Category";
import useGetAllDuties from "@/hooks/useGetAllDuties";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Latest_Duties from "./Latest_Duties";
import TestimonialsSection from "./TestimonialsSection";
import HowItWorksSection from "./HowItWorksSection";

const Home = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useGetAllDuties();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/organizations");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <Hero />
      <Category />
      <HowItWorksSection />
      <Latest_Duties />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Home;
