import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";
import OrderSuccess from "../pages/OrderSuccess";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Profile from "../pages/Profile";
import Reviews from "../pages/Reviews";
import Notifications from "../pages/Notifications";
import Wishlist from "../pages/Wishlist";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminCreateProduct from "../pages/admin/AdminCreateProduct";
import AdminEditProduct from "../pages/admin/AdminEditProduct";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminInventory from "../pages/admin/AdminInventory";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminShipping from "../pages/admin/AdminShipping";

function Admin({ children }) {
    return <AdminRoute>{children}</AdminRoute>;
}

function AppRoutes() {
    return (
        <Routes>
            {/* CUSTOMER ROUTES - unchanged */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

            {/* ADMIN ROUTES */}
            <Route path="/admin" element={<Admin><AdminDashboard /></Admin>} />
            <Route path="/admin/products" element={<Admin><AdminProducts /></Admin>} />
            <Route path="/admin/products/create" element={<Admin><AdminCreateProduct /></Admin>} />
            <Route path="/admin/products/:id/edit" element={<Admin><AdminEditProduct /></Admin>} />
            <Route path="/admin/users" element={<Admin><AdminUsers /></Admin>} />
            <Route path="/admin/orders" element={<Admin><AdminOrders /></Admin>} />
            <Route path="/admin/inventory" element={<Admin><AdminInventory /></Admin>} />
            <Route path="/admin/payments" element={<Admin><AdminPayments /></Admin>} />
            <Route path="/admin/shipping" element={<Admin><AdminShipping /></Admin>} />
        </Routes>
    );
}

export default AppRoutes;
