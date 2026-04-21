import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar } from "swiper/modules";

import iPhone_16 from '../assets/iPhone_16.png'
import shoe from '../assets/Shoes.png'
import fruit_thali from '../assets/Fruit_thali.png'

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Hero = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl md:rounded-4xl">
      <Swiper
        modules={[Pagination, Navigation, Scrollbar]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        autoplay={{
            delay: 2,
            disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide changed")}
        className="!h-auto"
      >
        <SwiperSlide className="!h-auto bg-indigo-600 text-white min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px]">
          {/* Inner wrapper — Swiper overrides display on SwiperSlide, so flex must go here */}
          <div className="flex flex-col md:flex-row items-center w-full h-full">
            <div className="z-10 w-full md:w-1/2 flex flex-col items-center justify-center text-center px-5 py-6 sm:p-8 md:p-12">
              <p className="text-base sm:text-lg md:text-xl opacity-100">
                iPhone 16 Pro Max
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold my-2 sm:my-3 md:my-5 leading-tight">
                From ₹ 50,769*
              </h2>
              <button className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold cursor-pointer hover:bg-gray-100 transition-all active:scale-95 text-sm sm:text-base">
                Shop Now
              </button>
            </div>
            {/* Product Image */}
            <div className="w-full md:w-1/2 flex justify-center items-end pb-4 md:pb-0">
              <img
                src={iPhone_16}
                className="h-36 sm:h-48 md:h-56 lg:h-84 object-contain drop-shadow-2xl"
                alt="iPhone"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="!h-auto bg-yellow-500 text-white font-bold min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px]">
          {/* Inner wrapper — Swiper overrides display on SwiperSlide, so flex must go here */}
          <div className="flex flex-col md:flex-row items-center w-full h-full">
            <div className="z-10 w-full md:w-1/2 flex flex-col items-center justify-center text-center px-5 py-6 sm:p-8 md:p-12">
              <p className="text-base sm:text-lg md:text-xl opacity-100">
                Onitsuka Tiger
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold my-2 sm:my-3 md:my-5 leading-tight">
                From ₹ 10,999*
              </h2>
              <button className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold cursor-pointer hover:bg-gray-100 transition-all active:scale-95 text-sm sm:text-base">
                Shop Now
              </button>
            </div>
            {/* Product Image */}
            <div className="w-full md:w-1/2 flex justify-center items-end pb-4 md:pb-0">
              <img
                src={shoe}
                className="h-36 sm:h-48 md:h-56 lg:h-84 object-contain drop-shadow-2xl"
                alt="iPhone"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="!h-auto bg-gradient-to-br from-emerald-600 via-green-500 to-lime-400 text-white font-bold relative overflow-hidden min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px]">
          {/* Decorative background circles */}
          <div className="absolute top-[-40px] left-[-40px] w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-[-30px] right-[-30px] w-52 h-52 bg-white/5 rounded-full"></div>

          {/* Inner wrapper */}
          <div className="flex flex-col md:flex-row items-center w-full relative z-10">
            {/* Text Content */}
            <div className="z-10 w-full md:w-1/2 flex flex-col items-center justify-center text-center px-5 py-6 sm:p-8 md:p-12">
              {/* Badge */}
              <span className="inline-block bg-red-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-lg animate-pulse">
                🔥 New Arrival
              </span>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-none tracking-tight drop-shadow-md">
                HEALTHY
              </h2>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-none tracking-tight drop-shadow-md text-yellow-300">
                BITES
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg font-normal opacity-90 mt-3 max-w-xs">
                Fresh & organic fruits delivered to your door
              </p>

              {/* Price + CTA */}
              <p className="text-lg sm:text-xl md:text-2xl font-bold mt-3 mb-4">
                Starting at ₹ 199*
              </p>
              <button className="bg-white text-green-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold cursor-pointer hover:bg-yellow-300 hover:text-green-900 transition-all active:scale-95 text-sm sm:text-base shadow-lg">
                Shop Now
              </button>
            </div>

            {/* Product Image */}
            <div className="w-full md:w-1/2 flex justify-center items-end pb-4 md:pb-0 relative">
              <img
                src={fruit_thali}
                className="h-36 sm:h-48 md:h-56 lg:h-84 object-contain drop-shadow-2xl"
                alt="Healthy Bites Fruit Thali"
              />
            </div>
          </div>

          {/* Bottom Tagline */}
          <div className="w-full text-center pb-3 relative z-10">
            <p className="text-xs sm:text-sm italic font-light opacity-100 tracking-wide">
              Snack Happily Ever After — Sharing is Caring 🌿
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Hero;
