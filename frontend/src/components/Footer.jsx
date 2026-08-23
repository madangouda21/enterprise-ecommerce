import { Link } from "react-router-dom";

function Footer() {

    return (

        <footer className="footer">

            {/* =========================
                MAIN FOOTER
            ========================= */}

            <div className="footer-container">

                {/* BRAND */}

                <div className="footer-column footer-brand">

                    <Link
                        to="/"
                        className="footer-logo"
                    >
                        Enterprise<span>Shop</span>
                    </Link>

                    <p>
                        Your trusted online marketplace
                        for quality products, great prices,
                        and reliable delivery.
                    </p>

                </div>


                {/* SHOP */}

                <div className="footer-column">

                    <h3>
                        Shop
                    </h3>

                    <Link to="/products">
                        All Products
                    </Link>

                    <Link to="/products?category=Electronics">
                        Electronics
                    </Link>

                    <Link to="/products?category=Fashion">
                        Fashion
                    </Link>

                    <Link to="/products?category=Home">
                        Home
                    </Link>

                </div>


                {/* ACCOUNT */}

                <div className="footer-column">

                    <h3>
                        Account
                    </h3>

                    <Link to="/profile">
                        My Profile
                    </Link>

                    <Link to="/orders">
                        My Orders
                    </Link>

                    <Link to="/cart">
                        Shopping Cart
                    </Link>

                    <Link to="/notifications">
                        Notifications
                    </Link>

                </div>


                {/* SUPPORT */}

                <div className="footer-column">

                    <h3>
                        Support
                    </h3>

                    <Link to="/products">
                        Help Center
                    </Link>

                    <Link to="/products">
                        Shipping Information
                    </Link>

                    <Link to="/products">
                        Returns
                    </Link>

                    <Link to="/products">
                        Contact Us
                    </Link>

                </div>

            </div>


            {/* =========================
                BOTTOM
            ========================= */}

            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} EnterpriseShop.
                    All rights reserved.
                </p>

                <div>

                    <Link to="/">
                        Privacy Policy
                    </Link>

                    <Link to="/">
                        Terms & Conditions
                    </Link>

                </div>

            </div>

        </footer>

    );
}

export default Footer;