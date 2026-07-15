
import productModel from "../schema/productModel.js"

export const addProductRepository = async ({
  name,
  description,
  price,
  category,
  subcategory,
  bestseller,
  sizes,
  imageUrl,
  quantity,
}) => {

    //new Student data with changed types...

    const newProduct = new productModel({
        name: name,
        description: description,
        price: Number(price),
        category: category,
        quantity: Number(quantity),
        images: imageUrl,
        sizes: sizes ? JSON.parse(sizes) : [], // safely parse sizes string, default to [] if not sent
        subcategory: subcategory,
        bestseller: bestseller==="true"? true: false,
        date: Date.now(),
    });

    await newProduct.save();
    return newProduct;
};

export const listProductRepository = async()=>{
    const productList = await productModel.find({});
    return productList;
}

export const findProductIdRepository = async(id)=>{
    const product = await productModel.findById(id)
    return product;
}

export const removeProductRepository = async(id)=>{
    const response = await productModel.findByIdAndDelete(id)
    return response;
}