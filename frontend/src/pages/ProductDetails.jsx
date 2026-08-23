import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import productService from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import reviewService from "../services/reviewService";


function ProductDetails() {

    const { productId } = useParams();

    const navigate = useNavigate();


    const {
        addToCart
    } = useCart();


    const {
        user,
        isAuthenticated
    } = useAuth();


    const [product, setProduct] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    const [quantity, setQuantity] =
        useState(1);


    const [adding, setAdding] =
        useState(false);


    const [added, setAdded] =
        useState(false);


    /*
     * Index of currently selected
     * media item.
     */
    const [selectedMediaIndex, setSelectedMediaIndex] =
        useState(0);

    const [reviews, setReviews] = useState([]);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");
    const [reviewError, setReviewError] = useState("");


    /* =========================
       LOAD PRODUCT
    ========================= */

    useEffect(() => {

        const loadProduct = async () => {

            if (!productId) {

                setError(
                    "Product ID is missing."
                );

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                const response =
                    await productService.getProductById(
                        productId
                    );


                const data =
                    response?.data ??
                    response;


                setProduct(data);

            } catch (err) {

                console.error(
                    "Product details error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load product."
                );

            } finally {

                setLoading(false);

            }

        };


        loadProduct();

    }, [productId]);


    useEffect(() => {
        const loadReviews = async () => {
            if (!productId) return;

            try {
                const data = await reviewService.getReviewsByProduct(productId);
                setReviews(Array.isArray(data) ? data : data?.content ?? data?.reviews ?? []);
            } catch (reviewLoadError) {
                console.warn("Unable to load product reviews:", reviewLoadError);
                setReviews([]);
            }
        };

        loadReviews();
    }, [productId]);

    const submitReview = async (event) => {
        event.preventDefault();

        const userId = user?.id ?? user?.userId;

        if (!isAuthenticated || !userId) {
            navigate("/login");
            return;
        }

        if (!reviewComment.trim()) {
            setReviewError("Please enter a review comment.");
            return;
        }

        try {
            setReviewLoading(true);
            setReviewError("");
            setReviewMessage("");

            const created = await reviewService.createReview({
                productId: Number(productId),
                userId: Number(userId),
                rating: Number(reviewRating),
                comment: reviewComment.trim()
            });

            setReviews(current => [created, ...current]);
            setReviewComment("");
            setReviewRating(5);
            setReviewMessage("Review submitted successfully.");
        } catch (reviewSubmitError) {
            setReviewError(reviewSubmitError.message || "Unable to submit review.");
        } finally {
            setReviewLoading(false);
        }
    };

    /* =========================
       QUANTITY
    ========================= */

    const increaseQuantity = () => {

        const stock =
            Number(
                product?.quantity ?? 0
            );


        setQuantity(
            (previous) =>
                Math.min(
                    previous + 1,
                    stock
                )
        );

    };


    const decreaseQuantity = () => {

        setQuantity(
            (previous) =>
                Math.max(
                    previous - 1,
                    1
                )
        );

    };


    /* =========================
       ADD TO CART
    ========================= */

    const handleAddToCart = async () => {

        if (!isAuthenticated) {

            navigate("/login");

            return;
        }


        try {

            setAdding(true);

            setAdded(false);

            setError("");


            await addToCart(
                product,
                quantity
            );


            setAdded(true);

        } catch (err) {

            console.error(
                "Add to cart error:",
                err
            );


            setError(
                err.message ||
                "Unable to add product to cart."
            );

        } finally {

            setAdding(false);

        }

    };


    /* =========================
       BUY NOW
    ========================= */

    const handleBuyNow = async () => {

        if (!isAuthenticated) {

            navigate("/login");

            return;
        }


        try {

            setAdding(true);

            setError("");


            await addToCart(
                product,
                quantity
            );


            navigate("/cart");

        } catch (err) {

            console.error(
                "Buy now error:",
                err
            );


            setError(
                err.message ||
                "Unable to add product to cart."
            );

        } finally {

            setAdding(false);

        }

    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="product-details-page">

                <div className="loading-container">

                    <div className="loading-spinner" />

                    <p>
                        Loading product...
                    </p>

                </div>

            </div>

        );

    }


    /* =========================
       ERROR
    ========================= */

    if (error && !product) {

        return (

            <div className="product-details-page">

                <div className="empty-products-page">

                    <div>
                        ⚠️
                    </div>

                    <h2>
                        Product Not Found
                    </h2>

                    <p>
                        {error}
                    </p>

                    <Link
                        to="/products"
                        className="primary-button"
                    >
                        Back to Products
                    </Link>

                </div>

            </div>

        );

    }


    if (!product) {
        return null;
    }


    /* =========================
       PRODUCT DATA
    ========================= */

    const id =
        product.id ??
        productId;


    const name =
        product.name ??
        "Product";


    const description =
        product.description ??
        "No description available.";


    const category =
        product.category ??
        "Product";


    const price =
        Number(
            product.price ?? 0
        );


    const stock =
        Number(
            product.quantity ?? 0
        );


    const outOfStock =
        stock <= 0;


    const reviewCount = reviews.length;
    const rating = reviewCount
        ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount
        : 0;


    /*
     * Your current backend does not
     * provide originalPrice yet.
     */
    const originalPrice =
        price;


    const discount = 0;


    /* =========================
       MEDIA
    ========================= */

    const media =
        Array.isArray(product.media)
            ? product.media
            : [];


    const selectedMedia =
        media[selectedMediaIndex] ??
        null;


    /* =========================
       PAGE
    ========================= */

    return (

        <div className="product-details-page">


            {/* =========================
                BREADCRUMB
            ========================= */}

            <div className="breadcrumb">

                <Link to="/">
                    Home
                </Link>

                {" / "}

                <Link to="/products">
                    Products
                </Link>

                {" / "}

                <span>
                    {name}
                </span>

            </div>


            {error && (

                <div className="product-error">
                    {error}
                </div>

            )}


            <div className="product-details">


                {/* =================================================
                    PRODUCT MEDIA
                ================================================= */}

                <div className="details-media">


                    {/* =========================
                        MAIN MEDIA
                    ========================= */}

                    <div className="details-image">


                        {discount > 0 && (

                            <span className="details-sale">
                                -{discount}%
                            </span>

                        )}


                        {selectedMedia ? (

                            selectedMedia.mediaType === "IMAGE" ? (

                                <img
                                    src={
                                        selectedMedia.url
                                    }
                                    alt={name}
                                />

                            ) : (

                                <video
                                    src={
                                        selectedMedia.url
                                    }
                                    controls
                                    preload="metadata"
                                />

                            )

                        ) : (

                            <div className="details-image-placeholder">
                                🛍️
                            </div>

                        )}

                    </div>


                    {/* =========================
                        MEDIA THUMBNAILS
                    ========================= */}

                    {media.length > 0 && (

                        <div className="media-thumbnails">

                            {media.map(
                                (item, index) => (

                                    <button
                                        key={item.id}
                                        type="button"
                                        className={
                                            selectedMediaIndex === index
                                                ? "media-thumbnail active"
                                                : "media-thumbnail"
                                        }
                                        onClick={() =>
                                            setSelectedMediaIndex(
                                                index
                                            )
                                        }
                                    >

                                        {item.mediaType === "IMAGE" ? (

                                            <img
                                                src={
                                                    item.url
                                                }
                                                alt={
                                                    item.fileName
                                                }
                                            />

                                        ) : (

                                            <div className="video-thumbnail">

                                                ▶

                                            </div>

                                        )}

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <div className="details-info">


                    {/* CATEGORY */}

                    <div className="details-category">
                        {category}
                    </div>


                    {/* NAME */}

                    <h1>
                        {name}
                    </h1>


                    {/* RATING */}

                    <div className="details-rating">

                        <span>

                            {"★".repeat(
                                Math.round(rating)
                            )}

                            {"☆".repeat(
                                Math.max(
                                    0,
                                    5 -
                                    Math.round(
                                        rating
                                    )
                                )
                            )}

                        </span>


                        {reviewCount > 0 && (

                            <>

                                <strong>
                                    {rating.toFixed(1)}
                                </strong>

                                <small>
                                    ({reviewCount} reviews)
                                </small>

                            </>

                        )}

                    </div>


                    {/* PRICE */}

                    <div className="details-price">

                        <strong>
                            ₹{price.toFixed(2)}
                        </strong>


                        {originalPrice > price && (

                            <del>
                                ₹
                                {originalPrice.toFixed(
                                    2
                                )}
                            </del>

                        )}


                        {discount > 0 && (

                            <span>
                                {discount}% OFF
                            </span>

                        )}

                    </div>


                    {/* DESCRIPTION */}

                    <p className="details-description">
                        {description}
                    </p>


                    {/* STOCK */}

                    <div className="product-stock">

                        {outOfStock ? (

                            <span>
                                Out of stock
                            </span>

                        ) : (

                            <>

                                <span>
                                    ✓
                                </span>

                                <span>
                                    {stock} items available
                                </span>

                            </>

                        )}

                    </div>


                    {/* QUANTITY */}

                    {!outOfStock && (

                        <div className="option-section">

                            <h3>
                                Quantity
                            </h3>


                            <div className="quantity">

                                <button
                                    type="button"
                                    onClick={
                                        decreaseQuantity
                                    }
                                    disabled={
                                        quantity <= 1
                                    }
                                >
                                    −
                                </button>


                                <span>
                                    {quantity}
                                </span>


                                <button
                                    type="button"
                                    onClick={
                                        increaseQuantity
                                    }
                                    disabled={
                                        quantity >= stock
                                    }
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    )}


                    {/* ACTIONS */}

                    <div className="details-actions">

                        <button
                            type="button"
                            className="add-cart"
                            onClick={
                                handleAddToCart
                            }
                            disabled={
                                outOfStock ||
                                adding
                            }
                        >

                            {adding
                                ? "Adding..."
                                : added
                                    ? "Added ✓"
                                    : "Add to Cart"}

                        </button>


                        <button
                            type="button"
                            className="buy-now"
                            onClick={
                                handleBuyNow
                            }
                            disabled={
                                outOfStock ||
                                adding
                            }
                        >
                            Buy Now
                        </button>

                    </div>


                    {/* DELIVERY */}

                    <div className="delivery-info">


                        <div>

                            <span>
                                🚚
                            </span>

                            <div>

                                <strong>
                                    Fast Delivery
                                </strong>

                                <p>
                                    Get your order
                                    delivered quickly.
                                </p>

                            </div>

                        </div>


                        <div>

                            <span>
                                🔒
                            </span>

                            <div>

                                <strong>
                                    Secure Payment
                                </strong>

                                <p>
                                    Your payment
                                    information is secure.
                                </p>

                            </div>

                        </div>


                        <div>

                            <span>
                                ↩️
                            </span>

                            <div>

                                <strong>
                                    Easy Returns
                                </strong>

                                <p>
                                    Simple and convenient
                                    return process.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                EXTRA INFORMATION
            ================================================= */}

            <div className="product-extra-section">

                <div className="section-title">

                    <div>

                        <h2>
                            Product Information
                        </h2>

                        <p>
                            More details about this
                            product.
                        </p>

                    </div>

                </div>


                <div className="product-extra-content">

                    <p>
                        {description}
                    </p>

                </div>

            </div>


            <div className="product-extra-section">
                <div className="section-title">
                    <div>
                        <h2>Customer Reviews</h2>
                        <p>{reviewCount} review{reviewCount === 1 ? "" : "s"} for this product</p>
                    </div>
                </div>

                {isAuthenticated ? (
                    <form onSubmit={submitReview} className="auth-form" style={{ marginBottom: "30px" }}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Rating</label>
                                <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}>
                                    {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} / 5</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <input value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Share your experience" maxLength={1000} />
                            </div>
                        </div>
                        {reviewError && <div className="products-error">{reviewError}</div>}
                        {reviewMessage && <div className="profile-success">{reviewMessage}</div>}
                        <button className="primary-button" disabled={reviewLoading} type="submit">
                            {reviewLoading ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                ) : (
                    <p className="product-extra-content">Please login to write a review.</p>
                )}

                {reviews.length === 0 ? (
                    <div className="empty-products">No reviews yet. Be the first to review this product.</div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review, index) => {
                            const reviewRatingValue = Math.max(0, Math.min(5, Number(review.rating || 0)));
                            return (
                                <div className="review-card" key={review.id ?? index}>
                                    <div className="review-card-header">
                                        <div className="review-avatar">★</div>
                                        <div>
                                            <strong>{review.userName ?? `Customer #${review.userId ?? ""}`}</strong>
                                            <div className="review-stars">
                                                {"★".repeat(reviewRatingValue)}{"☆".repeat(5 - reviewRatingValue)}
                                            </div>
                                        </div>
                                    </div>
                                    <p>{review.comment}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

    );

}


export default ProductDetails;