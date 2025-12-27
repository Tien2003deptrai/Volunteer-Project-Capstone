import Navbar from './shared/Navbar'
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Footer from './shared/Footer';
import FilterCard from './FilterCard';
import Duty from './Duty';
import useGetAllDuties from '@/hooks/useGetAllDuties';
import BannerSlider from './shared/BannerSlider';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

const Duties = () => {
  useGetAllDuties(); // This will trigger API call when filters change
  const { allDuties = [] } = useSelector(store => store.duty);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid

  const dutiesBanners = [
    {
      id: 1,
      title: "Tìm Cơ hội Tình nguyện Hoàn hảo của Bạn",
      subtitle: "Khám phá những hoạt động ý nghĩa phù hợp với kỹ năng và sở thích của bạn",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
      ctaText: "Xem Tất cả Hoạt động",
      ctaLink: "/browse",
      gradient: "from-[#467057] to-[#2A4B37]"
    },
    {
      id: 2,
      title: "Tạo Sự Khác Biệt Hôm Nay",
      subtitle: "Tham gia cùng hàng nghìn tình nguyện viên tạo ra thay đổi tích cực trong cộng đồng",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop",
      ctaText: "Xem Sự kiện Sắp Diễn Ra",
      ctaLink: "/upcoming",
      gradient: "from-[#2A4B37] to-[#467057]"
    },
    {
      id: 3,
      title: "Bắt đầu Hành trình Tình nguyện của Bạn",
      subtitle: "Ứng tuyển ngay và trở thành một phần của cộng đồng tạo ra tác động thực sự",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
      ctaText: "Khám phá Cơ hội",
      ctaLink: "/browse",
      gradient: "from-[#467057] to-[#345441]"
    }
  ];

  // Pagination calculations
  const totalPages = Math.ceil(allDuties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDuties = allDuties.slice(startIndex, endIndex);

  // Reset to page 1 when duties change (e.g., filter applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [allDuties.length]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div>
      <Navbar />
      <div className='max-w-full mx-auto mt-5 px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 max-w-7xl mx-auto'>
          <BannerSlider banners={dutiesBanners} />
        </div>
        <div className='flex gap-5'>
          <div className='w-[300px]'>
            <FilterCard />
          </div>
          <div className='flex-1'>
            {
              allDuties.length <= 0 ? <span>Không tìm thấy hoạt động!</span> : (
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch'>
                    {
                      paginatedDuties.map((duty) => (
                        <div key={duty?._id} className="h-full">
                          <Duty duty={duty} />
                        </div>
                      ))
                    }
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {renderPaginationItems()}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              )
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Duties
