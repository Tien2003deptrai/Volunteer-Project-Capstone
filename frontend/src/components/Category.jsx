import { useState, useEffect } from "react";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const imageList = [
  "images/danang1.jpg",
  "images/danang2.jpg",
  "images/danang3.jpg",
  "images/danang4.jpg",
  "images/danang5.jpg",
  "images/danang6.jpg",
];

const Category = () => {
  const [stats, setStats] = useState({
    volunteers: "0+",
    activities: "0+",
    partners: "0+"
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${USER_API}/public-stats`);
      if (res.data.success) {
        const { activeVolunteers, totalDuties, partnerOrganizations } = res.data.stats;
        setStats({
          volunteers: `${activeVolunteers}+`,
          activities: `${totalDuties}+`,
          partners: `${partnerOrganizations}+`
        });
      }
    } catch (error) {
      console.error("Failed to load statistics:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-7xl mx-auto my-16 px-4">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#467057] mb-4">
          Khám Phá Tình Nguyện Tại <span className="text-[#FF5555]">Đà Nẵng</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Cùng DTU Volunteer Connection Platform lan tỏa yêu thương và tạo nên những thay đổi tích cực cho cộng đồng thành phố Đà Nẵng
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto my-8">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {imageList.map((src, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src={src}
                    alt={`Hoạt động tình nguyện tại Đà Nẵng ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-bold text-lg">Hoạt Động {index + 1}</h3>
                    <p className="text-sm">Cùng nhau tạo nên sự khác biệt</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            <CarouselPrevious className="static transform-none ml-0" />
            <CarouselNext className="static transform-none mr-0" />
          </div>
        </Carousel>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-5xl w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-[#467057] mb-4 text-center">Về DTU Volunteer Connection Platform</h2>
        <p className="text-gray-700 text-center leading-relaxed">
          DTU Volunteer Connection Platform là cầu nối giữa những sinh viên tình nguyện đầy nhiệt huyết tại Đại học Duy Tân
          với các tổ chức, cộng đồng cần sự hỗ trợ tại thành phố Đà Nẵng. Chúng tôi tin rằng mỗi hành động nhỏ đều có thể
          tạo nên sự thay đổi lớn cho xã hội. Hãy cùng nhau lan tỏa yêu thương và xây dựng một Đà Nẵng ngày càng tốt đẹp hơn.
        </p>
        <div className="flex justify-center mt-6">
          <div className="flex gap-8 mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#467057]">{stats.volunteers}</div>
              <div className="text-gray-600">Tình nguyện viên</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#467057]">{stats.activities}</div>
              <div className="text-gray-600">Hoạt động</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#467057]">{stats.partners}</div>
              <div className="text-gray-600">Đối tác</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
