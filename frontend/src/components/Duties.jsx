import Navbar from './shared/Navbar'
import { useSelector } from 'react-redux';
import Footer from './shared/Footer';
import FilterCard from './FilterCard';
import Duty from './Duty';
import useGetAllDuties from '@/hooks/useGetAllDuties';
import BannerSlider from './shared/BannerSlider';

const Duties = () => {
  useGetAllDuties(); // This will trigger API call when filters change
  const { allDuties = [] } = useSelector(store => store.duty);

  const dutiesBanners = [
    {
      id: 1,
      title: "Find Your Perfect Volunteer Opportunity",
      subtitle: "Discover meaningful duties that match your skills and interests",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
      ctaText: "Browse All Duties",
      ctaLink: "/browse",
      gradient: "from-[#467057] to-[#2A4B37]"
    },
    {
      id: 2,
      title: "Make a Difference Today",
      subtitle: "Join thousands of volunteers creating positive change in communities",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop",
      ctaText: "View Upcoming Events",
      ctaLink: "/upcoming",
      gradient: "from-[#2A4B37] to-[#467057]"
    },
    {
      id: 3,
      title: "Start Your Volunteer Journey",
      subtitle: "Apply now and become part of a community making real impact",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
      ctaText: "Explore Opportunities",
      ctaLink: "/browse",
      gradient: "from-[#467057] to-[#345441]"
    }
  ];

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <BannerSlider banners={dutiesBanners} />
        </div>
        <div className='flex gap-5'>
          <div className='w-30%'>
            <FilterCard />
          </div>
          <div>
            {
              allDuties.length <= 0 ? <span>Duties not found!</span> : (
                <div className='flex-1 h-[88vh] overflow-y-auto pb-5 custom-scrollbar'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch'>
                    {
                      allDuties.map((duty) => (
                        <div key={duty?._id} className="h-full">
                          <Duty duty={duty} />
                        </div>
                      ))
                    }
                  </div>
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
