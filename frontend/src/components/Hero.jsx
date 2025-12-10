import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch();
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
          Nền tảng kết nối tình nguyện viên DTU — Cùng nhau lan tỏa yêu thương tại Đà Nẵng
        </span>

        {/* Heading */}
        <h1 className="text-2xl text-[#B1DDC3] md:text-5xl font-bold leading-tight">
          Kết Nối - Hành Động - Lan Tỏa <br />
          Đây là <span className="text-[#FF5555]">DTU Volunteer</span>
        </h1>

        {/* Description */}
        <p className="text-sm md:text-lg text-[#B1DDC3] max-w-2xl">
          DTU Volunteer Connection Platform kết nối sinh viên tình nguyện với những cơ hội ý nghĩa tại Đà Nẵng — vì sự thay đổi tích cực bắt đầu từ những hành động nhỏ
        </p>

        {/* Search Bar */}
        <div className="flex bg-[#D0F0DD] w-full sm:w-[80%] md:w-[60%] lg:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm cơ hội tình nguyện tại Đà Nẵng..."
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
