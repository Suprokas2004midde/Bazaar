import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  Languages,
  MessageSquare,
  Edit3,
  Camera,
  LogOut,
  Package,
  MapPin,
  Heart,
  ChevronRight,
  X,
  Check,
  Sparkles,
  Lock,
  LogIn
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Orders from "./Orders";
import Addresses from "./Address";
import Wishlist from "./Wishlist";

const Profile = () => {
  const { userData, updateUserProfile, token, setToken, setCartItems, navigate } = useContext(ShopContext);

  // Active section tab: 'personal-info', 'orders', 'address', 'wishlist'
  const [activeTab, setActiveTab] = useState("personal-info");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditField, setActiveEditField] = useState(null); // 'all' or specific field key

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    country: "",
    language: "English ( UK ) - English",
    gender: "",
    avatar: "",
  });

  // Sync state with userData from context
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "+91 9876543210",
        dob: userData.dob || "01 January 2000",
        country: userData.country || "Delhi, India",
        language: userData.language || "English ( UK ) - English",
        gender: userData.gender || "Not Specified",
        avatar: userData.avatar || "",
      });
    }
  }, [userData]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setCartItems({});
    navigate("/login");
  };

  const handleOpenEdit = (fieldKey = "all") => {
    setActiveEditField(fieldKey);
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const success = await updateUserProfile(formData);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  // Preset Avatar Options for quick selection
  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
  ];

  if (!token) {
    return (
      <div className="py-16 max-w-md mx-auto">
        <Card className="border-[var(--border-color)] text-center p-8 space-y-4">
          <Lock className="w-12 h-12 text-[var(--primary-accent)] mx-auto opacity-70" />
          <h2 className="text-2xl font-bold text-[var(--text-main)]">Access Restricted</h2>
          <p className="text-xs text-[var(--text-muted)]">
            Please log in to view and edit your profile, order history, addresses, and saved items.
          </p>
          <Button onClick={() => navigate("/login")} className="w-full gap-2 mt-2">
            <LogIn className="w-4 h-4" /> Sign In
          </Button>
        </Card>
      </div>
    );
  }

  const userName = userData?.name || formData.name || "User Account";
  const userEmail = userData?.email || "user@example.com";
  const userPhone = userData?.phone || formData.phone || "+88001712346789";
  const avatarUrl = formData.avatar || userData?.avatar || "";

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex justify-between items-center pb-6 border-b border-[var(--border-color)]/40 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
          Nespola Account
        </h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="rounded-full px-5 py-2 text-xs font-semibold text-rose-600 bg-rose-200/30 border-rose-200 hover:bg-rose-500/30 dark:hover:transition-colors"
        >
          Sign out
        </Button>
      </div>

      {/* ==========================================
          MOBILE SCREEN UI (Matches Mobile Design Ref)
         ========================================== */}
      <div className="block lg:hidden space-y-6">
        {/* Top Dark/Accent Profile Banner */}
        <div className="relative rounded-3xl bg-emerald-900 dark:bg-emerald-950 text-white p-6 text-center shadow-lg overflow-hidden">
          {/* Subtle Background Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-between items-center">
            <div className="w-32 h-32 rounded-full bg-white -ml-10 -mt-10" />
            <div className="w-40 h-40 rounded-full bg-white -mr-12 -mb-12" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-white">Profile</span>
              <button
                onClick={() => handleOpenEdit("all")}
                className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Centered Profile Avatar */}
            <div className="relative my-3 group">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500/60 overflow-hidden bg-slate-200 flex items-center justify-center shadow-md">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-500" />
                )}
              </div>
              <button
                onClick={() => handleOpenEdit("avatar")}
                className="absolute bottom-0 right-0 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-md transition transform hover:scale-105 cursor-pointer"
                title="Change Avatar"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-wide">
              {userName}
            </h2>
            <p className="text-xs text-emerald-200 font-medium mt-0.5">
              {userPhone}
            </p>
            <p className="text-[11px] text-emerald-300/80">{userEmail}</p>
          </div>
        </div>

        {/* Mobile Navigation List / Content Cards Container */}
        <div className="bg-[var(--bg-card)] rounded-3xl p-5 border border-[var(--border-color)] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-main)] tracking-wide px-1">
            Account Overview
          </h3>

          <div className="space-y-2">
            {/* My Profile Item */}
            <div
              onClick={() => setActiveTab("personal-info")}
              className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                activeTab === "personal-info"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60"
                  : "bg-[var(--bg-subtle)]/60 hover:bg-[var(--bg-subtle)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-main)]">
                    My Profile
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Personal details & contact
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
            </div>

            {/* My Orders Item */}
            <div
              onClick={() => setActiveTab("orders")}
              className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                activeTab === "orders"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60"
                  : "bg-[var(--bg-subtle)]/60 hover:bg-[var(--bg-subtle)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-main)]">
                    My Orders
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Track & view order history
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
            </div>

            {/* Saved Addresses Item */}
            <div
              onClick={() => setActiveTab("address")}
              className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                activeTab === "address"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60"
                  : "bg-[var(--bg-subtle)]/60 hover:bg-[var(--bg-subtle)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-main)]">
                    Saved Addresses
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Manage delivery locations
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
            </div>

            {/* Wishlist Item */}
            <div
              onClick={() => setActiveTab("wishlist")}
              className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                activeTab === "wishlist"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60"
                  : "bg-[var(--bg-subtle)]/60 hover:bg-[var(--bg-subtle)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-main)]">
                    Wishlist
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Your saved items
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
          </div>
        </div>

        {/* Dynamic Mobile View Tab Content */}
        <div className="mt-6">
          {activeTab === "personal-info" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[var(--text-main)]">
                  Personal Details
                </h3>
                <Button
                  size="sm"
                  onClick={() => handleOpenEdit("all")}
                  className="text-xs gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Card className="border-[var(--border-color)]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)]">
                        Full Name
                      </p>
                      <p className="text-sm font-bold text-[var(--text-main)]">
                        {formData.name || "N/A"}
                      </p>
                    </div>
                    <User className="w-5 h-5 text-orange-500" />
                  </CardContent>
                </Card>

                <Card className="border-[var(--border-color)]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)]">
                        Date of Birth
                      </p>
                      <p className="text-sm font-bold text-[var(--text-main)]">
                        {formData.dob || "N/A"}
                      </p>
                    </div>
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </CardContent>
                </Card>

                <Card className="border-[var(--border-color)]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)]">
                        Country / Region
                      </p>
                      <p className="text-sm font-bold text-[var(--text-main)]">
                        {formData.country || "N/A"}
                      </p>
                    </div>
                    <Globe className="w-5 h-5 text-orange-500" />
                  </CardContent>
                </Card>

                <Card className="border-[var(--border-color)]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)]">
                        Language
                      </p>
                      <p className="text-sm font-bold text-[var(--text-main)]">
                        {formData.language}
                      </p>
                    </div>
                    <Languages className="w-5 h-5 text-orange-500" />
                  </CardContent>
                </Card>

                <Card className="border-[var(--border-color)]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)]">
                        Contact Information
                      </p>
                      <p className="text-sm font-bold text-[var(--text-main)]">
                        {userEmail}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {userPhone}
                      </p>
                    </div>
                    <MessageSquare className="w-5 h-5 text-orange-500" />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "orders" && <Orders />}
          {activeTab === "address" && <Addresses />}
          {activeTab === "wishlist" && <Wishlist />}
        </div>
      </div>

      {/* ==========================================
          DESKTOP SCREEN UI (Matches Desktop Reference Design)
         ========================================== */}
      <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR SECTION */}
        <div className="col-span-4 space-y-6">
          <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-sm space-y-6">
            {/* Profile Avatar Container */}
            <div className="relative w-28 h-28 mx-auto group">
              <div className="w-28 h-28 rounded-full border-4 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 flex items-center justify-center shadow-md">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-14 h-14 text-slate-400" />
                )}
              </div>
              <button
                onClick={() => handleOpenEdit("avatar")}
                className="absolute bottom-0 right-0 p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition transform hover:scale-110 cursor-pointer"
                title="Update Profile Picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Name & Email Info */}
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">
                {userName}
              </h2>
              <p className="text-sm text-[var(--text-muted)] truncate">
                {userEmail}
              </p>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1 pt-2 border-t border-[var(--border-color)]/50">
              <button
                onClick={() => setActiveTab("personal-info")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "personal-info"
                    ? "bg-orange-500/10 text-black dark:text-orange-400 border border-orange-500/20"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Personal information</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Order History</span>
              </button>

              <button
                onClick={() => setActiveTab("address")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "address"
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Address</span>
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "wishlist"
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-500 bg-rose-200/30 hover:bg-rose-500/30 transition-all cursor-pointer mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT SECTION */}
        <div className="col-span-8 space-y-6">
          {activeTab === "personal-info" && (
            <div className="space-y-6">
              {/* Header Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
                  Personal information
                </h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
                  Manage your personal information, including phone numbers and
                  email address where you can be contacted
                </p>
              </div>

              {/* 2-Column Grid of Details Cards (Matching Image Reference 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Card 1: Name */}
                <div
                  onClick={() => handleOpenEdit("name")}
                  className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-orange-500/50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--text-muted)]">
                      Name
                    </p>
                    <p className="text-xl font-bold text-[var(--text-main)]">
                      {formData.name || "Set Name"}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-500 dark:bg-orange-950/20 text-orange-500 group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                </div>

                {/* Card 2: Date of Birth */}
                <div
                  onClick={() => handleOpenEdit("dob")}
                  className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-orange-500/50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--text-muted)]">
                      Date of Birth
                    </p>
                    <p className="text-xl font-bold text-[var(--text-main)]">
                      {formData.dob || "Set DOB"}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>

                {/* Card 3: Country Region */}
                <div
                  onClick={() => handleOpenEdit("country")}
                  className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-orange-500/50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--text-muted)]">
                      Country Region
                    </p>
                    <p className="text-xl font-bold text-[var(--text-main)]">
                      {formData.country || "Set Country"}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>

                {/* Card 4: Language */}
                <div
                  onClick={() => handleOpenEdit("language")}
                  className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-orange-500/50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--text-muted)]">
                      Language
                    </p>
                    <p className="text-xl font-bold text-[var(--text-main)]">
                      {formData.language}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 group-hover:scale-110 transition-transform">
                    <Languages className="w-5 h-5" />
                  </div>
                </div>

                {/* Card 5: Contactable at */}
                <div
                  onClick={() => handleOpenEdit("phone")}
                  className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-orange-500/50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group sm:col-span-1"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--text-muted)]">
                      Contactable at
                    </p>
                    <p className="text-xl font-bold text-[var(--text-main)] truncate">
                      {userEmail}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {formData.phone}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>

                {/* Card 6: Gender */}
                <div
                  onClick={() => handleOpenEdit("gender")}
                  className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-orange-500/50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group sm:col-span-1"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--text-muted)]">
                      Gender
                    </p>
                    <p className="text-xl font-bold text-[var(--text-main)]">
                      {formData.gender || "Not Specified"}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && <Orders />}
          {activeTab === "address" && <Addresses />}
          {activeTab === "wishlist" && <Wishlist />}
        </div>
      </div>

      {/* ==========================================
          EDIT PROFILE MODAL / DIALOG
         ========================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--secondary-accent)]/20 text-[var(--text-muted)] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--text-main)]">
                Edit Profile Information
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Update your personal details below to keep your account up to
                date.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Avatar Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-main)] block">
                  Profile Picture URL
                </label>
                <Input
                  type="text"
                  name="avatar"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={handleFormChange}
                />

                <div className="pt-1">
                  <p className="text-[11px] text-[var(--text-muted)] mb-2">
                    Or choose a preset avatar:
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {avatarPresets.map((preset, idx) => (
                      <img
                        key={idx}
                        src={preset}
                        alt={`preset-${idx}`}
                        onClick={() =>
                          setFormData({ ...formData, avatar: preset })
                        }
                        className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition ${
                          formData.avatar === preset
                            ? "border-orange-500 scale-110"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-main)] block">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Your Full Name"
                  required
                />
              </div>

              {/* Phone & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-main)] block">
                    Phone Number
                  </label>
                  <Input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+88001712346789"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-main)] block">
                    Date of Birth
                  </label>
                  <Input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleFormChange}
                    placeholder="07 July 1993"
                  />
                </div>
              </div>

              {/* Country & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-main)] block">
                    Country / Region
                  </label>
                  <Input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleFormChange}
                    placeholder="Georgia, Tbilisi"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-main)] block">
                    Language
                  </label>
                  <Input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleFormChange}
                    placeholder="English ( UK ) - English"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-main)] block">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Not Specified">Not Specified</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]/40">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
