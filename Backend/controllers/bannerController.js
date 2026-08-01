import bannerModel from "../schema/bannerModel.js";

// Create Banner
export const createBanner = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      buttonText,
      redirectUrl,
      desktopTemplate,
      mobileTemplate,
      theme,
      badge,
      priority,
      active,
      startDate,
      endDate,
    } = req.body;

    const desktopImageFile = req.files?.["desktopImage"]?.[0];
    const mobileImageFile = req.files?.["mobileImage"]?.[0];

    if (!desktopImageFile) {
      return res.status(400).json({
        success: false,
        message: "Desktop image is required",
      });
    }

    const banner = new bannerModel({
      title,
      subtitle,
      buttonText: buttonText || "Shop Now",
      redirectUrl,
      desktopTemplate: desktopTemplate || "split-hero",
      mobileTemplate: mobileTemplate || "split-hero",
      desktopImage: desktopImageFile.path,
      mobileImage: mobileImageFile ? mobileImageFile.path : undefined,
      theme: theme || "from-[#0D1B2A] via-[#1B263B] to-[#415A77]",
      badge,
      priority: priority ? Number(priority) : 0,
      active: active === "true" || active === true,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    await banner.save();

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    console.error("Create banner error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create banner",
    });
  }
};

// Update Banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      buttonText,
      redirectUrl,
      desktopTemplate,
      mobileTemplate,
      theme,
      badge,
      priority,
      active,
      startDate,
      endDate,
    } = req.body;

    const banner = await bannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const desktopImageFile = req.files?.["desktopImage"]?.[0];
    const mobileImageFile = req.files?.["mobileImage"]?.[0];

    banner.title = title || banner.title;
    banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
    banner.buttonText = buttonText !== undefined ? buttonText : banner.buttonText;
    banner.redirectUrl = redirectUrl || banner.redirectUrl;
    banner.desktopTemplate = desktopTemplate || banner.desktopTemplate;
    banner.mobileTemplate = mobileTemplate || banner.mobileTemplate;
    banner.theme = theme !== undefined ? theme : banner.theme;
    banner.badge = badge !== undefined ? badge : banner.badge;
    banner.priority = priority !== undefined ? Number(priority) : banner.priority;
    banner.active = active !== undefined ? (active === "true" || active === true) : banner.active;
    
    if (startDate !== undefined) {
      banner.startDate = startDate ? new Date(startDate) : undefined;
    }
    if (endDate !== undefined) {
      banner.endDate = endDate ? new Date(endDate) : undefined;
    }

    if (desktopImageFile) {
      banner.desktopImage = desktopImageFile.path;
    }
    if (mobileImageFile) {
      banner.mobileImage = mobileImageFile.path;
    }

    await banner.save();

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    console.error("Update banner error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update banner",
    });
  }
};

// Delete Banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerModel.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete banner error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete banner",
    });
  }
};

// Get Admin Banners (All Banners)
export const getAdminBanners = async (req, res) => {
  try {
    const banners = await bannerModel.find({}).sort({ priority: -1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Get admin banners error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch banners",
    });
  }
};

// Get Active Banners (Public)
export const getActiveBanners = async (req, res) => {
  try {
    const now = new Date();
    // Fetch banners where active is true AND (startDate is not set OR <= now) AND (endDate is not set OR >= now)
    const banners = await bannerModel.find({
      active: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } },
          ],
        },
      ],
    }).sort({ priority: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Get active banners error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch active banners",
    });
  }
};
