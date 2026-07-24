import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar, Autoplay } from "swiper/modules";

import iPhone_16 from '../assets/iPhone_16.png';
import shoe from '../assets/Shoes.png';
import fruit_thali from '../assets/Fruit_thali.png';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--border-color)]/50 shadow-xl my-4">
      <Swiper
        modules={[Pagination, Navigation, Scrollbar, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        className="!h-auto"
      >
        {/* Slide 1: iPhone 16 Pro Max */}
        <SwiperSlide className="!h-auto bg-gradient-to-r from-[#0D1B2A] via-[#1B263B] to-[#415A77] text-white min-h-[300px] sm:min-h-[340px] md:min-h-[400px]">
          <div className="flex flex-col md:flex-row items-center w-full h-full p-6 sm:p-10 relative">
            <div className="z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
              <Badge variant="accent" className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Premium Flagship
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#E0E1DD]">
                iPhone 16 Pro Max
              </h1>
              <p className="text-lg sm:text-xl font-medium text-[#778DA9]">
                Starting from <span className="text-white font-bold">₹ 50,769*</span>
              </p>
              <Button size="lg" className="bg-[#778DA9] hover:bg-[#E0E1DD] text-[#0D1B2A] font-semibold gap-2 shadow-lg">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
              <img
                src={iPhone_16}
                className="h-44 sm:h-56 md:h-72 lg:h-80 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105"
                alt="iPhone 16 Pro Max"
              />
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2: Onitsuka Tiger */}
        <SwiperSlide className="!h-auto bg-gradient-to-r from-[#1B263B] via-[#415A77] to-[#778DA9] text-white min-h-[300px] sm:min-h-[340px] md:min-h-[400px]">
          <div className="flex flex-col md:flex-row items-center w-full h-full p-6 sm:p-10 relative">
            <div className="z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
              <Badge variant="secondary" className="bg-[#0D1B2A]/60 text-[#E0E1DD] border-[#778DA9]">
                Iconic Footwear
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#E0E1DD]">
                Onitsuka Tiger
              </h1>
              <p className="text-lg sm:text-xl font-medium text-[#E0E1DD]/90">
                Starting from <span className="text-white font-bold">₹ 10,999*</span>
              </p>
              <Button size="lg" className="bg-[#0D1B2A] hover:bg-[#1B263B] text-[#E0E1DD] font-semibold gap-2 shadow-lg">
                Explore Sneakers <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
              <img
                src={shoe}
                className="h-44 sm:h-56 md:h-72 lg:h-80 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105"
                alt="Onitsuka Tiger Shoes"
              />
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3: Healthy Bites */}
        <SwiperSlide className="!h-auto bg-gradient-to-r from-[#0D1B2A] via-[#1B263B] to-[#415A77] text-white min-h-[300px] sm:min-h-[340px] md:min-h-[400px]">
          <div className="flex flex-col md:flex-row items-center w-full h-full p-6 sm:p-10 relative">
            <div className="z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
              <Badge variant="destructive" className="bg-emerald-500 text-white animate-pulse">
                🌿 Fresh & Organic
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#E0E1DD]">
                HEALTHY <span className="text-[#778DA9]">BITES</span>
              </h1>
              <p className="text-sm sm:text-base text-[#E0E1DD]/80">
                Fresh & organic fruits delivered to your door starting at <span className="text-white font-bold">₹ 199*</span>
              </p>
              <Button size="lg" className="bg-[#778DA9] hover:bg-[#E0E1DD] text-[#0D1B2A] font-semibold gap-2 shadow-lg">
                Order Fresh <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
              <img
                src={fruit_thali}
                className="h-44 sm:h-56 md:h-72 lg:h-80 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105"
                alt="Healthy Fruit Thali"
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Hero;
