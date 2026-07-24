import productModel from "../schema/productModel.js";

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
    bestseller: bestseller === "true" ? true : false,
    date: Date.now(),
  });

  await newProduct.save();
  return newProduct;
};

export const listProductRepository = async (page, limit, skip, filter = {}) => {
  const productList = await productModel
    .find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);
  return productList;
};

export const relatedProductRepository = async (category, subcategory) =>{
  const products = await productModel.find({
    category: category,
    subcategory: subcategory,
  })
  return products;
}

export const findProductIdRepository = async (id) => {
  const product = await productModel.findById(id);
  return product;
};

export const removeProductRepository = async (id) => {
  const response = await productModel.findByIdAndDelete(id);
  return response;
};

export const bestSellerRepository = async () => {
  const response = await productModel.find({ bestseller: true });
  return response;
};

export const findProductsByIdsRepository = async (ids) => {
  const products = await productModel.find({ _id: { $in: ids } });
  return products;
};

export const totalProductCount = async (filter = {}) => {
  const count = await productModel.countDocuments(filter);
  return count;
};

//till not used...
export const allProductRepository = async () => {
  const products = await productModel.find({}).sort({ date: -1 });
  return products;
};