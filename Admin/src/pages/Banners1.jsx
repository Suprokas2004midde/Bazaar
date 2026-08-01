import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CiCircleRemove } from "react-icons/ci";
import { MdOutlineEdit, MdOutlineImage } from "react-icons/md";
import { assets } from "../assets/assets.js";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const PRESET_THEMES = [
  { name: "Classic Navy", value: "from-[#0D1B2A] via-[#1B263B] to-[#415A77]" },
  { name: "Slate Blue", value: "from-[#1B263B] via-[#415A77] to-[#778DA9]" },
  { name: "Charcoal Slate", value: "from-[#1a202c] via-[#2d3748] to-[#4a5568]" },
  { name: "Fashion Sunset", value: "from-rose-950 via-pink-900 to-indigo-950" },
  { name: "Organic Forest", value: "from-emerald-950 via-teal-950 to-emerald-900" },
  { name: "Cyber Sunset", value: "from-purple-950 via-fuchsia-900 to-pink-950" },
];

const TEMPLATES = [
  { id: "split-hero", name: "Split Hero" },
  { id: "floating-product", name: "Floating Product" },
  { id: "festival", name: "Festival Special" },
  { id: "fashion", name: "Minimalist Fashion" },
  { id: "grocery-fresh", name: "Grocery Fresh" },
];

const Banners = ({ token }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list"); // "list" | "create"

  // Form states
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
  const [theme, setTheme] = useState(PRESET_THEMES[0].value);
  const [customTheme, setCustomTheme] = useState("");
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
    setTheme(banner.theme || PRESET_THEMES[0].value);
    
    // Check if theme matches preset
    const isPreset = PRESET_THEMES.some((t) => t.value === banner.theme);
    if (!isPreset && banner.theme) {
      setCustomTheme(banner.theme);
    } else {
      setCustomTheme("");
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
    setTheme(PRESET_THEMES[0].value);
    setCustomTheme("");
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
      formData.append("theme", customTheme ? customTheme : theme);
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

  // Helper for live preview styling
  const currentThemeClass = customTheme ? customTheme : theme;
  const desktopImagePreviewUrl = desktopImage
    ? URL.createObjectURL(desktopImage)
    : existingDesktopUrl;

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Marketing Banners</h2>
        <div className="flex gap-2">
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
                  <div className="flex items-center gap-4 w-full md:w-[70%]">
                    <img
                      src={banner.desktopImage}
                      alt={banner.title}
                      className="w-28 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
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
                      <h3 className="font-bold text-gray-800 text-base truncate">
                        {banner.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {banner.subtitle || "No subtitle"} • {banner.redirectUrl}
                      </p>
                      {(banner.startDate || banner.endDate) && (
                        <p className="text-[10px] text-gray-400 mt-1">
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
                Background Theme Gradients
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {PRESET_THEMES.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => {
                      setTheme(t.value);
                      setCustomTheme("");
                    }}
                    className={`h-10 rounded-lg bg-gradient-to-r ${
                      t.value
                    } border-2 flex items-center justify-center text-xs font-semibold text-white px-2 shadow-sm ${
                      theme === t.value && !customTheme
                        ? "border-orange-500 ring-2 ring-orange-400"
                        : "border-gray-200"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Custom CSS / Tailwind Classes</label>
                <input
                  type="text"
                  placeholder="e.g. from-indigo-900 via-purple-900 to-pink-900"
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className={`relative w-full aspect-[16/9] bg-gradient-to-r ${currentThemeClass} text-white flex flex-col justify-between p-4`}
              >
                {desktopTemplate === "split-hero" && (
                  <div className="flex h-full items-center justify-between gap-2">
                    <div className="flex-1 flex flex-col items-start gap-1 justify-center">
                      {badge && (
                        <span className="bg-orange-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          {badge}
                        </span>
                      )}
                      <h4 className="text-sm sm:text-base font-extrabold line-clamp-2 leading-tight">
                        {title || "Insert Banner Title"}
                      </h4>
                      <p className="text-[10px] text-white/80 line-clamp-1">
                        {subtitle || "Subtitle description goes here"}
                      </p>
                      <button className="mt-1 bg-white hover:bg-gray-100 text-gray-900 text-[9px] font-bold px-2.5 py-1 rounded shadow">
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
                )}

                {desktopTemplate === "floating-product" && (
                  <div className="relative flex h-full items-center justify-between gap-2">
                    <div className="flex-1 flex flex-col items-start gap-1.5 justify-center z-10 bg-black/20 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                      {badge && (
                        <span className="bg-emerald-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          {badge}
                        </span>
                      )}
                      <h4 className="text-sm font-extrabold line-clamp-2 leading-none">
                        {title || "Insert Banner Title"}
                      </h4>
                      <p className="text-[9px] text-white/95">
                        {subtitle || "Subtitle description"}
                      </p>
                      <button className="bg-white text-gray-900 text-[8px] font-bold px-2 py-0.5 rounded shadow">
                        {buttonText}
                      </button>
                    </div>
                    {desktopImagePreviewUrl && (
                      <div className="w-[50%] h-full flex items-center justify-center animate-bounce duration-[3000ms]">
                        <img
                          src={desktopImagePreviewUrl}
                          alt="preview"
                          className="max-h-[90%] max-w-full object-contain drop-shadow-2xl"
                        />
                      </div>
                    )}
                  </div>
                )}

                {desktopTemplate === "festival" && (
                  <div className="flex h-full flex-col items-center justify-center text-center gap-1.5">
                    {badge && (
                      <span className="bg-yellow-400 text-black text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                        {badge}
                      </span>
                    )}
                    <h4 className="text-base font-black tracking-tight leading-tight max-w-[90%]">
                      {title || "Insert Festival Title"}
                    </h4>
                    <p className="text-[10px] text-white/90 font-medium">
                      {subtitle || "Special offers details"}
                    </p>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-[9px] font-extrabold px-4 py-1 rounded-full shadow-lg">
                      {buttonText}
                    </button>
                  </div>
                )}

                {desktopTemplate === "fashion" && (
                  <div className="flex h-full items-stretch justify-between relative">
                    <div className="w-[45%] flex flex-col justify-center items-start gap-1">
                      {badge && <span className="text-[8px] text-white/70 tracking-widest font-light">{badge}</span>}
                      <h4 className="text-xs sm:text-sm font-light tracking-wide uppercase leading-tight">
                        {title || "FASHION BRAND"}
                      </h4>
                      <div className="h-[1px] w-8 bg-white/50 my-0.5"></div>
                      <p className="text-[9px] text-white/80 font-semibold">{subtitle}</p>
                      <button className="mt-1 border border-white text-white text-[8px] font-medium px-2 py-0.5 rounded hover:bg-white hover:text-black transition-all">
                        {buttonText}
                      </button>
                    </div>
                    {desktopImagePreviewUrl && (
                      <div className="w-[55%] h-full overflow-hidden relative">
                        <img
                          src={desktopImagePreviewUrl}
                          alt="fashion-preview"
                          className="w-full h-full object-cover rounded-l-md border-l border-white/20"
                        />
                      </div>
                    )}
                  </div>
                )}

                {desktopTemplate === "grocery-fresh" && (
                  <div className="flex h-full items-center justify-between gap-2">
                    <div className="flex-1 flex flex-col items-start gap-1 justify-center">
                      <span className="bg-emerald-500/80 border border-emerald-400 text-[8px] font-semibold px-2 py-0.5 rounded">
                        🌿 {badge || "Fresh & Organic"}
                      </span>
                      <h4 className="text-base font-black tracking-tight text-white leading-tight">
                        {title || "Fresh Grocery Title"}
                      </h4>
                      <p className="text-[9px] text-white/85">
                        {subtitle}
                      </p>
                      <button className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold px-3 py-1 rounded">
                        {buttonText}
                      </button>
                    </div>
                    {desktopImagePreviewUrl && (
                      <div className="w-1/2 h-full flex items-center justify-center">
                        <img
                          src={desktopImagePreviewUrl}
                          alt="preview"
                          className="max-h-full max-w-full object-contain drop-shadow"
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
