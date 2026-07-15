import React, { useState } from "react";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const allSizes = ["S", "M", "L", "XL", "XXL"];
  const shoeSizes = ["4", "5", "6", "7", "8", "9", "10", "11", "12"];

  //Condition for which size to select
  const displaySizes = subCategory === "Footwear" ? shoeSizes : allSizes;

  const toggleSize = (size) => {
    setSizes(
      (prev) =>
        prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size], //if includes then remove else add the size
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (sizes.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subcategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("quantity", quantity);
      if (image1) formData.append("images", image1); //the key name -> (images) should be same as schema name
      if (image2) formData.append("images", image2);
      if (image3) formData.append("images", image3);
      if (image4) formData.append("images", image4);

      // console.log(Object.fromEntries(formData.entries())); // for testing purpose

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        console.log(response.data);
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setBestseller(false);
        setSizes([]);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to add product.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadBox = ({ image, setImage, id }) => (
    <label htmlFor={id} className="cursor-pointer">
      <img
        src={image ? URL.createObjectURL(image) : assets.upload_area} //creates a temporar url
        alt="Upload image"
        className="w-24 h-24 object-cover border border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors"
      />
      <input
        id={id}
        type="file"
        accept="image/*" /* Only acceps image files*/
        hidden
        onChange={(e) => setImage(e.target.files[0])}
      />
    </label>
  );

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-6 w-full max-w-2xl"
    >
      <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>

      {/* Image Upload */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Upload Images</p>
        <div className="flex gap-3 flex-wrap">
          <ImageUploadBox image={image1} setImage={setImage1} id="img1" />
          <ImageUploadBox image={image2} setImage={setImage2} id="img2" />
          <ImageUploadBox image={image3} setImage={setImage3} id="img3" />
          <ImageUploadBox image={image4} setImage={setImage4} id="img4" />
        </div>
      </div>

      {/* Product Name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          placeholder="Type product name here"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Product Description
        </label>
        <textarea
          placeholder="Write product description here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>

      {/* Category, Sub-category, Price */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-sm font-medium text-gray-700">
            Product Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-sm font-medium text-gray-700">
            Sub Category
          </label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
            <option value="Footwear">Footwear</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <label className="text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            placeholder="25"
            value={price}
            min={0}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Product Sizes</p>
        <div className="flex gap-2 flex-wrap">
          {displaySizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-4 py-1.5 text-sm font-medium rounded border transition-all
                ${
                  sizes.includes(size)
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:border-orange-400"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex items-center gap-2">
        <input
          id="bestseller"
          type="checkbox"
          checked={bestseller}
          onChange={(e) => setBestseller(e.target.checked)}
          className="w-4 h-4 accent-orange-500 cursor-pointer"
        />
        <label
          htmlFor="bestseller"
          className="text-sm text-gray-700 cursor-pointer"
        >
          Add to bestseller
        </label>
      </div>

      {/* Submit */}
      <button
        id="add-product-btn"
        type="submit"
        disabled={loading}
        className="w-32 bg-gray-900 text-white py-2.5 text-sm font-semibold rounded-md
                   hover:bg-orange-500 transition-colors duration-200
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Adding…" : "ADD"}
      </button>
    </form>
  );
};

export default Add;
