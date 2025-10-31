

import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

const RazorPay = ({amount, shippingAddress, onSuccess, onError }) => {
    const { error, isLoading, Razorpay } = useRazorpay();
    const handleRazorPay = () => {
        const options = {
            key: "rzp_test_RWsEZboSRTSAtp", // ⚠️ Replace with your Razorpay Test Key ID
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            name: "My E-Commerce Store",
            description: "Test Transaction",
            image: "https://your-logo-url.com/logo.png", // optional
            order_id: "order_test_123456", // mock order id for testing
            handler: function (response) {
                alert(`✅ Payment successful!\nPayment ID: ${response.razorpay_payment_id}`);
                console.log("Razorpay Response:", response);
            },
            prefill: {
                name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                email: "user1@gmail.com",
                contact: shippingAddress.phoneNumber,
            },
            theme: {
                color: "#000000",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };
    return (
        <button
      type="button"
      onClick={handleRazorPay}
      className="w-full bg-black hover:bg-blue-500 hover:text-white cursor-pointer transition hover:scale-105 text-white py-3 rounded"
    >
      Pay with RazorPay ₹{amount}
    </button>
    )
}

export default RazorPay