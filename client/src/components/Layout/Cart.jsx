
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";




function Cart({ draw, setDraw, toggleCartDrawer }) {

    const navigate = useNavigate();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart)
    const userId = user ? user._id : null;
    const handleCheckOut = () => {
        toggleCartDrawer();
        if (!user) {
            navigate("/login?redirect=checkout");

        } else {
            navigate("/checkout");
        }
    }



    return (
        <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50
            ${draw ? "translate-x-0" : "translate-x-full"}`}>
            {/* close button */}
            <div className="flex justify-end p-4">
                <button onClick={toggleCartDrawer}>
                    <IoMdClose className="h-6 w-6 text-gray-600" />
                </button>
            </div>
            {/* cart content with scollable area */}
            <div className="flex-grow p-4 overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4"> yo cart</h2>
                {/* coponent for cart  */}
                {
                    cart && cart?.products?.length > 0 ? (<CartContent cart={cart} userId={userId} guestId={guestId} />) : (<p> Your Cart is Empty!</p>)
                }

            </div>


            {/* ?checkoutbutton */}
            <div className="p-4 bg-white sticky bottom-0">
                {cart && cart?.products?.length > 0 && (

                    <>
                        <p className="text-right text-lg font-semibold mb-2">
                            Total: ${cart.totalPrice?.toLocaleString() || 0}
                        </p>
                        <button onClick={handleCheckOut} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">Checkout</button>
                        <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
                            Shipping,taxes and discount codes calculated at the chekcout.
                        </p>
                    </>
                )}


            </div>
        </div>
    );
}

export default Cart;