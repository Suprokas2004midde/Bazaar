import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CiCircleRemove } from "react-icons/ci";
import { MdOutlineEdit, MdOutlineImage } from "react-icons/md";
import { assets } from "../assets/assets.js";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Presets store plain hex colors (not Tailwind class strings). Tailwind's
// JIT compiler can only generate CSS for class names it sees in source files
// at build time, so any color coming from the database at runtime — like an
// admin-picked custom gradient — never gets compiled and silently renders as
// nothing. Storing hex values and building a real CSS gradient string
// sidesteps that entirely: it works no matter where the value comes from.
const PRESET_THEMES = [
  { name: "Garden Fresh", from: "#FFF8E1", via: "#EAF7D4", to: "#B7DE8F" },
  { name: "Mango Bloom", from: "#FFF3C4", via: "#FFD166", to: "#FF9A3D" },
  { name: "Coconut Sky", from: "#F5FBFF", via: "#DCEFFA", to: "#A9D9F5" },
  { name: "Delivery Pulse", from: "#0F2B4C", via: "#1E5FA8", to: "#4FA3E3" },
  { name: "Litchi Orchard", from: "#F3FBE4", via: "#C6E68C", to: "#8FBF5A" },
  { name: "Roasted Bean", from: "#3B2A20", via: "#6F4E37", to: "#A9765A" },
  { name: "Spice Market", from: "#4B1E0E", via: "#8C3B12", to: "#D9752D" },
];

const DIRECTIONS = [
  { label: "Left → Right", value: "90deg" },
  { label: "Top → Bottom", value: "180deg" },
  { label: "Diagonal ↘", value: "135deg" },
  { label: "Diagonal ↙", value: "225deg" },
];

// Builds a real CSS gradient string from color stops. This is what actually
// gets saved as `theme` and rendered — no Tailwind class names involved, so
// it always displays correctly regardless of build-time purging.
const buildGradientCss = ({ from, via, to, direction = "90deg" }) => {
  const stops = [from, via, to].filter(Boolean);
  return `linear-gradient(${direction}, ${stops.join(", ")})`;
};

// Decides whether the live preview should render light-on-dark or
// dark-on-light text. Only ever returns whole, literal Tailwind class
// strings (never a class built by concatenating a runtime value), since a
// class name assembled at runtime is exactly the bug this file just fixed.
const isGradientDark = (gradientCss) => {
  const hexes = [...gradientCss.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g)].map((m) => m[1]);
  if (!hexes.length) return true;
  const luminance = (hex) => {
    const h = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  const avg = hexes.reduce((sum, h) => sum + luminance(h), 0) / hexes.length;
  return avg < 0.55;
};
// strings like "from-[#0D1B2A] via-[#1B263B] to-[#415A77]"), so editing an
// old banner pre-fills sensible color pickers instead of breaking.
const parseLegacyTheme = (themeString) => {
  if (!themeString) return null;
  const hexMatches = [...themeString.matchAll(/#([0-9a-fA-F]{3,8})/g)].map((m) => `#${m[1]}`);
  if (hexMatches.length >= 2) {
    return {
      from: hexMatches[0],
      via: hexMatches[1] || hexMatches[0],
      to: hexMatches[2] || hexMatches[1] || hexMatches[0],
      direction: "90deg",
    };
  }
  return null;
};

const TEMPLATES = [
  { id: "split-hero", name: "Editorial" },
  { id: "floating-product", name: "Spotlight" },
  { id: "festival", name: "Statement" },
  { id: "fashion", name: "Frame" },
  { id: "grocery-fresh", name: "Card" },
];

const Banners = ({ token }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list"); // "list" | "create"

  // Form stateses
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("");
  const [buttonText, setButtonText] = useState("Shop Now");
  const [redirectUrl, setRedirectUrl] = useState("/");
  const [desktopTemplate, setDesktopTemplate] = useState("split-hero");
  const [mobileTemplate, setMobileTemplate] = useState("split-hero");
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [gradient, setGradient] = useState({
    from: PRESET_THEMES[0].from,
    via: PRESET_THEMES[0].via,
    to: PRESET_THEMES[0].to,
    direction: "90deg",
  });
  const [activePreset, setActivePreset] = useState(PRESET_THEMES[0].name);
  const [priority, setPriority] = useState(0);
  const [active, setActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Existing image URLs (used when editing)
  const [existingDesktopUrl, setExistingDesktopUrl] = useState("");
  const [existingMobileUrl, setExistingMobileUrl] = useState("");

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/banner/admin`, {
        headers: { token },
      });
      if (response.data.success) {
        setBanners(response.data.banners);
      } else {
        toast.error(response.data.message || "Failed to load banners");
      }
    } catch (error) {
      console.error("Fetch banners failed:", error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEditClick = (banner) => {
    setEditId(banner._id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || "");
    setBadge(banner.badge || "");
    setButtonText(banner.buttonText || "Shop Now");
    setRedirectUrl(banner.redirectUrl);
    setDesktopTemplate(banner.desktopTemplate || "split-hero");
    setMobileTemplate(banner.mobileTemplate || "split-hero");
    // Resolve the saved theme (new CSS-gradient format or legacy Tailwind
    // class string) into the structured color-picker state.
    const matchedPreset = PRESET_THEMES.find(
      (t) => banner.theme === buildGradientCss({ ...t, direction: "90deg" })
    );
    if (matchedPreset) {
      setGradient({ from: matchedPreset.from, via: matchedPreset.via, to: matchedPreset.to, direction: "90deg" });
      setActivePreset(matchedPreset.name);
    } else {
      const parsed = parseLegacyTheme(banner.theme);
      setGradient(
        parsed || { from: PRESET_THEMES[0].from, via: PRESET_THEMES[0].via, to: PRESET_THEMES[0].to, direction: "90deg" }
      );
      setActivePreset(null);
    }
    
    setPriority(banner.priority || 0);
    setActive(banner.active !== false);
    setStartDate(banner.startDate ? banner.startDate.substring(0, 16) : "");
    setEndDate(banner.endDate ? banner.endDate.substring(0, 16) : "");
    
    setExistingDesktopUrl(banner.desktopImage || "");
    setExistingMobileUrl(banner.mobileImage || "");
    setDesktopImage(null);
    setMobileImage(null);
    
    setActiveTab("create");
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const response = await axios.delete(`${backendUrl}/api/banner/${id}`, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success("Banner deleted successfully!");
        fetchBanners();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete banner");
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/banner/update/${banner._id}`,
        { active: !banner.active },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(`Banner is now ${!banner.active ? "Active" : "Inactive"}`);
        fetchBanners();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleResetForm = () => {
    setEditId(null);
    setTitle("");
    setSubtitle("");
    setBadge("");
    setButtonText("Shop Now");
    setRedirectUrl("/");
    setDesktopTemplate("split-hero");
    setMobileTemplate("split-hero");
    setDesktopImage(null);
    setMobileImage(null);
    setGradient({
      from: PRESET_THEMES[0].from,
      via: PRESET_THEMES[0].via,
      to: PRESET_THEMES[0].to,
      direction: "90deg",
    });
    setActivePreset(PRESET_THEMES[0].name);
    setPriority(0);
    setActive(true);
    setStartDate("");
    setEndDate("");
    setExistingDesktopUrl("");
    setExistingMobileUrl("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!title || !redirectUrl) {
      toast.error("Title and Redirect URL are required.");
      return;
    }
    if (!editId && !desktopImage) {
      toast.error("Desktop banner image is required for new banners.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("badge", badge);
      formData.append("buttonText", buttonText);
      formData.append("redirectUrl", redirectUrl);
      formData.append("desktopTemplate", desktopTemplate);
      formData.append("mobileTemplate", mobileTemplate);
      formData.append("theme", buildGradientCss(gradient));
      formData.append("priority", priority);
      formData.append("active", active);
      if (startDate) formData.append("startDate", startDate);
      if (endDate) formData.append("endDate", endDate);

      if (desktopImage) formData.append("desktopImage", desktopImage);
      if (mobileImage) formData.append("mobileImage", mobileImage);

      let response;
      if (editId) {
        response = await axios.put(
          `${backendUrl}/api/banner/update/${editId}`,
          formData,
          { headers: { token } }
        );
      } else {
        response = await axios.post(
          `${backendUrl}/api/banner/create`,
          formData,
          { headers: { token } }
        );
      }

      if (response.data.success) {
        toast.success(
          editId
            ? "Banner updated successfully!"
            : "Banner created successfully!"
        );
        handleResetForm();
        setActiveTab("list");
        fetchBanners();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Helper for live preview styling — a real CSS gradient, applied via
  // inline `style`, so the preview always matches what actually renders.
  const currentGradientCss = buildGradientCss(gradient);
  const previewIsDark = isGradientDark(currentGradientCss);
  const previewTone = previewIsDark
    ? {
        heading: "text-white",
        body70: "text-white/70",
        body80: "text-white/80",
        body85: "text-white/85",
        body90: "text-white/90",
        body95: "text-white/95",
        outlineBtn: "border-white text-white hover:bg-white hover:text-black",
      }
    : {
        heading: "text-gray-900",
        body70: "text-gray-900/70",
        body80: "text-gray-900/80",
        body85: "text-gray-900/85",
        body90: "text-gray-900/90",
        body95: "text-gray-900/95",
        outlineBtn: "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
      };

  // Same "veil" trick used in BannerRenderer: a translucent white wash on
  // dark gradients, translucent black on light ones, so the decorative
  // shapes always match whatever gradient is selected.
  const previewVeil = (alpha) =>
    previewIsDark ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha * 0.85})`;

  const PreviewWave = () => (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d="M58,0 C40,18 78,32 60,50 C42,68 74,82 52,100 L100,100 L100,0 Z" fill={previewVeil(0.06)} />
      <path d="M74,0 C58,20 90,34 74,52 C58,70 88,84 68,100 L100,100 L100,0 Z" fill={previewVeil(0.09)} />
    </svg>
  );

  const PreviewRings = () => (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-16 w-16">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full border"
            style={{
              width: `${60 + i * 45}%`,
              height: `${60 + i * 45}%`,
              transform: "translate(-50%, -50%)",
              borderColor: previewVeil(0.22 - i * 0.06),
            }}
          />
        ))}
      </div>
    </div>
  );

  const PreviewStripes = () => (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `repeating-linear-gradient(115deg, ${previewVeil(0.05)} 0px, ${previewVeil(0.05)} 2px, transparent 2px, transparent 16px)`,
      }}
    />
  );

  const PreviewCircleFrame = () => (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border"
      style={{ borderColor: previewVeil(0.16), background: previewVeil(0.045) }}
    />
  );

  const desktopImagePreviewUrl = desktopImage
    ? URL.createObjectURL(desktopImage) //temporary url...
    : existingDesktopUrl;

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Marketing Banners</h2>
        <div className="flex mt-4 md:mt-0 gap-2">
          <button
            onClick={() => {
              setActiveTab("list");
              handleResetForm();
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === "list"
                ? "bg-orange-500 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Banners
          </button>
          <button
            onClick={() => {
              handleResetForm();
              setActiveTab("create");
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === "create" && !editId
                ? "bg-orange-500 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Create Banner
          </button>
        </div>
      </div>

      {activeTab === "list" ? (
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-center text-gray-600 mt-10">Loading banners...</p>
          ) : banners.length === 0 ? (
            <p className="text-center text-gray-600 mt-10">No banners created yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow transition-shadow"
                >
                  <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-[70%]">
                    <img
                      src={banner.desktopImage}
                      alt={banner.title}
                      className="w-28 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex flex-col items-center md:items-start flex-1 min-w-0 w-full text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            banner.active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {banner.active ? "Active" : "Inactive"}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          Prio: {banner.priority}
                        </span>
                        <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                          {banner.desktopTemplate}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-base truncate w-full">
                        {banner.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate w-full">
                        {banner.subtitle || "No subtitle"} • {banner.redirectUrl}
                      </p>
                      {(banner.startDate || banner.endDate) && (
                        <p className="text-[10px] text-gray-400 mt-1 w-full">
                          Schedule:{" "}
                          {banner.startDate
                            ? new Date(banner.startDate).toLocaleDateString()
                            : "Start Now"}{" "}
                          -{" "}
                          {banner.endDate
                            ? new Date(banner.endDate).toLocaleDateString()
                            : "Always"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-colors ${
                        banner.active
                          ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {banner.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleEditClick(banner)}
                      className="p-2 border border-gray-200 text-gray-600 hover:text-orange-500 hover:border-orange-500 rounded-md transition-colors"
                      title="Edit Banner"
                    >
                      <MdOutlineEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(banner._id)}
                      className="p-2 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-600 rounded-md transition-colors"
                      title="Delete Banner"
                    >
                      <CiCircleRemove className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Create/Edit Form */}
          <form
            onSubmit={onSubmitHandler}
            className="flex-1 flex flex-col gap-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-800">
              {editId ? "Edit Campaign Banner" : "New Campaign Banner"}
            </h3>

            {/* Images Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Desktop Image <span className="text-red-600">(Req)*</span>
                </span>
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-orange-500 transition-colors bg-gray-50">
                  {desktopImage ? (
                    <img
                      src={URL.createObjectURL(desktopImage)}
                      alt="Desktop Preview"
                      className="w-full h-24 object-contain rounded"
                    />
                  ) : existingDesktopUrl ? (
                    <img
                      src={existingDesktopUrl}
                      alt="Existing Desktop"
                      className="w-full h-24 object-contain rounded"
                    />
                  ) : (
                    <>
                      <MdOutlineImage className="w-8 h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload 1920x600 px image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setDesktopImage(e.target.files[0])}
                  />
                </label>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mobile Image (Opt)
                </span>
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-orange-500 transition-colors bg-gray-50">
                  {mobileImage ? (
                    <img
                      src={URL.createObjectURL(mobileImage)}
                      alt="Mobile Preview"
                      className="w-full h-24 object-contain rounded"
                    />
                  ) : existingMobileUrl ? (
                    <img
                      src={existingMobileUrl}
                      alt="Existing Mobile"
                      className="w-full h-24 object-contain rounded"
                    />
                  ) : (
                    <>
                      <MdOutlineImage className="w-8 h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload 640x640 px image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setMobileImage(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            {/* Campaign details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Banner Title</label>
                <input
                  type="text"
                  placeholder="e.g. iPhone 16 Pro Max"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Subtitle / Offer Description</label>
                <input
                  type="text"
                  placeholder="e.g. Starting from ₹50,769*"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Flagship"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Button Text</label>
                <input
                  type="text"
                  placeholder="e.g. Shop Now"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Redirect URL</label>
                <input
                  type="text"
                  placeholder="e.g. /product/668fe..."
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Templates Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Desktop Template Layout</label>
                <select
                  value={desktopTemplate}
                  onChange={(e) => setDesktopTemplate(e.target.value)}
                  className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Mobile Template Layout</label>
                <select
                  value={mobileTemplate}
                  onChange={(e) => setMobileTemplate(e.target.value)}
                  className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Theme / Gradients */}
            <div>
              <span className="block text-sm font-semibold text-gray-700 mb-1.5">
                Background Theme Gradient
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {PRESET_THEMES.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => {
                      setGradient({ from: t.from, via: t.via, to: t.to, direction: gradient.direction });
                      setActivePreset(t.name);
                    }}
                    style={{ background: buildGradientCss({ ...t, direction: "90deg" }) }}
                    className={`h-10 rounded-lg border-2 flex items-center justify-center text-xs font-semibold text-white px-2 shadow-sm transition-all ${
                      activePreset === t.name
                        ? "border-orange-500 ring-2 ring-orange-400"
                        : "border-gray-200"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              {/* Custom color pickers — these drive a real CSS gradient
                  (linear-gradient(...)) applied via inline style, not a
                  Tailwind class, so any color the admin picks always renders. */}
              <div className="rounded-xl border border-gray-200 p-3 flex flex-col gap-3 bg-gray-50">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  Custom Colors
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "from", label: "Start" },
                    { key: "via", label: "Middle" },
                    { key: "to", label: "End" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex flex-col gap-1">
                      <span className="text-[11px] text-gray-500 font-medium">{label}</span>
                      <div className="flex items-center gap-1.5 border border-gray-300 rounded-lg px-2 py-1 bg-white">
                        <input
                          type="color"
                          value={gradient[key]}
                          onChange={(e) => {
                            setGradient((g) => ({ ...g, [key]: e.target.value }));
                            setActivePreset(null);
                          }}
                          className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={gradient[key]}
                          onChange={(e) => {
                            setGradient((g) => ({ ...g, [key]: e.target.value }));
                            setActivePreset(null);
                          }}
                          className="w-full text-xs font-mono text-gray-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-gray-500 font-medium">Direction</span>
                  <select
                    value={gradient.direction}
                    onChange={(e) => setGradient((g) => ({ ...g, direction: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {DIRECTIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="h-10 rounded-lg border border-gray-200"
                  style={{ background: currentGradientCss }}
                />
              </div>
            </div>

            {/* Scheduler & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Start Date & Time (Opt)</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">End Date & Time (Opt)</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Display Priority</label>
                <input
                  type="number"
                  placeholder="0"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
              <label htmlFor="active" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Publish Active Immediately
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg shadow disabled:opacity-60"
              >
                {loading ? "Saving..." : editId ? "UPDATE BANNER" : "CREATE BANNER"}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleResetForm();
                  setActiveTab("list");
                }}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg"
              >
                CANCEL
              </button>
            </div>
          </form>

          {/* Real-time HTML Preview (Rich aesthetics matching frontend) */}
          <div className="w-full lg:w-[400px] flex flex-col gap-3">
            <h3 className="text-lg font-bold text-gray-800">Banner Live Preview</h3>
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-md">
              <div className="bg-gray-100 py-1.5 px-3 border-b border-gray-200 text-[10px] text-gray-500 font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                <span className="ml-2 font-mono">Desktop Rendering Preview</span>
              </div>

              {/* Template Previews based on layout */}
              <div
                className={`relative w-full aspect-[16/9] overflow-hidden flex flex-col justify-between p-4 ${previewTone.heading}`}
                style={{ background: currentGradientCss }}
              >
                {desktopTemplate === "split-hero" && (
                  <>
                    <PreviewWave />
                    <div className="relative flex h-full items-center justify-between gap-2">
                      <div className="flex-1 flex flex-col items-start gap-1 justify-center">
                        {badge && (
                          <span className="bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            {badge}
                          </span>
                        )}
                        <h4 className="text-sm sm:text-base font-extrabold line-clamp-2 leading-tight">
                          {title || "Insert Banner Title"}
                        </h4>
                        <p className={`text-[10px] line-clamp-1 ${previewTone.body80}`}>
                          {subtitle || "Subtitle description goes here"}
                        </p>
                        <button className="mt-1 bg-white hover:bg-gray-100 text-gray-900 text-[9px] font-bold px-2.5 py-1 rounded shadow border border-gray-200">
                          {buttonText}
                        </button>
                      </div>
                      {desktopImagePreviewUrl && (
                        <div className="w-1/2 h-full flex items-center justify-center">
                          <img
                            src={desktopImagePreviewUrl}
                            alt="preview"
                            className="max-h-full max-w-full object-contain drop-shadow-xl"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {desktopTemplate === "floating-product" && (
                  <div className="relative flex h-full items-center justify-between gap-2">
                    <div
                      className={`flex-1 flex flex-col items-start gap-1.5 justify-center z-10 p-2 rounded-lg border backdrop-blur-sm ${
                        previewIsDark ? "bg-black/20 border-white/10" : "bg-white/40 border-gray-900/10"
                      }`}
                    >
                      {badge && (
                        <span className="bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          {badge}
                        </span>
                      )}
                      <h4 className="text-sm font-extrabold line-clamp-2 leading-none">
                        {title || "Insert Banner Title"}
                      </h4>
                      <p className={`text-[9px] ${previewTone.body95}`}>
                        {subtitle || "Subtitle description"}
                      </p>
                      <button className="bg-white text-gray-900 text-[8px] font-bold px-2 py-0.5 rounded shadow border border-gray-200">
                        {buttonText}
                      </button>
                    </div>
                    {desktopImagePreviewUrl && (
                      <div className="relative w-[50%] h-full flex items-center justify-center">
                        <PreviewRings />
                        <img
                          src={desktopImagePreviewUrl}
                          alt="preview"
                          className="relative max-h-[90%] max-w-full object-contain drop-shadow-2xl"
                        />
                      </div>
                    )}
                  </div>
                )}

                {desktopTemplate === "festival" && (
                  <>
                    <PreviewStripes />
                    <div className="relative flex h-full flex-col items-center justify-center text-center gap-1.5">
                      {badge && (
                        <span className="bg-yellow-400 text-black text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                          {badge}
                        </span>
                      )}
                      <h4 className="text-base font-black tracking-tight leading-tight max-w-[90%]">
                        {title || "Insert Statement Title"}
                      </h4>
                      <p className={`text-[10px] font-medium ${previewTone.body90}`}>
                        {subtitle || "Special offers details"}
                      </p>
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-[9px] font-extrabold px-4 py-1 rounded-full shadow-lg">
                        {buttonText}
                      </button>
                    </div>
                  </>
                )}

                {desktopTemplate === "fashion" && (
                  <div className="flex h-full items-stretch justify-between relative">
                    <div className="w-[45%] flex flex-col justify-center items-start gap-1">
                      {badge && <span className={`text-[8px] tracking-widest font-light ${previewTone.body70}`}>{badge}</span>}
                      <h4 className="text-xs sm:text-sm font-light tracking-wide uppercase leading-tight">
                        {title || "BRAND TITLE"}
                      </h4>
                      <div className={`h-[1px] w-8 my-0.5 ${previewIsDark ? "bg-white/50" : "bg-gray-900/40"}`}></div>
                      <p className={`text-[9px] font-semibold ${previewTone.body80}`}>{subtitle}</p>
                      <button className={`mt-1 border text-[8px] font-medium px-2 py-0.5 rounded transition-all ${previewTone.outlineBtn}`}>
                        {buttonText}
                      </button>
                    </div>
                    {desktopImagePreviewUrl && (
                      <div className="w-[55%] h-full overflow-hidden relative">
                        <img
                          src={desktopImagePreviewUrl}
                          alt="fashion-preview"
                          className={`w-full h-full object-cover rounded-l-md border-l ${previewIsDark ? "border-white/20" : "border-gray-900/10"}`}
                        />
                      </div>
                    )}
                  </div>
                )}

                {desktopTemplate === "grocery-fresh" && (
                  <div className="flex h-full items-center justify-between gap-2">
                    <div className="flex-1 flex flex-col items-start gap-1 justify-center">
                      <span className="bg-emerald-500/80 border border-emerald-400 text-white text-[8px] font-semibold px-2 py-0.5 rounded">
                        🌿 {badge || "Fresh & Organic"}
                      </span>
                      <h4 className="text-base font-black tracking-tight leading-tight">
                        {title || "Card Title"}
                      </h4>
                      <p className={`text-[9px] ${previewTone.body85}`}>
                        {subtitle}
                      </p>
                      <button className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold px-3 py-1 rounded">
                        {buttonText}
                      </button>
                    </div>
                    {desktopImagePreviewUrl && (
                      <div className="relative w-1/2 h-full flex items-center justify-center">
                        <PreviewCircleFrame />
                        <img
                          src={desktopImagePreviewUrl}
                          alt="preview"
                          className="relative max-h-full max-w-full object-contain drop-shadow"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
