import express from 'express'
import validator from '../validators/zodValidator.js';
import { addSchema } from '../validators/productValidator.js';
import { addProduct, bestSeller, getBulkProducts, latestCollection, listPageProduct, relatedProduct, removeProduct,reviewProduct,singleProduct, updateProductStatus, getAdminProductStats } from '../controllers/productController.js'
import handelImageUpload from '../util/handelImageUpload.js';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';


const productRouter = express.Router();

productRouter.post('/add',adminAuth , handelImageUpload, validator(addSchema), addProduct);
productRouter.post('/remove',adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.post('/bulk', getBulkProducts);
productRouter.get('/list-page', listPageProduct);
productRouter.get('/related', relatedProduct);
productRouter.get(`/bestseller`, bestSeller);
productRouter.get(`/latest`, latestCollection);
productRouter.post('/review', userAuth, reviewProduct);
productRouter.post('/status', adminAuth, updateProductStatus);
productRouter.get('/admin-stats/:id', adminAuth, getAdminProductStats);

export default productRouter;