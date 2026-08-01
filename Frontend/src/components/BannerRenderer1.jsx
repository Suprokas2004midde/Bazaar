import React, { useContext } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { ShopContext } from "../context/ShopContext";


const BannerRenderer = ({ banner }) => {
  const {navigate} = useContext(ShopContext);

  if (!banner) return null;

  const {
    title,
    subtitle,
    buttonText = "Shop Now",
    redirectUrl = "/",
    desktopTemplate = "split-hero",
    mobileTemplate = "split-hero",
    desktopImage,
    mobileImage,
    theme = "from-[#0D1B2A] via-[#1B263B] to-[#415A77]",
    badge,
  } = banner;

  const handleRedirect = () => {
    if (redirectUrl.startsWith("http")) {
      window.location.href = redirectUrl;
    } else {
      navigate(redirectUrl);
    }
  };

  // Predefined animations inline
  const floatStyle = {
    animation: "float 4s ease-in-out infinite",
  };

  const floatKeyframe = (
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-12px) scale(1.03); }
      }
    `}</style>
  );

  // Layout 1: Split Hero
  const renderSplitHero = () => (
    <div className="flex flex-col md:flex-row items-center w-full h-full p-6 sm:p-10 relative md:min-h-[400px]">
      <div className="z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
        {badge && (
          <Badge variant="accent" className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> {badge}
          </Badge>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#E0E1DD] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg font-medium text-[#778DA9]">
            {subtitle}
          </p>
        )}
        <Button
          size="lg"
          onClick={handleRedirect}
          className="bg-[#778DA9] hover:bg-[#E0E1DD] text-[#0D1B2A] font-semibold gap-2 shadow-lg"
        >
          {buttonText} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
        <picture>
          {mobileImage && <source media="(max-width: 640px)" srcSet={mobileImage} />}
          <img
            src={desktopImage}
            className="h-44 sm:h-56 md:h-72 lg:h-80 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105"
            alt={title}
          />
        </picture>
      </div>
    </div>
  );

  // Layout 2: Floating Product (Glassmorphism layout with floating animations for products)
  const renderFloatingProduct = () => (
    <div className="flex flex-col md:flex-row items-center w-full h-full p-6 sm:p-10 relative md:min-h-[400px] overflow-hidden">
      {floatKeyframe}
      <div className="z-10 w-full md:w-[45%] flex flex-col items-center md:items-start text-center md:text-left space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
        {badge && (
          <Badge className="bg-orange-500 text-white hover:bg-orange-600">
            {badge}
          </Badge>
        )}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-white/90 font-medium">
            {subtitle}
          </p>
        )}
        <Button
          size="lg"
          onClick={handleRedirect}
          className="bg-white hover:bg-gray-100 text-gray-900 font-bold gap-2 shadow-lg"
        >
          {buttonText} <ShoppingBag className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full md:w-[55%] flex justify-center items-center mt-6 md:mt-0">
        <picture style={floatStyle} className="transition-all duration-300">
          {mobileImage && <source media="(max-width: 640px)" srcSet={mobileImage} />}
          <img
            src={desktopImage}
            className="h-48 sm:h-60 md:h-76 lg:h-84 object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.7)]"
            alt={title}
          />
        </picture>
      </div>
    </div>
  );

  // Layout 3: Festival (Vibrant gradient background with celebratory badge and large typography)
  const renderFestival = () => (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 sm:p-12 text-center space-y-6 md:min-h-[400px] relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      {badge && (
        <Badge variant="destructive" className="bg-red-600 text-white animate-pulse text-xs px-3 py-1 uppercase tracking-widest font-black">
          🔥 {badge}
        </Badge>
      )}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#E0E1DD] max-w-3xl drop-shadow-md">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg sm:text-xl font-medium text-white/80 max-w-xl">
          {subtitle}
        </p>
      )}
      <Button
        size="lg"
        onClick={handleRedirect}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold px-8 py-6 rounded-full text-base shadow-xl transform active:scale-95 transition-all"
      >
        {buttonText}
      </Button>
    </div>
  );

  // Layout 4: Fashion (Elegant minimalistic lifestyle theme with overlapping layout)
  const renderFashion = () => (
    <div className="flex flex-col md:flex-row items-stretch w-full h-full md:min-h-[400px] overflow-hidden">
      <div className="w-full md:w-[45%] flex flex-col justify-center items-center md:items-start text-center md:text-left p-6 sm:p-10 space-y-4">
        {badge && (
          <span className="text-xs uppercase tracking-widest text-white/70 font-light block">
            // {badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide uppercase text-white leading-tight">
          {title}
        </h1>
        <div className="w-12 h-[2px] bg-white/40"></div>
        {subtitle && (
          <p className="text-sm sm:text-base font-semibold text-white/80">
            {subtitle}
          </p>
        )}
        <button
          onClick={handleRedirect}
          className="px-6 py-2.5 border border-white text-white text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded"
        >
          {buttonText}
        </button>
      </div>
      <div className="w-full md:w-[55%] relative min-h-[220px] md:min-h-0 overflow-hidden">
        <picture>
          {mobileImage && <source media="(max-width: 640px)" srcSet={mobileImage} />}
          <img
            src={desktopImage}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] hover:scale-110"
            alt={title}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
      </div>
    </div>
  );

  // Layout 5: Grocery Fresh (Organic/nature green theme with fresh badge)
  const renderGroceryFresh = () => (
    <div className="flex flex-col md:flex-row items-center w-full h-full p-6 sm:p-10 relative md:min-h-[400px]">
      <div className="z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1">
          🌿 {badge || "Fresh & Organic"}
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg text-emerald-100/90 font-medium">
            {subtitle}
          </p>
        )}
        <Button
          size="lg"
          onClick={handleRedirect}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-lg"
        >
          {buttonText} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
        <picture>
          {mobileImage && <source media="(max-width: 640px)" srcSet={mobileImage} />}
          <img
            src={desktopImage}
            className="h-44 sm:h-56 md:h-72 lg:h-80 object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.4)]"
            alt={title}
          />
        </picture>
      </div>
    </div>
  );

  // Select renderer based on template name
  const renderTemplate = () => {
    switch (desktopTemplate) {
      case "split-hero":
        return renderSplitHero();
      case "floating-product":
        return renderFloatingProduct();
      case "festival":
        return renderFestival();
      case "fashion":
        return renderFashion();
      case "grocery-fresh":
        return renderGroceryFresh();
      default:
        return renderSplitHero();
    }
  };

  return (
    <div className={`w-full bg-gradient-to-r ${theme} text-white`}>
      {renderTemplate()}
    </div>
  );
};

export default BannerRenderer;
