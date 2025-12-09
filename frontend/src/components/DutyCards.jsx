import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";

const DutyCards = ({ duty }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${duty._id}`)}
      className="p-5 sm:p-6 md:p-8 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer w-full max-w-md mx-auto"
    >
      <Avatar className="w-12 h-12 md:w-14 md:h-14">
        <AvatarImage src={duty?.organization?.logo} />
      </Avatar>
      <div>
        <h1 className="font-medium text-lg">{duty?.organization?.name}</h1>
        <p className="text-sm text-gray-500">Bangladesh</p>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2">{duty?.tittle}</h1>
        <p className="text-sm text-gray-600">{duty?.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge className="text-[#467057] font-bold" variant="ghost">
          {duty?.position} Slot
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {duty?.jobType}
        </Badge>
        <Badge className="text-[#2A4B37] font-bold" variant="ghost">
          {duty?.workDuration} Hour
        </Badge>
      </div>
    </div>
  );
};
export default DutyCards;