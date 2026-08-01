import { addProductRepository,bestSellerRepository,findProductIdRepository,findProductsByIdsRepository,listProductRepository, removeProductRepository, totalProductCount, allProductRepository, relatedProductRepository } from "../repository/productRepository.js";
import orderModel from "../schema/orderModel.js";
import productModel from "../schema/productModel.js";
import userModel from "../schema/userModel.js";
export const addProductService = async ({
  name,
  description,
  price,
  category,
  subcategory,
  bestseller,
  sizes,
  files,
  quantity,
}) => {
    const imageUrl = files.map((file)=> file.path);
    
    //Sending the data to the repository layer....
    const product = await addProductRepository({name,description,price,category,subcategory,bestseller,sizes,imageUrl,quantity});
    return product;
};

export const reviewProductService = async (userId, productId, star, reviewText, action) => {
    // 1. Check if user ordered the product and it is delivered.
    const hasOrdered = await orderModel.findOne({
        userId,
        "items._id": productId,
        status: "Delivered"
    });
    if (!hasOrdered) {
        throw { status: 403, message: "You can only review products that have been delivered to you." };
    }
    
    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);
    
    if (!product) throw { status: 404, message: "Product not found" };

    if (action === 'delete') {
        product.reviews = product.reviews.filter(r => r.userId !== userId);
        product.markModified('reviews');
        await product.save();
        return { message: "Review deleted successfully", data: product.reviews };
    }

    // It's a create or update
    const existingReviewIndex = product.reviews.findIndex(r => r.userId === userId);
    
    const reviewData = {
        userId,
        name: user.name,
        star,
        reviewText,
        time: Date.now()
    };

    if (existingReviewIndex !== -1) {
        // Update existing review
        product.reviews[existingReviewIndex] = reviewData; //if already exist then update it...
    } else {
        // Post new review
        product.reviews.push(reviewData); //if new then add it...
    }
    
    product.markModified('reviews');
    await product.save();

    return { message: "Review posted successfully", data: product.reviews, canReview: !!hasOrdered, };
};

export const listproductService = async(page, limit, skip, filter = {})=>{
    const responselist = await listProductRepository(page, limit, skip, filter);
    return responselist;
}

export const removeProductService = async(id)=>{
    const product = await findProductIdRepository(id);

    if (!product) {
        throw { status: 404, message: "Product with provided id not found" };
    }

    const response = await removeProductRepository(id);
    return response;
}

export const singeProductService = async(id, userId)=>{
    const product = await findProductIdRepository(id);
    if (!product) {
        throw { status: 404, message: "Product not found" };
    }
    
    let canReview = false;
    if (userId) {
        const hasOrdered = await orderModel.findOne({
            userId,
            "items._id": id,
            status: "Delivered"
        });
        canReview = !!hasOrdered;
    }
    
    return { product, canReview };
}

export const bestSellerService = async()=>{
    const response = await bestSellerRepository();
    const bestseller = response.slice(0,5).reverse();
    return bestseller;
}

export const latestCollectionService = async()=>{
    const productList = await listProductRepository();
    const latestProductList = productList.slice(0,10);
    return latestProductList;
}

export const getBulkProductsService = async (ids) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return [];
    }
    const products = await findProductsByIdsRepository(ids);
    return products;
}

export const relatedProductService = async(category, subcategory) =>{
    const response = await relatedProductRepository(category, subcategory);
    return response;
}

//till not used
export const allProductService = async()=>{
    const response= await allProductRepository();
    return response;
}