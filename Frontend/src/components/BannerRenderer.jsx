import React, { useContext } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

// ---------------------------------------------------------------------------
// Gradient resolution
// ---------------------------------------------------------------------------
// Tailwind's JIT compiler only generates CSS for class names it can see in
// source files at BUILD time. Admin-picked colors live in the database and
// only exist at RUNTIME, so building a className like `from-[#123456]` from
// a DB value never gets its CSS generated. Fix: resolve the stored theme to
// a real CSS gradient string and apply it via inline `style`, which works
// regardless of what Tailwind saw at build time.
const DEFAULT_GRADIENT =
  "linear-gradient(90deg, #0D1B2A 0%, #1B263B 50%, #415A77 100%)";

const DIRECTION_TO_ANGLE = {
  "to-r": "90deg", "to-right": "90deg",
  "to-l": "270deg", "to-left": "270deg",
  "to-t": "0deg", "to-top": "0deg",
  "to-b": "180deg", "to-bottom": "180deg",
  "to-tr": "45deg", "to-br": "135deg", "to-bl": "225deg", "to-tl": "315deg",
};

function resolveGradient(theme) {
  if (!theme || typeof theme !== "string") return DEFAULT_GRADIENT;
  const value = theme.trim();

  if (value.startsWith("linear-gradient(") || value.startsWith("radial-gradient(")) {
    return value;
  }

  // Legacy "from-[#..] via-[#..] to-[#..]" Tailwind strings.
  const hexMatches = [...value.matchAll(/#([0-9a-fA-F]{3,8})/g)].map((m) => `#${m[1]}`);
  if (hexMatches.length >= 2) {
    const directionKey = Object.keys(DIRECTION_TO_ANGLE).find((k) => value.includes(k));
    const angle = DIRECTION_TO_ANGLE[directionKey] || "90deg";
    return `linear-gradient(${angle}, ${hexMatches.join(", ")})`;
  }

  return DEFAULT_GRADIENT;
}

// ---------------------------------------------------------------------------
// Contrast-aware tone
// ---------------------------------------------------------------------------
// Presets now range from very dark (Roasted Bean) to very light (Coconut
// Sky, Garden Fresh). Hard-coding white text breaks on light backgrounds, so
// the average relative luminance of the gradient's stops decides whether the
// banner renders as a light-on-dark or dark-on-light composition.
function getTone(gradientCss) {
  const hexes = [...gradientCss.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g)].map((m) => m[1]);
  let isDark = true;

  if (hexes.length) {
    const luminance = (hex) => {
      const h = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
      const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
      const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
      return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    };
    const avg = hexes.reduce((sum, h) => sum + luminance(h), 0) / hexes.length;
    isDark = avg < 0.55;
  }

  return isDark
    ? {
        isDark: true,
        heading: "text-white",
        body: "text-white/65",
        faint: "text-white/45",
        hairline: "border-white/20",
        surface: "bg-white/[0.06]",
        glow: "rgba(255,255,255,0.28)",
        ctaSolid: "bg-white text-gray-900 hover:bg-white/90",
        ctaOutline: "border-white/70 text-white hover:bg-white hover:text-gray-900",
        dot: "bg-white",
      }
    : {
        isDark: false,
        heading: "text-gray-900",
        body: "text-gray-600",
        faint: "text-gray-500",
        hairline: "border-gray-900/15",
        surface: "bg-gray-900/[0.04]",
        glow: "rgba(0,0,0,0.10)",
        ctaSolid: "bg-gray-900 text-white hover:bg-gray-800",
        ctaOutline: "border-gray-900/60 text-gray-900 hover:bg-gray-900 hover:text-white",
        dot: "bg-gray-900",
      };
}

const BannerRenderer = ({ banner }) => {
  const { navigate } = useContext(ShopContext);

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
    theme,
    badge,
  } = banner;

  const gradient = resolveGradient(theme);
  const tone = getTone(gradient);

  const handleRedirect = () => {
    if (redirectUrl.startsWith("http")) {
      window.location.href = redirectUrl;
    } else {
      navigate(redirectUrl);
    }
  };

  // Small uppercase dot-label used instead of heavy colored badge pills —
  // a single recurring signature mark across every template.
  const Eyebrow = ({ children }) =>
    children ? (
      <span
        className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${tone.faint}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
        {children}
      </span>
    ) : null;

  // Soft ambient glow placed behind product photography instead of heavy
  // drop-shadows — gives depth without visual noise.
  const Glow = ({ className = "" }) => (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ background: `radial-gradient(circle, ${tone.glow}, transparent 70%)` }}
    />
  );

  // -----------------------------------------------------------------------
  // Decorative background layers
  // -----------------------------------------------------------------------
  // These recreate the "shape behind the product" look from moodboard
  // references (soft wave, pulse rings, diagonal stripes, glow circle)
  // without ever using a fixed image asset. Every fill/border color is
  // derived from the resolved gradient's tone (a translucent white wash on
  // dark backgrounds, a translucent black wash on light ones), so the
  // effect automatically matches whatever gradient the admin picks — and
  // because everything is inline SVG/CSS, none of it depends on Tailwind
  // generating a class for a color it never saw at build time.
  const veil = (alpha) => (tone.isDark ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha * 0.85})`);

  // Two layered organic curves flowing in from one edge — used behind the
  // Editorial layout, echoing the "liquid swoosh" backgrounds in the
  // reference set.
  const WaveField = ({ flip = false }) => (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${flip ? "-scale-x-100" : ""}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path d="M58,0 C40,18 78,32 60,50 C42,68 74,82 52,100 L100,100 L100,0 Z" fill={veil(0.06)} />
      <path d="M74,0 C58,20 90,34 74,52 C58,70 88,84 68,100 L100,100 L100,0 Z" fill={veil(0.09)} />
    </svg>
  );

  // Concentric pulse rings centered above/behind a product — echoes the
  // "sound wave" motif used behind speaker-style products.
  const RingPulse = () => (
    <div aria-hidden className="pointer-events-none relative h-full w-full">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{
            width: `${60 + i * 45}%`,
            height: `${60 + i * 45}%`,
            transform: "translate(-50%, -50%)",
            borderColor: veil(0.22 - i * 0.06),
          }}
        />
      ))}
    </div>
  );

  // Low-contrast diagonal stripes swept across the full banner — echoes the
  // energetic angled-stripe backgrounds in the reference set.
  const StripeField = () => (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `repeating-linear-gradient(115deg, ${veil(0.05)} 0px, ${veil(0.05)} 2px, transparent 2px, transparent 34px)`,
      }}
    />
  );

  // A crisp hairline circle sitting behind a product photo, like a spotlight
  // frame — echoes the circular product stage used in a few references.
  const CircleFrame = () => (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
      style={{ borderColor: veil(0.16), background: veil(0.045) }}
    />
  );

  const CtaSolid = ({ children }) => (
    <button
      onClick={handleRedirect}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] ${tone.ctaSolid}`}
    >
      {children}
    </button>
  );

  const CtaOutline = ({ children }) => (
    <button
      onClick={handleRedirect}
      className={`inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${tone.ctaOutline}`}
    >
      {children}
    </button>
  );

  const CtaLink = ({ children }) => (
    <button
      onClick={handleRedirect}
      className={`group inline-flex items-center gap-1.5 text-sm font-semibold ${tone.heading}`}
    >
      <span className="border-b border-current pb-0.5">{children}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );

  const Picture = ({ className }) => (
    <picture>
      {mobileImage && <source media="(max-width: 640px)" srcSet={mobileImage} />}
      <img src={desktopImage} alt={title} className={className} />
    </picture>
  );

  // ---------------------------------------------------------------------
  // Template 1 — "Editorial": asymmetric, generous whitespace, a vertical
  // hairline + dot marks the content column, CTA is a plain underlined link.
  // ---------------------------------------------------------------------
  const renderSplitHero = () => (
    <div className="relative flex w-full h-full flex-col justify-center items-center gap-6 overflow-hidden p-6 sm:p-10 md:flex-row md:gap-10 md:justify-between">
      <WaveField />
      <div className={`z-10 flex flex-col items-center gap-3 text-center md:w-[46%] md:items-start md:border-l md:pl-8 md:text-left ${tone.hairline}`}>
        <Eyebrow>{badge}</Eyebrow>
        <h1 className={`text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl ${tone.heading} line-clamp-2`}>
          {title}
        </h1>
        {subtitle && <p className={`max-w-sm text-xs sm:text-sm md:text-base line-clamp-2 ${tone.body}`}>{subtitle}</p>}
        <div className="pt-1">
          <CtaLink>{buttonText}</CtaLink>
        </div>
      </div>
      <div className="relative flex items-center justify-center md:w-[54%] h-[40%] md:h-full max-h-[140px] sm:max-h-[180px] md:max-h-full">
        <Glow className="h-40 w-40 sm:h-52 sm:w-52 md:h-72 md:w-72" />
        <Picture className="relative h-full max-h-[120px] sm:max-h-[160px] md:max-h-[300px] object-contain transition-transform duration-500 hover:scale-[1.03]" />
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  // Template 2 — "Spotlight": centered poster composition, product sits in
  // a soft glow, copy stacks underneath, single pill CTA.
  // ---------------------------------------------------------------------
  const renderFloatingProduct = () => (
    <div className="relative flex w-full h-full flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-10 overflow-hidden p-6 sm:p-10">
      {/* Image + decorative rings: upper portion on mobile, right side on desktop */}
      <div className="relative order-1 md:order-2 flex items-center justify-center h-[38%] sm:h-[42%] md:h-full md:w-[52%]">
        <div className="absolute h-32 w-32 sm:h-44 sm:w-44 md:h-64 md:w-64">
          <RingPulse />
        </div>
        <Glow className="h-40 w-40 sm:h-52 sm:w-52 md:h-72 md:w-72" />
        <div className={`relative h-28 w-28 sm:h-36 sm:w-36 md:h-52 md:w-52 overflow-hidden rounded-full border ${tone.hairline}`}>
          <Picture className="h-full w-full object-cover" />
        </div>
      </div>
      {/* Copy + CTA: lower portion on mobile, left side on desktop */}
      <div className="z-10 order-2 md:order-1 flex flex-col items-center gap-3 text-center md:w-[46%] md:items-start md:text-left">
        <Eyebrow>{badge}</Eyebrow>
        <h1 className={`max-w-xl text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight ${tone.heading} line-clamp-2`}>
          {title}
        </h1>
        {subtitle && <p className={`max-w-md text-xs sm:text-sm md:text-base line-clamp-2 ${tone.body}`}>{subtitle}</p>}
        <div className="pt-0.5">
          <CtaSolid>
            {buttonText} <ArrowRight className="h-4.5 w-4.5" />
          </CtaSolid>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  // Template 3 — "Statement": full-bleed typography, hairline rules act as
  // brackets around the headline instead of a busy background pattern.
  // ---------------------------------------------------------------------
  const renderFestival = () => (
    <div className="relative flex w-full h-full flex-col items-center justify-center gap-4 overflow-hidden p-6 sm:p-10 text-center">
      <StripeField />
      <Eyebrow>{badge}</Eyebrow>
      <div className={`w-10 border-t ${tone.hairline}`} />
      <h1 className={`max-w-2xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight ${tone.heading} line-clamp-2`}>
        {title}
      </h1>
      {subtitle && <p className={`max-w-lg text-xs sm:text-base md:text-lg line-clamp-2 ${tone.body}`}>{subtitle}</p>}
      <div className={`w-10 border-t ${tone.hairline}`} />
      <div className="pt-1">
        <CtaOutline>{buttonText}</CtaOutline>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  // Template 4 — "Frame": gallery-style matting around the product photo,
  // a vertical rotated eyebrow runs along the divider like a print label.
  // ---------------------------------------------------------------------
  const renderFashion = () => (
    <div className="flex w-full h-full flex-col md:flex-row items-stretch overflow-hidden">
      <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left p-6 sm:p-10 space-y-3 w-full md:w-[38%] h-[50%] md:h-full">
        {badge && (
          <span
            className={`hidden text-[11px] font-semibold uppercase tracking-[0.25em] md:block ${tone.faint}`}
            style={{ writingMode: "vertical-rl" }}
          >
            {badge}
          </span>
        )}
        <h1 className={`text-xl sm:text-2xl md:text-3xl font-light uppercase leading-tight tracking-wide ${tone.heading} line-clamp-2`}>
          {title}
        </h1>
        <div className={`h-px w-10 ${tone.isDark ? "bg-white/40" : "bg-gray-900/30"}`} />
        {subtitle && <p className={`text-xs sm:text-sm line-clamp-1 ${tone.body}`}>{subtitle}</p>}
        <CtaOutline>{buttonText}</CtaOutline>
      </div>
      <div className="relative w-full md:w-[62%] h-[50%] md:h-full p-4 md:p-6">
        <div className={`relative w-full h-full overflow-hidden rounded-sm border ${tone.hairline}`}>
          <Picture className="absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out hover:scale-105" />
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  // Template 5 — "Card": a quiet content card floats beside the product,
  // which sits inside its own soft glow — calm, product-forward layout.
  // ---------------------------------------------------------------------
  const renderGroceryFresh = () => (
    <div className="flex w-full h-full flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-10">
      <div className="relative flex items-center justify-center md:w-[52%] w-full h-[40%] md:h-full max-h-[120px] sm:max-h-[160px] md:max-h-full md: justify-center">
        <CircleFrame />
        <Glow className="h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64" />
        <Picture className="relative h-full max-h-[100px] sm:max-h-[140px] md:max-h-[280px] object-contain" />
      </div>
      <div
        className={`z-10 flex flex-col items-center gap-3 rounded-2xl border p-4 sm:p-6 text-center backdrop-blur-sm md:w-[48%] md:items-start md:text-left w-full h-[55%] md:h-auto md:max-h-full overflow-hidden ${tone.hairline} ${tone.surface}`}
      >
        <div className="hidden md:block">
          <Eyebrow>{badge || "Featured"}</Eyebrow>
        </div>
        <h1
          className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight ${tone.heading} line-clamp-1 md:line-clamp-2`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`max-w-sm text-xs sm:text-sm line-clamp-1 ${tone.body}`}
          >
            {subtitle}
          </p>
        )}
        <div className="pt-0.5">
          <CtaSolid>
            {buttonText} <ArrowRight className="h-4 w-4" />
          </CtaSolid>
        </div>
      </div>
    </div>
  );

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
    <div className="w-full h-[340px] sm:h-[400px] md:h-[450px] overflow-hidden relative" style={{ background: gradient }}>
      {renderTemplate()}
    </div>
  );
};

export default BannerRenderer;
