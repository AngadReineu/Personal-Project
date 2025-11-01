import axios from "axios";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";

const ProductCreation = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collection: "",
    material: "",
    gender: "",
    images: [],
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  // ✅ Upload image to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Add image URL to product data
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl }],
      }));
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Submit product to backend
  const handleFormEdit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Product uploaded successfully!");
      console.log("Saved Product:", data);
      setProductData({
        name: "",
        description: "",
        price: 0,
        discountedPrice: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collection: "",
        material: "",
        gender: "",
        images: [],
      });
    } catch (error) {
      console.error("❌ Error saving product:", error);
      alert("Failed to upload product");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Upload Product</h2>
      <form onSubmit={handleFormEdit}>
        {/* ...all your form fields stay the same... */}

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white p-2"
          />
          {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}

          {/* Image preview */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {productData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt="Product"
                  onClick={() => setPreviewImage(image.url)}
                  className="w-20 h-20 object-cover rounded-md shadow-md hover:scale-105 transition-transform cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
        </div>

        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default ProductCreation;
