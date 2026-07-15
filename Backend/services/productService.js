import { addProductRepository,findProductIdRepository,listProductRepository, removeProductRepository } from "../repository/productRepository.js";

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

export const listproductService = async()=>{
    const responselist = await listProductRepository();
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

export const singeProductService = async(id)=>{
    const response = await findProductIdRepository(id);
    if (!response) {
        throw { status: 404, message: "Product not found" };
    }
    return response;
}
