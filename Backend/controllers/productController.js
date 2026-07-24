import path from 'path'
import { addProductService, allProductService, bestSellerService, getBulkProductsService, latestCollectionService, listproductService, relatedProductService, removeProductService, singeProductService } from "../services/productService.js";
import { totalProductCount } from '../repository/productRepository.js';

export const addProduct = async (req, res) =>{
    try {
        const { name, description, price, category, subcategory, bestseller, sizes, quantity } = req.body;
        const files = req.files;

        const response = await addProductService({ name, description, price, category, subcategory, bestseller, sizes, files, quantity}); 

        return res.status(200).json({
          success: true,
          message: "Product uploaded successfully",
          data: response,
        });
    }  
    catch(error){
      console.log(error);
      if(error.status){
        return res.status(error.status).json({
          message: error.message,
          success:false,
        })
      }
      return res.status(500).json({
        message:"Internal server error",
        success:false,
      })
    }
}

export const listPageProduct = async (req, res) =>{
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 8;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.query.category) {
        const categories = req.query.category.split(',').filter(Boolean);
        if (categories.length > 0) filter.category = { $in: categories };
      }
      if (req.query.subcategory) {
        const subcategories = req.query.subcategory.split(',').filter(Boolean);
        if (subcategories.length > 0) filter.subcategory = { $in: subcategories };
      }
      if (req.query.search) {
        filter.name = { $regex: req.query.search, $options: 'i' };
      }

      const totalProducts = await totalProductCount(filter);
      const response = await listproductService(page, limit, skip, filter);

      return res.status(200).json({
        success: true,
        message: "Product list fetched successfully",
        products: response,
        totalPages: Math.ceil(totalProducts / limit) || 1,
        totalProducts,
        page,
        limit,
      });

    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          message: error.message,
          success: false,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
}

export const relatedProduct = async (req, res) =>{
  try {
    const category = req.query.category;
    const subcategory = req.query.subcategory;
    const response = await relatedProductService(category,subcategory);
    return res.status(200).json({
      success: true,
      message: "Related Data fetched Successfully",
      products: response,
    })
    
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        message: error.message,
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export const removeProduct = async (req, res) =>{
    try {
      const response = await removeProductService(req.body._id);
      return res.status(200).json({
        success: true,
        message: "Product removed successfully",
        data: response,
      });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          message: error.message,
          success: false,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
}

export const singleProduct = async (req, res) =>{
    try {
      const response = await singeProductService(req.body._id);
      return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product: response,
      });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          message: error.message,
          success: false,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
}

export const bestSeller = async (req, res) =>{
  try {
    const response = await bestSellerService();
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      products: response,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        message: error.message,
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export const latestCollection = async(req, res) =>{
  try {
    const response = await latestCollectionService();
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      products: response,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        message: error.message,
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
} 

export const getBulkProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    const response = await getBulkProductsService(ids);
    return res.status(200).json({
      success: true,
      message: "Bulk products fetched successfully",
      products: response,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        message: error.message,
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

