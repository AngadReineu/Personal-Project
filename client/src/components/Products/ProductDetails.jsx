import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";


const similarProducts=[
    {
        _id:1,
        name:"product 1",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=1"}]
    },
    {
        _id:2,
        name:"product 2",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=2"}]
    },
    {
        _id:3,
        name:"product 3",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=3"}]
    },
    {
        _id:4,
        name:"product 4",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=4"}]
    },
];

const selectedProducts = {
    name: "Car dummy ",
    price: 120,
    originalPrice: 150,
    description: "perfect for any occasion",
    brand: "Lambo",
    material: "carbon fiber",
    sizes: ["S", "M", "L", "XL"],
    color: ["Red", "Black"],
    images: [{
        url: "https://picsum.photos/500/500?random=1",
        altText: "Stlyish Car 1"
    },
    {
        url: "https://picsum.photos/500/500?random=2",
        altText: "Stlyish Car 2"
    },],
}
function ProductDetails() {
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);


    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Please Select the Size and Color before adding to Cart", {
                duration: 1000,
            });
            return;
        }

        setIsButtonDisabled(true);

        setTimeout(() => {
            toast.success("Product Added to Cart", {
                duration: 1000,
            });
            setIsButtonDisabled(false);
        }, 500)
    }


    useEffect(() => {
        if (selectedProducts?.images?.length > 0) {
            setMainImage(selectedProducts.images[0].url)
        }
    }, [selectedProducts])

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                <div className="flex flex-col md:flex-row">  {/*this is where content goes*/}
                    {/* left thumbnails */}
                    <div className="hidden md:flex flex-col space-y-4 mr-6">
                        {
                            selectedProducts.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnails ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))
                        }
                    </div>
                    {/* main img */}
                    <div className="md:w-1/2">
                        <div className="mb-4">
                            <img
                                src={mainImage || "https://picsum.photos/500/500?random=1"}
                                alt="Main Product"
                                className="w-full h-auto object-cover rounded-lg"

                            />
                        </div>
                    </div>
                    {/* mobile version ke liye */}
                    <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                        {selectedProducts.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.altText || `Thumbnail ${index}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                                onClick={() => setMainImage(image.url)}
                            />
                        ))}
                    </div>
                    {/* rignt section */}

                    <div className="md:w-1/2 md:ml-10">
                        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                            {selectedProducts.name}
                        </h1>
                        <p className="text-lg text-gray-600 mb-1 line-through">
                            {selectedProducts.originalPrice && `${selectedProducts.originalPrice}`}
                        </p>
                        <p className="text-xl text-gray-500 mb-2">
                            ${selectedProducts.price}
                        </p>
                        <p className="text-gray-600 mb-4">
                            {selectedProducts.description}
                        </p>
                        <div className="mb-4">
                            <p className="text-gray-700">
                                Color:
                            </p>
                            <div className="flex gap-2 mt-2">
                                {selectedProducts.color.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border ${selectedColor === color ? "border-4 border-black" : "border-gray-300"}`}
                                        style={{
                                            backgroundColor: color.toLowerCase(),
                                            filter: "brightness(0.5)"
                                        }}>

                                    </button>
                                ))}

                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700"> Size:</p>
                            <div className="flex gap-2 mt-2">
                                {
                                    selectedProducts.sizes.map((sizes) => (
                                        <button
                                            key={sizes}
                                            onClick={() => setSelectedSize(sizes)}
                                            className={`px-4 py-2 rounded border ${selectedSize === sizes ? "bg-black text-white" : null}`} >
                                            {sizes}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">
                                Quantity
                            </p>
                            <div className=" flex items-center space-x-4 mt-2">
                                <button
                                    onClick={() => handleQuantityChange("minus")}
                                    className="px-2 py-1 bg-gray-200 rounded text-lg">-</button>
                                <span className="text-lg"> {quantity}</span>
                                <button onClick={() => handleQuantityChange("plus")} className="px-2 py-1 bg-gray-200 rounded text-lg">+</button>
                            </div>

                        </div>

                        <button onClick={handleAddToCart}
                            disabled={isButtonDisabled}
                            className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"}`}>{isButtonDisabled ? "Adding...." : "ADD TO CART"}</button>
                        <div className="mt-10 text-gray-700">
                            <h3 className="text-xl font-bold mb-4">Characteristics</h3>
                            <table className="w-full text-left text-sm text-gray-600">
                                <tbody>
                                    <tr>
                                        <td className="py-1">Brand</td>
                                        <td className="py-1">{selectedProducts.brand}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 capitalize">material</td>
                                        <td className="py-1 capitalize">{selectedProducts.material}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-20 ">
                    <h2 className="text-2xl text-center font-medium mb-4">
                       You May Also Like              
                    </h2>
                    <ProductGrid products={similarProducts}/>
                </div>

            </div>

        </div>
    );
}

export default ProductDetails;