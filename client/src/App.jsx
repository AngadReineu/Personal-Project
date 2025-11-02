import { Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import HomePage from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Collection from "./pages/Collection";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirm from "./pages/OrderConfirm";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrderPage from "./pages/MyOrderPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProduct from "./components/Admin/EditProduct";
import OrderManagement from "./components/Admin/OrderManagement";
import ProductCreation from "./components/Admin/ProductCreation";
import ProtectedRoute from "./components/Common/ProtectedRoute";

function App() {


   return (
      <>
         <Toaster position="top-right" />
         <Routes>
            <Route path="/" element={<UserLayout />}>
               {/*User Layout*/}
               <Route index element={<HomePage />} />
               <Route path="login" element={<Login />} />
               <Route path="register" element={<Register />} />
               <Route path="profile" element={<Profile />} />
               <Route path="collections/:collection" element={<Collection />} />
               <Route path="product/:id" element={<ProductDetails />} />
               <Route path="checkout" element={<Checkout />} />
               <Route path="order-confirmation" element={<OrderConfirm />} />
               <Route path="order/:id" element={<OrderDetailsPage />} />
               <Route path="my-orders" element={<MyOrderPage />} />
            </Route>

            <Route path="/admin" element={<ProtectedRoute role="admin">
               <AdminLayout />
            </ProtectedRoute>}>
               {/*Admin Layout*/}
               <Route index element={<AdminHomePage />} />
               <Route path="users" element={<UserManagement />} />
               <Route path="products-management" element={<ProductManagement />} />
               <Route path="products" element={<ProductCreation />} />
               <Route path="products/:id/edit" element={<EditProduct />} />
               <Route path="orders" element={<OrderManagement />} />
            </Route>
            <Route>
               {/*retailer Layout*/}
            </Route>
         </Routes>
      </>

   )
}

export default App
