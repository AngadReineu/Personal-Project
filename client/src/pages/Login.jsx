import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.webp"
import { loginUser } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { mergeCart } from "../redux/slice/cartSlice";




const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, loading, error } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart)

    //get the redirect parameter and check if its checkout or something
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products?.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }))

    }
    return (
        <div className="flex">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-300 shadow-sm">
                    <div className="flex justify-center mb-6">
                        <h2 className="text-xl font-medium"> Website</h2>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6 " > Welcome Back 👋 </h2>
                    <p className="text-center mb-6 text-gray-600">
                        Login to access your account and continue shopping
                    </p>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter your Email" />
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}  // 👈 this toggles visibility
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded pr-10"
                            placeholder="Enter your Password"
                            minLength={6}
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)} // 👈 toggles state
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible size={22} />
                            ) : (
                                <AiOutlineEye size={22} />
                            )}
                        </span>
                        {/* {password && password.length < 6 && (
                            <p className="text-red-500 text-sm mt-1">
                                Password must be at least 6 characters long.
                            </p>
                        )} */}
                    </div>

                    {error && (
                        <p className="text-center text-md text-red-500 mb-4">
                            {error.message || "Invalid credentials please try again!"}
                        </p>
                    )}
                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="block text-sm font-semibold mb-2 text-blue-500 hover:text-blue-700 hover:underline transition cursor-pointer">Forgot Password?</Link>
                    </div>
                    <button type="submit" className=" w-full mt-4 bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer">
                        {loading ? "loading..." : "Sign In"}
                    </button>
                    <p className="mt-6 text-center text-sm">
                        Don't have an account?😢{" "}
                        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500 ">
                            Register Now</Link>
                    </p>
                </form>
            </div>
            {/* mobile hidden screen  */}
            <div className="hidden md:block w-1/2 bg-gray-800">
                <div className="h-full flex flex-col justify-center items-center">
                    <img
                        src={login}
                        alt="Login to Account"
                        className="h-[750px] w-full object-cover" />
                </div>
            </div>
        </div>
    )
}

export default Login