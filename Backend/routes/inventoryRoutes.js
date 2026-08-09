import express from "express";
import { adjustStock, getAnalytics, getLedger, getLowStock } from "../controllers/inventoryController.js";
import adminAuth from "../middleware/adminAuth.js";

const inventoryRouter = express.Router();

inventoryRouter.get('/ledger', adminAuth, getLedger);
inventoryRouter.post('/adjust', adminAuth, adjustStock);
inventoryRouter.get('/low-stock', adminAuth, getLowStock);
inventoryRouter.get('/analytics', adminAuth, getAnalytics);

export default inventoryRouter;
