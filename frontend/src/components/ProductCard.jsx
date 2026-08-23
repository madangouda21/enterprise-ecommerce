import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PRODUCT_SERVICE_URL =
    import.meta.env.VITE_PRODUCT_SERVICE_URL ||
    "http://localhost:8083";

function ProductCard({ product }) {

    const {
        addToCart
    } = useCart();

    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const productId =
        product?.id ??
        product?.productId;


    const name =
        product?.name ??
        product?.productName ??
        "Product";


    const price =
        Number(product?.price ?? 0);


    const category =
        product?.category?.name ??
        product?.categoryName ??
        product?.category ??
        "";


    /* =========================
       FIND PRODUCT IMAGE
    ========================= */

    const imageMedia =
        product?.media?.find(
            (media) =>
                String(
                    media?.mediaType ?? ""
                ).toUpperCase() === "IMAGE"
        );


    let image =
        imageMedia?.url ??
        product?.imageUrl ??
        product?.image ??
        product?.productImage ??
        "";


    /* =========================
       HANDLE IMAGE URL
    ========================= */

    if (
        image &&
        !image.startsWith("http")
    ) {

        image =
            `${PRODUCT_SERVICE_URL}${
                image.startsWith("/")
                    ? image
                    : `/${image}`
            }`;

    }


    /* =========================
       ADD TO CART
    ========================= */

    const handleAddToCart = async (event) => {

        event.preventDefault();

        event.stopPropagation();


        try {

            setAdding(true);

            setMessage("");

            setError("");


            await addToCart(
                product,
                1
            );


            setMessage(
                "✓ Added to cart"
            );


            setTimeout(() => {

                setMessage("");

            }, 2000);


        } catch (err) {

            console.error(
                "Add to cart error:",
                err
            );


            setError(
                err.message ||
                "Unable to add product to cart."
            );


            setTimeout(() => {

                setError("");

            }, 3000);


        } finally {

            setAdding(false);

        }

    };


    return (

        <div className="market-product">


            {/* =========================
                IMAGE
            ========================= */}

            <Link
                to={`/products/${productId}`}
                className="product-image-wrapper"
            >

                {image ? (

                    <img
                        src={image}
                        alt={name}
                        onError={(event) => {

                            event.currentTarget.style.display =
                                "none";

                        }}
                    />

                ) : (

                    <div className="product-image-placeholder">
                        🛍️
                    </div>

                )}

            </Link>


            {/* =========================
                PRODUCT INFO
            ========================= */}

            <div className="product-info">


                <div className="stars">

                    ☆☆☆☆☆

                    <span>
                        No reviews
                    </span>

                </div>


                <h3>
                    {name}
                </h3>


                {category && (

                    <div
                        style={{
                            fontSize: "12px",
                            marginTop: "4px"
                        }}
                    >
                        {category}
                    </div>

                )}


                <div className="price">

                    <strong>
                        ₹{price.toFixed(2)}
                    </strong>

                </div>


                {/* =========================
                    ADD TO CART
                ========================= */}

                <button
                    type="button"
                    className="product-add-cart"
                    onClick={handleAddToCart}
                    disabled={adding}
                >

                    {adding
                        ? "Adding..."
                        : "Add to Cart"}

                </button>


                {message && (

                    <div className="product-card-message success">
                        {message}
                    </div>

                )}


                {error && (

                    <div className="product-card-message error">
                        {error}
                    </div>

                )}

            </div>

        </div>

    );

}


export default ProductCard;