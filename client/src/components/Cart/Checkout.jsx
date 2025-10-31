import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RazorPay from "./RazorPay";

const cart = {
    products: [
        {
            name: "T-shirt",
            color: "Red",
            size: "L",
            price: 15,
            image: "https://picsum.photos/200?random=1",
        },
        {
            name: "jeans",
            color: "blue",
            size: "L",
            price: 25,
            image: "https://picsum.photos/200?random=2",
        },
    ],
    totalPrice: 185,
};

const Checkout = () => {
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        city: "",
        address: "",
        postalCode: "",
        country: "",
        phoneNumber: "",
    });
    const [checkOutId, setCheckOutId] = useState(null);


    const handleFormSubmitCheckOut = (e) => {
        e.preventDefault();
        setCheckOutId(123); // simulate checkout ID
    };

    const handleRazorPaySuccess = (details) => {
        console.log("Payments Successful", details);
        navigate("/order-confirmation")

    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* Left section */}
            <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-2xl uppercase mb-6 font-semibold">Checkout</h2>

                <form onSubmit={handleFormSubmitCheckOut}>
                    {/* Contact */}
                    <h3 className="text-lg mb-4 font-medium">Contact Details</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value="user1@gmail.com"
                            className="w-full p-2 border rounded bg-gray-100"
                            disabled
                        />
                    </div>

                    {/* Delivery */}
                    <h3 className="text-lg mb-4 font-medium">Delivery</h3>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        firstName: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        lastName: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    address: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        city: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Postal Code</label>
                            <input
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        postalCode: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Country</label>
                        <input
                            type="text"
                            value={shippingAddress.country}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    country: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            value={shippingAddress.phoneNumber}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    phoneNumber: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mt-6">
                        {!checkOutId ? (
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded"
                            >
                                Continue to Payment
                            </button>
                        ) : (
                            <div>
                                <h3 className="text-lg mb-4">Pay with RazorPay</h3>
                                {/* razor pay */}

                                <RazorPay
                                    amount={cart.totalPrice}
                                    shippingAddress={shippingAddress}
                                    onSuccess={handleRazorPaySuccess}
                                    onError={(err) => alert("Payment failed")}
                                />

                                {/* <button
                  type="button"
                  onClick={handleRazorPay}
                  className="w-full bg-green-600 text-white py-3 rounded"
                >
                  Pay ₹{cart.totalPrice}
                </button> */}
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Right section */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="border-t border-gray-300 py-4 mb-4">
                    {cart.products.map((item, index) => (
                        <div key={index} className="flex items-start justify-between py-2 border-b border-gray-300 mb-4">
                            <div className="flex items-start ">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-24 object-cover rounded mr-4"
                                />
                                <div>
                                    <h3 className="font-medium text-md">{item.name}</h3>
                                    <p className="text-md text-gray-500">
                                        {item.color} | {item.size}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xl">₹{item.price?.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className=" flex justify-between items-center mb-4 font-semibold text-lg">
                   <p>SubTotal</p> 
                   <p>₹{cart.totalPrice?.toLocaleString()}</p>
                </div>
                    <div className="flex justify-between items-center font-semibold text-lg">
                        <p>Shipping</p>
                        <p>Free</p>
                    </div>
                    <div className="flex justify-between items-center text-lg mt-4 border-t font-semibold border-gray-300 pt-4">
                        <p>Total:</p>
                        <p> ₹{cart.totalPrice?.toLocaleString()}</p>

                    </div>
            </div>
        </div>
    );
};

export default Checkout;
