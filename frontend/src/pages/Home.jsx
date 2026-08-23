import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import productService from "../services/productService";


function Home() {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================
       LOAD PRODUCTS
    ========================= */

    useEffect(() => {

        const loadProducts = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await productService.getAllProducts();


                const data =
                    response?.data ??
                    response;


                const productList =
                    Array.isArray(data)
                        ? data
                        : data?.content ??
                          data?.products ??
                          [];


                setProducts(productList);

            } catch (err) {

                console.error(
                    "Home products error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load products."
                );

            } finally {

                setLoading(false);

            }

        };


        loadProducts();

    }, []);


    /* =========================
       PRODUCT SECTIONS
    ========================= */

    const recommendedProducts =
        products.slice(0, 4);


    const trendingProducts =
        products.slice(4, 8);


    return (

        <div className="marketplace">

            {/* =========================
                HERO
            ========================= */}

            <section className="hero-market">

                <div className="hero-text">

                    <div className="hero-badge">
                        🔥 TRENDING NOW
                    </div>

                    <h1>
                        New Trending
                        <br />
                        <strong>Summer Fashion</strong>
                    </h1>

                    <p>
                        Discover the latest styles and
                        exclusive collections made for you.
                    </p>

                    <Link
                        to="/products"
                        className="hero-button"
                    >
                        Shop Now →
                    </Link>

                </div>


                <div className="hero-visual">

                    <div className="circle-one"></div>

                    <div className="fashion-person">

                        <div className="person-head"></div>

                        <div className="person-body"></div>

                    </div>

                    <div className="discount">
                        20% OFF
                    </div>

                </div>

            </section>


            {/* =========================
                CATEGORIES
            ========================= */}

            <section className="market-section">

                <div className="section-title">

                    <div>

                        <h2>
                            Explore Categories
                        </h2>

                        <p>
                            Find everything you need
                        </p>

                    </div>

                    <Link to="/products">
                        View All →
                    </Link>

                </div>


                <div className="category-circles">

                    <Link to="/products?category=Electronics">

                        <div className="circle category-blue">
                            📱
                        </div>

                        <span>
                            Electronics
                        </span>

                    </Link>


                    <Link to="/products?category=Fashion">

                        <div className="circle category-pink">
                            👕
                        </div>

                        <span>
                            Fashion
                        </span>

                    </Link>


                    <Link to="/products?category=Home">

                        <div className="circle category-yellow">
                            🏠
                        </div>

                        <span>
                            Home
                        </span>

                    </Link>


                    <Link to="/products?category=Accessories">

                        <div className="circle category-green">
                            🎧
                        </div>

                        <span>
                            Accessories
                        </span>

                    </Link>


                    <Link to="/products?category=Sports">

                        <div className="circle category-purple">
                            👟
                        </div>

                        <span>
                            Sports
                        </span>

                    </Link>


                    <Link to="/products?category=Beauty">

                        <div className="circle category-orange">
                            💄
                        </div>

                        <span>
                            Beauty
                        </span>

                    </Link>

                </div>

            </section>


            {/* =========================
                RECOMMENDED PRODUCTS
            ========================= */}

            <section className="market-section">

                <div className="section-title">

                    <div>

                        <h2>
                            Recommended for You
                        </h2>

                        <p>
                            Products you might love
                        </p>

                    </div>

                    <Link to="/products">
                        View All →
                    </Link>

                </div>


                {loading ? (

                    <div className="loading-container">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading products...
                        </p>

                    </div>

                ) : error ? (

                    <div className="empty-products">
                        {error}
                    </div>

                ) : recommendedProducts.length > 0 ? (

                    <div className="product-grid">

                        {recommendedProducts.map(
                            (product) => (

                                <ProductCard
                                    key={
                                        product.id ??
                                        product.productId
                                    }
                                    product={product}
                                />

                            )
                        )}

                    </div>

                ) : (

                    <div className="empty-products">
                        No products available.
                    </div>

                )}

            </section>


            {/* =========================
                TRENDING BANNER
            ========================= */}

            <section className="trending-banner">

                <div>

                    <span>
                        LIMITED TIME OFFER
                    </span>

                    <h2>
                        Upgrade Your
                        <br />
                        Everyday Style
                    </h2>

                    <p>
                        Discover amazing deals
                        on selected products.
                    </p>

                    <Link to="/products">
                        Explore Deals →
                    </Link>

                </div>


                <div className="deal-products">

                    <div>🎧</div>
                    <div>⌚</div>
                    <div>👟</div>

                </div>

            </section>


            {/* =========================
                TRENDING PRODUCTS
            ========================= */}

            <section className="market-section">

                <div className="section-title">

                    <div>

                        <h2>
                            Trending Now
                        </h2>

                        <p>
                            Popular products this week
                        </p>

                    </div>

                    <Link to="/products">
                        View All →
                    </Link>

                </div>


                {loading ? (

                    <div className="loading-container">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading products...
                        </p>

                    </div>

                ) : error ? (

                    <div className="empty-products">
                        {error}
                    </div>

                ) : trendingProducts.length > 0 ? (

                    <div className="product-grid">

                        {trendingProducts.map(
                            (product) => (

                                <ProductCard
                                    key={
                                        product.id ??
                                        product.productId
                                    }
                                    product={product}
                                />

                            )
                        )}

                    </div>

                ) : (

                    <div className="empty-products">
                        No trending products available.
                    </div>

                )}

            </section>

        </div>
    );
}


export default Home;