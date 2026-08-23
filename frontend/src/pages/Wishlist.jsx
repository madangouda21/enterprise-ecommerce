import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../components/Loading";
import wishlistService from "../services/wishlistService";

function Wishlist() {

    const [wishlist, setWishlist] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================
       LOAD WISHLIST
    ========================= */

    useEffect(() => {

        const loadWishlist = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await wishlistService.getWishlist();

                const items =
                    Array.isArray(data)
                        ? data
                        : data?.content || [];

                setWishlist(items);

            } catch (err) {

                console.error(
                    "Wishlist loading error:",
                    err
                );

                setError(
                    "Unable to load your wishlist."
                );

            } finally {

                setLoading(false);

            }

        };


        loadWishlist();

    }, []);


    /* =========================
       REMOVE
    ========================= */

    const handleRemove = async (item) => {

        const productId =
            item.productId ??
            item.product?.id ??
            item.id;

        if (!productId) {
            return;
        }

        try {

            await wishlistService.removeFromWishlist(
                productId
            );

            setWishlist((previous) =>
                previous.filter((wishlistItem) => {

                    const id =
                        wishlistItem.productId ??
                        wishlistItem.product?.id ??
                        wishlistItem.id;

                    return id !== productId;

                })
            );

        } catch (err) {

            console.error(
                "Remove wishlist item error:",
                err
            );

            setError(
                "Unable to remove this product."
            );

        }

    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (
            <div className="wishlist-page">

                <Loading
                    message="Loading wishlist..."
                />

            </div>
        );

    }


    return (

        <div className="wishlist-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="wishlist-header">

                <div>

                    <h1>
                        My Wishlist
                    </h1>

                    <p>
                        Products you saved for later.
                    </p>

                </div>

                <Link
                    to="/products"
                    className="secondary-button"
                >
                    Continue Shopping
                </Link>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="wishlist-error">
                    ⚠️ {error}
                </div>

            )}


            {/* =========================
                EMPTY
            ========================= */}

            {wishlist.length === 0 ? (

                <div className="empty-wishlist">

                    <div>
                        ♡
                    </div>

                    <h2>
                        Your Wishlist is Empty
                    </h2>

                    <p>
                        Save products you love and
                        find them here later.
                    </p>

                    <Link
                        to="/products"
                        className="primary-button"
                    >
                        Explore Products
                    </Link>

                </div>

            ) : (

                /* =========================
                   PRODUCTS
                ========================= */

                <div className="wishlist-grid">

                    {wishlist.map((item, index) => {

                        const product =
                            item.product ??
                            item;

                        const productId =
                            item.productId ??
                            product.id;

                        const name =
                            product.name ??
                            product.productName ??
                            "Product";

                        const imageMedia =
                            Array.isArray(product.media)
                                ? product.media.find(item => String(item.mediaType).toUpperCase() === "IMAGE")
                                : null;

                        const image =
                            imageMedia?.url ??
                            product.imageUrl ??
                            product.image ??
                            "";

                        const price =
                            Number(
                                product.price ??
                                item.price ??
                                0
                            );


                        return (

                            <div
                                className="wishlist-card"
                                key={
                                    productId ??
                                    index
                                }
                            >

                                {/* IMAGE */}

                                <Link
                                    to={
                                        productId
                                            ? `/products/${productId}`
                                            : "/products"
                                    }
                                    className="wishlist-image"
                                >

                                    {image ? (

                                        <img
                                            src={image}
                                            alt={name}
                                        />

                                    ) : (

                                        <span>
                                            📦
                                        </span>

                                    )}

                                </Link>


                                {/* INFORMATION */}

                                <div className="wishlist-info">

                                    <Link
                                        to={
                                            productId
                                                ? `/products/${productId}`
                                                : "/products"
                                        }
                                    >

                                        <h3>
                                            {name}
                                        </h3>

                                    </Link>


                                    {product.category && (

                                        <p>
                                            {product.category?.name ??
                                                product.category}
                                        </p>

                                    )}


                                    <div className="wishlist-price">

                                        <strong>
                                            ₹
                                            {price.toFixed(2)}
                                        </strong>

                                    </div>


                                    <div className="wishlist-actions">

                                        <Link
                                            to={
                                                productId
                                                    ? `/products/${productId}`
                                                    : "/products"
                                            }
                                            className="primary-button"
                                        >
                                            View Product
                                        </Link>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemove(
                                                    item
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );
}

export default Wishlist;