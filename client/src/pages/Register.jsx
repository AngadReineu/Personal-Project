import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.webp";
import { registerUser } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slice/cartSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, loading } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            return setError("Password must be at least 6 characters long.");
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        dispatch(registerUser({ name, email, password }));
    };

    return (
        <div className="flex">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white p-8 rounded-lg border-gray-300 shadow-sm"
                >
                    <div className="flex justify-center mb-6">
                        <h2 className="text-xl font-medium">Website</h2>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Create Your Account!
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        Join our community to access exclusive products and a seamless shopping experience.
                    </p>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter your Name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter your Email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded pr-10"
                            placeholder="Enter your Password"
                            minLength={6}
                            required
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible size={22} />
                            ) : (
                                <AiOutlineEye size={22} />
                            )}
                        </span>

                        {password && password.length < 6 && (
                            <p className="text-red-500 text-sm mt-1">
                                Password must be at least 6 characters long.
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-semibold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded pr-10"
                            placeholder="Re-enter your Password"
                            required
                        />
                        <span
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-600 hover:text-gray-800"
                        >
                            {showConfirm ? (
                                <AiOutlineEyeInvisible size={22} />
                            ) : (
                                <AiOutlineEye size={22} />
                            )}
                        </span>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                    <button
                        type="submit"
                        className="w-full mt-4 bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                        {loading ? "loading..." : "Sign Up"}
                    </button>

                    <p className="mt-6 text-center text-sm">
                        Already have an account? 😎{" "}
                        <Link
                            to={`/login?redirect=${encodeURIComponent(redirect)}`}
                            className="text-blue-500"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div >

            {/* Right Image */}
            < div className="hidden md:block w-1/2 bg-gray-800" >
                <div className="h-full flex flex-col justify-center items-center">
                    <img
                        src={register}
                        alt="Register to Account"
                        className="h-[750px] w-full object-cover"
                    />
                </div>
            </div >
        </div >
    );
};

export default Register;
