import express from 'express'
import validator from '../validators/zodValidator.js';
import { addSchema } from '../validators/productValidator.js';
import { addProduct, bestSeller, getBulkProducts, latestCollection, listPageProduct, relatedProduct, removeProduct,singleProduct } from '../controllers/productController.js'
import handelImageUpload from '../util/handelImageUpload.js';
import adminAuth from '../middleware/adminAuth.js';


const productRouter = express.Router();

productRouter.post('/add',adminAuth , handelImageUpload, validator(addSchema), addProduct);
productRouter.post('/remove',adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.post('/bulk', getBulkProducts);
productRouter.get('/list-page', listPageProduct);
productRouter.get('/related', relatedProduct);
productRouter.get(`/bestseller`, bestSeller);
productRouter.get(`/latest`, latestCollection);

export default productRouter;