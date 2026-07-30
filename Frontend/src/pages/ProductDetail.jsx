import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ShopContext } from "../context/ShopContext";
import { Star, StarHalf, Shield, Truck, RefreshCw, ShoppingCart, Loader2, Heart } from "lucide-react";
import RelatedProduct from "../components/RelatedProduct";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const ProductDetail = () => {
  const { productID } = useParams();
  const { CurrencySym, addToCart, backend, token, toggleWishlist, isInWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState();
  const [mainImage, setMainImage] = useState();
  const [selectsize, setSelectSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviewStar, setReviewStar] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [canReview, setCanReview] = useState(false);
   

  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1])).id;
    } catch (e) {
      return null;
    }
  };

  const currentUserId = getUserIdFromToken();
  let myReview = undefined; //track when the user get the edit or post review option
  //Fetching the active review of the user...(for future edit)
  useEffect(() => {
    if (productData?.reviews && currentUserId) {
        myReview = productData.reviews.find(r => r.userId === currentUserId);
        if(myReview){
            setReviewStar(myReview.star);
            setReviewText(myReview.reviewText);
        }
    }
  }, [productData, currentUserId]);


  const fetchProductData = async () => {
    try {
      const response = await axios.post(`${backend}/api/product/single`, {
        _id: productID,
        userId: currentUserId,
      });
      if (response.data.success) {
        setProductData(response.data.product);
        setMainImage(response.data.product.images[0]);
        if (response.data.canReview !== undefined) {
           setCanReview(response.data.canReview);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeProductReview = async (action) =>{
    if(!token){
       toast.error("Please login to post a review");
       return;
    }
    try {
      const response = await axios.post(`${backend}/api/product/review`,
        {productId: productID, star: reviewStar, reviewText, action},
        {headers: {token}}
      )
      if(response.data.success){
        toast.success(response.data.message);
        setCanReview(response.canReview);
        fetchProductData(); //refetching the order if someone posted the review
        if(action === 'delete') {
            setReviewStar(5);
            setReviewText("");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [productID, currentUserId]);

  const reviewCount = productData?.reviews?.length || 0;
  const avgRating =
    reviewCount > 0
      ? productData?.reviews?.reduce(
          (sum, review) => sum + (review.star || 0),
          0,
        ) / reviewCount
      : 0;


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
                <img
                  src={item}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="flex-1 bg-[var(--bg-subtle)] border border-[var(--border-color)]/40 rounded-xl p-4 flex items-center justify-center min-h-[320px]">
            <img
              src={mainImage}
              alt={productData.name}
              className="max-h-[420px] object-contain transition-all"
            />
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
              {[1,2,3,4,5].map((star,index)=>(
                <span key={star}>
                  {
                    avgRating >= star 
                    ? <Star className="w-4 h-4 fill-amber-400" />
                    : avgRating >= star - 0.5
                      ? <StarHalf className="w-4 h-4 fill-amber-400"/>
                      : <Star className="w-4 h-4 fill-amber-400 opacity-40" />
                  }
                </span>
              ))}
              <span className="text-xs font-semibold text-[var(--text-muted)] ml-2">
                {avgRating > 0 ? avgRating.toFixed(1) : 0}
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)] ml-2">
                ({productData?.reviews?.length || 0} Reviews)
              </span>
            </div>
          </div>

          <div className="text-3xl font-extrabold text-[var(--primary-accent)]">
            {CurrencySym}
            {productData.price}
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
                        : "bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--border)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart + Wishlist CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={() => addToCart(productData._id, selectsize, mainImage)}
              className="w-full py-3 sm:w-auto flex-1 sm:flex-none font-bold uppercase gap-2 px-10 hover:bg-[#0980FF]"
            >
              <ShoppingCart className="w-5 h-5" /> Add To Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => toggleWishlist(productData._id, mainImage)}
              className={`w-full py-3 sm:w-auto flex-1 sm:flex-none font-bold uppercase gap-2 px-8 border-2 transition-all ${
                isInWishlist(productData._id)
                  ? "border-red-500/20 text-[#FF0800] bg-red-400/20 hover:bg-red-500/20 hover:border-red-600/20 duration-200"
                  : "border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text-main)]"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isInWishlist(productData._id) ? "fill-[#FF0800]" : ""}`}
              />
              {isInWishlist(productData._id) ? "Wishlisted" : "Wishlist"}
            </Button>
          </div>

          <hr className="border-[var(--border-color)]/40 my-6" />

          {/* Features */}
          <div className="space-y-2 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--primary-accent)]" /> 100%
              Genuine Authentic Product
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[var(--primary-accent)]" /> Cash on
              delivery is available
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[var(--primary-accent)]" />{" "}
              Easy Return & Exchange within 10 Days
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
            Reviews ({productData?.reviews?.length || 0})
          </button>
        </div>
        <CardContent className="p-6 text-sm text-[var(--text-muted)] leading-relaxed space-y-4">
          {activeTab === "description" ? (
            <>
              <p>
                An e-commerce website is an online platform that allows
                businesses and individuals to buy and sell products or services
                over the internet. It provides a convenient shopping experience
                with features like product catalogs, secure payment gateways,
                and order tracking.
              </p>
              <p>
                E-commerce platforms offer detailed product descriptions,
                customer reviews, and personalized recommendations to enhance
                the shopping experience. With support for multiple payment
                methods and reliable delivery options, these websites provide a
                seamless transaction process.
              </p>
            </>
          ) : (
            <div className="space-y-8">
              {/* Review Form */}
              {token ? (
                canReview ? (
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-[var(--text-main)]">
                      {productData?.reviews?.find(
                        (r) => r.userId === currentUserId,
                      )
                        ? "Update your review"
                        : "Write a review"}
                    </h3>
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-6 h-6 cursor-pointer transition-colors ${s <= reviewStar ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                          onClick={() => setReviewStar(s)}
                        />
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg p-3 min-h-[100px] mb-4 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary-accent)] outline-none"
                      placeholder="Share your thoughts about this product..."
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          placeProductReview(
                            productData?.reviews?.find(
                              (r) => r.userId === currentUserId,
                            )
                              ? "update"
                              : "create",
                          )
                        }
                        className="font-bold"
                      >
                        {productData?.reviews?.find(
                          (r) => r.userId === currentUserId,
                        )
                          ? "Update Review"
                          : "Post Review"}
                      </Button>
                      {productData?.reviews?.find(
                        (r) => r.userId === currentUserId,
                      ) && (
                        <Button
                          variant="destructive"
                          onClick={() => placeProductReview("delete")}
                          className="font-bold"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[var(--bg-subtle)] rounded-lg text-center border border-[var(--border-color)]">
                    <p className="text-[var(--text-main)] font-semibold">
                      You can only review a product after it has been delivered.
                    </p>
                  </div>
                )
              ) : (
                <div className="p-4 bg-[var(--bg-subtle)] rounded-lg text-center border border-[var(--border-color)]">
                  <p className="text-[var(--text-main)] font-semibold">
                    Please log in to write a review.
                  </p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[var(--text-main)]">
                  Customer Reviews
                </h3>
                {productData?.reviews?.length > 0 ? (
                  productData.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="border-b border-[var(--border-color)] pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <div className="text-xl font-semibold text-[var(--text-main)]">
                            {review.name}
                          </div>
                          <div className="text-xs text-[var(--text-muted)]">
                            {new Date(review.time).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.star ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[var(--text-muted)] text-sm">
                        {review.reviewText}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[var(--text-muted)]">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Products */}
      <div className="mt-12">
        <RelatedProduct
          category={productData.category}
          subCategory={productData.subcategory}
          id={productData._id}
        />
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-accent)]" />
    </div>
  );
};

export default ProductDetail;
