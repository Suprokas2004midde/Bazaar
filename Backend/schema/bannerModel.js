import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    buttonText: { type: String, default: "Shop Now", trim: true },
    redirectUrl: { type: String, required: true, trim: true },
    desktopTemplate: { type: String, default: "split-hero" },
    mobileTemplate: { type: String, default: "split-hero" },
    desktopImage: { type: String, required: true },
    mobileImage: { type: String },
    theme: { type: String, default: "from-[#0D1B2A] via-[#1B263B] to-[#415A77]" },
    badge: { type: String, trim: true },
    priority: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const bannerModel = mongoose.models.banners || mongoose.model("banners", bannerSchema);

export default bannerModel;
