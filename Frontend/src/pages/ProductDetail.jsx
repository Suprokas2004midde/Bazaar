import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ShopContext } from "../context/ShopContext";
import { Star, Shield, Truck, RefreshCw, ShoppingCart, Loader2 } from "lucide-react";
import RelatedProduct from "../components/RelatedProduct";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const ProductDetail = () => {
  const { productID } = useParams();
  const { CurrencySym, addToCart, backend } = useContext(ShopContext);
  const [productData, setProductData] = useState();
  const [mainImage, setMainImage] = useState();
  const [selectsize, setSelectSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const fetchProductData = async () => {
    try {
      const response = await axios.post(`${backend}/api/product/single`, {
        _id: productID,
      });
      if (response.data.success) {
        setProductData(response.data.product);
        setMainImage(response.data.product.images[0]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productID]);

  return productData ? (
    <div className="pt-8 border-t border-[var(--border-color)]/40 transition-all duration-300">
      {/* Product Display */}
      <div className="flex gap-8 sm:gap-12 flex-col lg:flex-row">
        {/* Images Gallery */}
        <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-3 sm:w-24 shrink-0">
            {productData.images.map((item, index) => (
              <div
                key={index}
                onClick={() => setMainImage(item)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border cursor-pointer p-1 transition-all bg-[var(--bg-subtle)] ${
                  item === mainImage
                    ? "border-[var(--primary-accent)] ring-2 ring-[var(--primary-accent)]/30"
                    : "border-[var(--border-color)]/50 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={item} alt="" className="w-full h-full object-contain" />
              </div>
            ))}
          </div>

          <div className="flex-1 bg-[var(--bg-subtle)] border border-[var(--border-color)]/40 rounded-xl p-4 flex items-center justify-center min-h-[320px]">
            <img src={mainImage} alt={productData.name} className="max-h-[420px] object-contain transition-all" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2 uppercase">
              {productData.category} / {productData.subcategory}
            </Badge>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight">
              {productData.name}
            </h1>

            <div className="flex items-center gap-1.5 mt-3 text-amber-400 text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 opacity-40" />
              <span className="text-xs font-semibold text-[var(--text-muted)] ml-2">(122 Reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-extrabold text-[var(--primary-accent)]">
            {CurrencySym}{productData.price}
          </div>

          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {productData.description}
          </p>

          {/* Size Selection */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">
                Select Size
              </p>
              <div className="flex flex-wrap gap-3">
                {productData.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectSize(size)}
                    className={`py-2 px-4 rounded-md text-sm font-semibold border transition-all cursor-pointer ${
                      size === selectsize
                        ? "bg-[var(--primary-accent)] text-[var(--bg-main)] border-[var(--primary-accent)] shadow-md"
                        : "bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--primary-accent)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart CTA */}
          <div className="pt-4">
            <Button
              size="lg"
              onClick={() => addToCart(productData._id, selectsize)}
              className="w-full sm:w-auto font-bold uppercase gap-2 px-10"
            >
              <ShoppingCart className="w-5 h-5" /> Add To Cart
            </Button>
          </div>

          <hr className="border-[var(--border-color)]/40 my-6" />

          {/* Features */}
          <div className="space-y-2 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--primary-accent)]" /> 100% Genuine Authentic Product
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[var(--primary-accent)]" /> Cash on delivery is available
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[var(--primary-accent)]" /> Easy Return & Exchange within 10 Days
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Details */}
      <Card className="mt-14 border-[var(--border-color)]">
        <div className="flex border-b border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "description"
                ? "border-[var(--primary-accent)] text-[var(--primary-accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "reviews"
                ? "border-[var(--primary-accent)] text-[var(--primary-accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
          >
            Reviews (122)
          </button>
        </div>
        <CardContent className="p-6 text-sm text-[var(--text-muted)] leading-relaxed space-y-4">
          {activeTab === "description" ? (
            <>
              <p>
                An e-commerce website is an online platform that allows businesses and individuals to buy and sell products or services over the internet. It provides a convenient shopping experience with features like product catalogs, secure payment gateways, and order tracking.
              </p>
              <p>
                E-commerce platforms offer detailed product descriptions, customer reviews, and personalized recommendations to enhance the shopping experience. With support for multiple payment methods and reliable delivery options, these websites provide a seamless transaction process.
              </p>
            </>
          ) : (
            <p>Customer reviews section showing verified buyer ratings, feedback, and product satisfaction.</p>
          )}
        </CardContent>
      </Card>

      {/* Related Products */}
      <div className="mt-12">
        <RelatedProduct category={productData.category} subCategory={productData.subcategory} id={productData._id} />
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-accent)]" />
    </div>
  );
};

export default ProductDetail;
