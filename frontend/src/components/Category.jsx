import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const imageList = [
  "images/july1.jpg",
  "images/july2.jpg",
  "images/july-AbuSayed.jpg",
  "images/july3.jpg",
  "images/july4.jpg",
  "images/july5.jpg",
  "images/july6.jpg",
  "images/july7.jpg",
  "images/july8.jpg",
];

const Category = () => {
  return (
    <div className="flex flex-col items-center gap-5 max-w-7xl mx-auto my-10 px-4">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl text-[#467057] font-bold text-center">
        Honoring Our Heroes For Their Sacrifice by Shaping{" "}
        <span className="text-[#FF5555]">Bangladesh 2.0</span>
      </h1>

      {/* Responsive Carousel with Images */}
      <Carousel className="w-full max-w-xl mx-auto my-10">
        <CarouselContent>
          {imageList.map((src, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/3 sm:basis-1/4 flex justify-center items-center"
            >
              <img
                src={src}
                alt={`July Revolution ${index + 1}`}
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* Description */}
      <p className="text-center text-sm md:text-lg max-w-2xl">
        In 2024, Bangladesh saw a massive student-led movement demanding reform of the long-standing quota system in government jobs. After the High Court reinstated the quota, widespread protests erupted nationwide, met with brutal repression by the Sheikh Hasina government. Security forces, along with ruling party affiliates, violently cracked down on demonstrators, resulting in the deaths of hundreds—including students like Abu Sayed—and thousands injured during what came to be known as the July massacre. Despite the tragic loss of innocent lives, the Supreme Court partially addressed the demands by reinstating the quota with 93% merit-based recruitment. The violent suppression sparked widespread condemnation and calls for justice against the regime’s heavy-handed tactics.
      </p>
    </div>
  );
};

export default Category;
