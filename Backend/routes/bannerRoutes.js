import express from 'express';
import { createBanner, updateBanner, deleteBanner, getAdminBanners, getActiveBanners } from '../controllers/bannerController.js';
import adminAuth from '../middleware/adminAuth.js';
import { upload } from '../middleware/storageEngine.js';

const bannerRouter = express.Router();

const bannerUpload = upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 }
]);

bannerRouter.post('/create', adminAuth, bannerUpload, createBanner);
bannerRouter.put('/update/:id', adminAuth, bannerUpload, updateBanner);
bannerRouter.delete('/:id', adminAuth, deleteBanner);
bannerRouter.get('/admin', adminAuth, getAdminBanners);
bannerRouter.get('/active', getActiveBanners);

export default bannerRouter;
