import { addProductRepository,bestSellerRepository,findProductIdRepository,findProductsByIdsRepository,listProductRepository, removeProductRepository, totalProductCount, allProductRepository, relatedProductRepository } from "../repository/productRepository.js";

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

export const singeProductService = async(id)=>{
    const response = await findProductIdRepository(id);
    if (!response) {
        throw { status: 404, message: "Product not found" };
    }
    return response;
}

export const bestSellerService = async()=>{
    const response = await bestSellerRepository();
    const bestseller = response.slice(0,5).reverse();
    return bestseller;
}

export const latestCollectionService = async()=>{
    const productList = await listProductRepository();
    const latestProductList = productList.reverse().slice(0,10);
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