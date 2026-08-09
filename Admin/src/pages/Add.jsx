import React, { useState } from "react";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const DynamicSelect = ({ label, value, onChange, options, onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (newValue.trim()) {
      onAdd(newValue.trim());
      setIsAdding(false);
      setNewValue("");
    }
  };

  return (
    <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2 items-center">
        {!isAdding ? (
          <>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 flex-1"
            >
              <option value="" disabled>Select {label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors"
              title={`Add new ${label}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`New ${label}`}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 flex-1 min-w-[80px]"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            />
            <button
              type="button"
              onClick={handleAdd}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => { setIsAdding(false); setNewValue(""); }}
              className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('categories')) || ["Men", "Women", "Kids"]);
  const [subCategories, setSubCategories] = useState(() => JSON.parse(localStorage.getItem('subCategories')) || ["Topwear", "Bottomwear", "Winterwear", "Footwear"]);
  const [sizeSets, setSizeSets] = useState(() => JSON.parse(localStorage.getItem('sizeSets')) || {
    "Footwear": ["4", "5", "6", "7", "8", "9", "10", "11", "12"],
    "Topwear": ["S", "M", "L", "XL", "XXL", "Free Size"],
  });

  const [category, setCategory] = useState(categories[0] || "");
  const [subCategory, setSubCategory] = useState(subCategories[0] || "");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isAddingSize, setIsAddingSize] = useState(false);
  const [newSizeInput, setNewSizeInput] = useState("");

  //Condition for which size to select
  const displaySizes = sizeSets[subCategory] || sizeSets[category] || sizeSets["default"] || [];

  const handleAddCategory = (newCat) => {
    if (!categories.includes(newCat)) {
      const updated = [...categories, newCat];
      setCategories(updated);
      localStorage.setItem('categories', JSON.stringify(updated));
    }
    setCategory(newCat);
  };

  const handleAddSubCategory = (newSub) => {
    if (!subCategories.includes(newSub)) {
      const updated = [...subCategories, newSub];
      setSubCategories(updated);
      localStorage.setItem('subCategories', JSON.stringify(updated));
    }
    setSubCategory(newSub);
  };

  const handleAddSize = () => {
    const val = newSizeInput.trim();
    if (val) {
      const key = subCategory || category || "default";
      const updatedSets = { ...sizeSets };
      if (!updatedSets[key]) {
        updatedSets[key] = []; //converts it into an Array
      }
      if (!updatedSets[key].includes(val)) {
        updatedSets[key] = [...updatedSets[key], val];
        setSizeSets(updatedSets);
        localStorage.setItem('sizeSets', JSON.stringify(updatedSets));
      }
      setNewSizeInput("");
      setIsAddingSize(false);
    }
  };

  const toggleSize = (size) => {
    setSizes((prev) => {
      const exists = prev.find(s => s.size === size);
      if (exists) {
        return prev.filter(s => s.size !== size);
      } else {
        return [...prev, { size, sku: "", costPrice: "", quantity: 1, allowBackorder: false }];
      }
    });
  };

  const updateSizeField = (size, field, value) => {
    setSizes(prev => prev.map(s => s.size === size ? { ...s, [field]: value } : s));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (sizes.length === 0) {
      toast.error("Please select at least one size/variant.");
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
      if (image1) formData.append("images", image1);
      if (image2) formData.append("images", image2);
      if (image3) formData.append("images", image3);
      if (image4) formData.append("images", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        setName("");
        setDescription("");
        setPrice("");
        setCategory(categories[0] || "");
        setSubCategory(subCategories[0] || "");
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
        src={image ? URL.createObjectURL(image) : assets.upload_area}
        alt="Upload image"
        className="w-24 h-24 object-cover border border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors"
      />
      <input
        id={id}
        type="file"
        accept="image/*"
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
        <DynamicSelect
          label="Category"
          value={category}
          onChange={setCategory}
          options={categories}
          onAdd={handleAddCategory}
        />

        <DynamicSelect
          label="Sub Category"
          value={subCategory}
          onChange={setSubCategory}
          options={subCategories}
          onAdd={handleAddSubCategory}
        />

        <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <label className="text-sm font-medium text-gray-700">Selling Price</label>
          <input
            type="number"
            placeholder="25"
            value={price}
            min={0}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 h-[38px] mt-auto"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Product Sizes & Variants</p>
        </div>
        <div className="flex gap-2 flex-wrap mb-4 items-center">
          {displaySizes.map((size) => {
            const isSelected = sizes.some(s => s.size === size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-1.5 text-sm font-medium rounded border transition-all
                  ${
                    isSelected
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:border-orange-400"
                  }`}
              >
                {size}
              </button>
            )
          })}
          
          {/* Add Size Toggle */}
          {!isAddingSize ? (
            <button
              type="button"
              onClick={() => setIsAddingSize(true)}
              className="px-3 py-1.5 text-sm font-medium rounded border border-dashed border-gray-400 text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-all flex items-center gap-1"
              title="Add new variant/size for this category"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newSizeInput}
                onChange={(e) => setNewSizeInput(e.target.value)}
                placeholder="New size"
                className="border border-gray-300 rounded px-2 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-orange-400"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSize(false)}
                className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Selected Sizes Details */}
        {sizes.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium">Size</th>
                  <th className="px-4 py-2 font-medium">SKU (Optional)</th>
                  <th className="px-4 py-2 font-medium">Cost Price</th>
                  <th className="px-4 py-2 font-medium">Stock Qty</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((s) => (
                  <tr key={s.size} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2 font-bold">{s.size}</td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={s.sku} 
                        onChange={(e) => updateSizeField(s.size, 'sku', e.target.value)}
                        placeholder="SKU-123"
                        className="border border-gray-300 rounded px-2 py-1 w-24 text-xs"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" 
                        value={s.costPrice} 
                        onChange={(e) => updateSizeField(s.size, 'costPrice', e.target.value)}
                        placeholder="0.00"
                        className="border border-gray-300 rounded px-2 py-1 w-20 text-xs"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" 
                        value={s.quantity} 
                        min="0"
                        required
                        onChange={(e) => updateSizeField(s.size, 'quantity', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-20 text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
