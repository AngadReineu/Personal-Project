import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { createCheckout } from "../../redux/slice/checkoutSilce";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

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

    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);

    // ✅ Step 1: Submit checkout form
    const handleFormSubmitCheckOut = async (e) => {
        e.preventDefault();

        if (cart && cart.products.length > 0) {
            const response = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress,
                    paymentMethod: "RazorPay",
                    totalPrice: cart.totalPrice,
                })
            );

            if (response.payload && response.payload._id) {
                setCheckOutId(response.payload._id);
            }
        }
    };

    // ✅ Step 2: Open Razorpay checkout
    const handlePayment = async () => {
        try {
            // ✅ Step 1: Create order from backend
            const token = localStorage.getItem("userToken"); // make sure this exists
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/razorpay/create-order`,
                { amount: cart.totalPrice },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // ✅ Step 2: Open Razorpay checkout
            const options = {
                key: "rzp_test_RWsEZboSRTSAtp", // your Razorpay key
                amount: data.amount,
                currency: data.currency,
                name: "My E-Commerce Store",
                description: "Order Payment",
                order_id: data.id, // backend order ID
                prefill: {
                    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                    email: user?.email,
                    contact: shippingAddress.phoneNumber,
                },
                theme: { color: "#000000" },
                handler: async (response) => {
                    // ✅ Step 3: Payment successful — update order status in backend
                    await handleRazorPaySuccess(response);
                },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error("Razorpay Error:", error);
        }
    };

    // ✅ Step 3: On payment success, update checkout as paid
    const handleRazorPaySuccess = async (details) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkOutId}/pay`,
                {
                    paymentStatus: "paid",
                    paymentDetails: details,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            // console.log("🧾 Sending payment details to backend:", details)
            await handleFinalizeCheckout(checkOutId);
        } catch (error) {
            console.error(error);
            alert("Failed to finalize payment");
        }
    };

    // ✅ Step 4: Finalize checkout and redirect
    const handleFinalizeCheckout = async (checkOutId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkOutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );

            navigate("/order-confirmation");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <p>Loading Cart...</p>;
    if (error) return <p>Error occurred... {error}</p>;
    if (!cart || !cart.products || cart.products.length === 0)
        return <p>The Cart is Empty!</p>;

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
                            value={user ? user.email : ""}
                            className="w-full p-2 border rounded bg-gray-100"
                            disabled
                        />
                    </div>

                    {/* Delivery fields */}
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
                            <button
                                type="button"
                                onClick={handlePayment}
                                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
                            >
                                Pay with RazorPay ₹{cart.totalPrice}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Right section */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="border-t border-gray-300 py-4 mb-4">
                    {cart.products.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between py-2 border-b border-gray-300 mb-4"
                        >
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
                <div className="flex justify-between items-center mb-4 font-semibold text-lg">
                    <p>SubTotal</p>
                    <p>₹{cart.totalPrice?.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg">
                    <p>Shipping</p>
                    <p>Free</p>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 border-t font-semibold border-gray-300 pt-4">
                    <p>Total:</p>
                    <p>₹{cart.totalPrice?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
