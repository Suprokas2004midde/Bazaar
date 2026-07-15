import path from 'path'
import { addProductService, listproductService, removeProductService, singeProductService } from "../services/productService.js";


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

export const listProduct = async (req, res) =>{
    try {
      const response = await listproductService();
      return res.status(200).json({
        success: true,
        message: "Product list fetched successfully",
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