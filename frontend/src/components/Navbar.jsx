import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const isAdmin = user?.role === "ROLE_ADMIN";

    const getUserName = () => {
        const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
        return fullName || user?.name || user?.username || user?.email || "Account";
    };

    const handleLogout = () => {
        setShowAccountMenu(false);
        logout();
        navigate("/login");
    };

    return (
        <header className={`navbar ${isAdmin ? "admin-navbar" : ""}`}>
            <Link to={isAdmin ? "/admin" : "/"} className="logo">Enterprise<span>Shop</span></Link>

            {isAdmin ? (
                <nav className="nav-links admin-nav-links">
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/admin/products">Products</Link>
                    <Link to="/admin/users">Users</Link>
                    <Link to="/admin/orders">Orders</Link>
                    <Link to="/admin/inventory">Inventory</Link>
                    <Link to="/admin/payments">Payments</Link>
                    <Link to="/admin/shipping">Shipping</Link>
                </nav>
            ) : (
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/orders">Orders</Link>
                </nav>
            )}

            {!isAdmin && <div className="search"><span className="search-icon">🔍</span><input placeholder="Search products..." /><button type="button">Search</button></div>}

            <div className="nav-actions">
                {!isAdmin && <Link to="/notifications" className="nav-icon-button">🔔</Link>}
                {!isAdmin && <Link to="/cart" className="nav-icon-button">🛒</Link>}
                <div className="nav-divider" />

                {isAuthenticated ? (
                    <div className="nav-user-wrapper">
                        <button className="nav-user" type="button" onClick={() => setShowAccountMenu(v => !v)}>
                            <span className="nav-avatar">{isAdmin ? "A" : "👤"}</span>
                            <span className="nav-user-name">{getUserName()}</span>
                            <span className={`nav-user-arrow ${showAccountMenu ? "arrow-open" : ""}`}>▾</span>
                        </button>

                        {showAccountMenu && (
                            <div className="account-dropdown">
                                <div className="account-dropdown-header"><div className="account-dropdown-avatar">{isAdmin ? "A" : "👤"}</div><div><strong>{getUserName()}</strong><small>{user?.email || ""}</small></div></div>
                                <div className="account-dropdown-divider" />
                                {isAdmin ? <>
                                    <Link to="/admin" onClick={() => setShowAccountMenu(false)}>📊 <span>Admin Dashboard</span></Link>
                                    <Link to="/admin/products" onClick={() => setShowAccountMenu(false)}>📦 <span>Manage Products</span></Link>
                                    <Link to="/admin/products/create" onClick={() => setShowAccountMenu(false)}>＋ <span>Add Product</span></Link>
                                    <Link to="/admin/orders" onClick={() => setShowAccountMenu(false)}>🧾 <span>Manage Orders</span></Link>
                                </> : <>
                                    <Link to="/profile" onClick={() => setShowAccountMenu(false)}>👤 <span>My Profile</span></Link>
                                    <Link to="/orders" onClick={() => setShowAccountMenu(false)}>📦 <span>My Orders</span></Link>
                                    <Link to="/notifications" onClick={() => setShowAccountMenu(false)}>🔔 <span>Notifications</span></Link>
                                </>}
                                <div className="account-dropdown-divider" />
                                <button className="dropdown-logout" onClick={handleLogout}>🚪 <span>Logout</span></button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="nav-auth"><Link to="/login" className="login-button">Login</Link><Link to="/register" className="nav-register">Register</Link></div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
