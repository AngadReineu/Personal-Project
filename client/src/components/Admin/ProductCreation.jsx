import React, { useState } from 'react'
import { MdDelete } from "react-icons/md"

const ProductCreation = () => {
    const [productData, setProductData] = useState(
        {
            name: '',
            description: '',
            price: 0,
            discountedPrice: 0,
            countInStock: 0,
            sku: '',
            category: '',
            brand: '',
            sizes: [],
            colors: [],
            collection: '',
            materail: '',
            gender: '',
            images: [
                {
                    url: "https://picsum.photos/150?random=1",
                },
                {
                    url: "https://picsum.photos/150?random=2",
                }
            ]

        }
    );
    const [previewImage, setPreviewImage] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }))
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProductData((prev) => ({
                ...prev,
                images: [...prev.images, { url: reader.result }],
            }));
        };
        reader.readAsDataURL(file);
    };


    const handleFormEdit = (e) => {
        e.preventDefault();
        console.log(productData);

    };
    const handleRemoveImage = (indexToRemove) => {
        setProductData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== indexToRemove),
        }));
    };



    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className="text-3xl font-bold mb-6">Upload Product</h2>
            <form onSubmit={handleFormEdit}>

                {/*  name */}
                <div className="mb-6 ">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input
                        type="text"
                        name='name'
                        value={productData.name}
                        onChange={handleChange}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        required />
                </div>
                {/* desc */}
                <div className="mb-6 ">
                    <label className="block font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        rows={4}
                        placeholder="Write the Description"
                        required
                    />
                </div>

                {/* price area */}

                <div className="mb-6">
                    <label className='block font-semibold mb-2'>
                        Price
                    </label>
                    <input
                        type="number"
                        name='price'
                        value={productData.price}
                        onChange={handleChange}
                        required
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* discounted Price */}
                <div className='mb-6'>
                    <label className="block font-semibold mb-2">Discounted Price</label>
                    <input
                        type="number"
                        name="discountedPrice"
                        value={productData.discountedPrice}
                        onChange={handleChange}
                        placeholder="Enter discounted price"
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>


                {/* Stock Availability */}

                <div className="mb-6">
                    <label className='block font-semibold mb-2'>
                        Stock Available
                    </label>
                    <input
                        type="number"
                        name='countInStock'
                        value={productData.countInStock}
                        onChange={handleChange}
                        required
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* skew */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>
                        SKU
                    </label>
                    <input
                        type="text"
                        name='sku'
                        value={productData.sku}
                        onChange={handleChange}
                        required
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* gender */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Gender</label>
                    <select
                        name="gender"
                        value={productData.gender}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 bg-white"
                    >
                        <option value="">Select gender</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                    </select>
                </div>
                {/* sizes */}

                <div className="mb-6">
                    <label className='block font-semibold mb-2'>
                        Sizes (comma-seperated)
                    </label>
                    <input
                        type="text"
                        name='sizes'
                        value={productData.sizes.join(",")}
                        onChange={(e) => setProductData({
                            ...productData,
                            sizes: e.target.value.split(",").map((size) => size.trim()),
                        })
                        }
                        placeholder="e.g. XS, S, M, L, XL"
                        required
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* material */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Material</label>
                    <input
                        type="text"
                        name="material"  // keeping your state key spelling same as in your object
                        value={productData.materail}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. Cotton, Leather, Polyester"
                    />
                </div>
                {/* category */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Category</label>
                    <select
                        name="category"
                        value={productData.category}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 bg-white"
                    >
                        <option value="">Select category</option>
                        <option value="shoes">Mens</option>
                        <option value="clothing">Women</option>
                        <option value="accessories">Sub Women</option>
                    </select>
                </div>
                {/* collection */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Collection</label>
                    <input
                        type="text"
                        name="collection"
                        value={productData.collection}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. Summer 2025, Sportswear"
                    />
                </div>

                {/* colors  */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>
                        Colors (comma-seperated)
                    </label>
                    <input
                        type="text"
                        name='colors'
                        value={productData.colors.join(",")}
                        onChange={(e) => setProductData({
                            ...productData,
                            colors: e.target.value.split(",").map((color) => color.trim()),
                        })
                        }
                        placeholder="e.g. Blue, Red, Green"
                        required
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* img */}

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>

                    {/* File input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white p-2"
                    />

                    {/* Image preview grid */}
                    <div className="flex gap-4 mt-4 flex-wrap">
                        {productData.images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image.url}
                                    alt={image.altText || "Product Image"}
                                    onClick={() => setPreviewImage(image.url)} // open modal
                                    className="w-20 h-20 object-cover rounded-md shadow-md hover:scale-105 transition-transform cursor-pointer"
                                />

                                {/* Delete button */}
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
                        onClick={() => setPreviewImage(null)} // click background to close
                    >
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
                        />

                    </div>
                )}


                <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors'> Upload Product</button>

            </form>
        </div>
    )
}

export default ProductCreation