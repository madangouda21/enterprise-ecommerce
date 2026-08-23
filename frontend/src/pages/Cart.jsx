import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {

    const {
        cartItems,
        cartCount,
        cartTotal,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();


    const subtotal = Number(cartTotal || 0);

    const tax = subtotal * 0.18;

    const shipping = subtotal > 0 ? 0 : 0;

    const total =
        subtotal +
        tax +
        shipping;


    /* =========================
       INCREASE
    ========================= */

    const handleIncrease = async (item) => {

        const itemId =
            item.id ??
            item.cartItemId;


        await updateQuantity(
            itemId,
            Number(item.quantity) + 1
        );

    };


    /* =========================
       DECREASE
    ========================= */

    const handleDecrease = async (item) => {

        const quantity =
            Number(item.quantity);


        if (quantity <= 1) {
            return;
        }


        const itemId =
            item.id ??
            item.cartItemId;


        await updateQuantity(
            itemId,
            quantity - 1
        );

    };


    /* =========================
       REMOVE
    ========================= */

    const handleRemove = async (item) => {

        const itemId =
            item.id ??
            item.cartItemId;


        await removeFromCart(
            itemId
        );

    };


    /* =========================
       EMPTY CART
    ========================= */

    if (
        !cartItems ||
        cartItems.length === 0
    ) {

        return (

            <div className="cart-page">

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h1>
                        Your Cart Is Empty
                    </h1>

                    <p>
                        Add some products to your cart
                        and they will appear here.
                    </p>

                    <Link
                        to="/products"
                        className="primary-button"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        );

    }


    /* =========================
       CART
    ========================= */

    return (

        <div className="cart-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="cart-header">

                <div>

                    <h1>
                        Shopping Cart
                    </h1>

                    <p>

                        {cartCount}

                        {" "}

                        {cartCount === 1
                            ? "item"
                            : "items"}

                        {" "}
                        in your cart

                    </p>

                </div>


                <button
                    type="button"
                    className="clear-cart-button"
                    onClick={clearCart}
                >
                    Clear Cart
                </button>

            </div>


            {/* =========================
                LAYOUT
            ========================= */}

            <div className="cart-layout">


                {/* =========================
                    CART ITEMS
                ========================= */}

                <div className="cart-items">

                    {cartItems.map(
                        (item, index) => {

                            const product =
                                item.product ??
                                {};


                            /* =========================
                               PRODUCT ID
                            ========================= */

                            const productId =
                                item.productId ??
                                product.id ??
                                product.productId;


                            /* =========================
                               CART ITEM ID
                            ========================= */

                            const itemId =
                                item.id ??
                                item.cartItemId;


                            /* =========================
                               PRODUCT NAME
                            ========================= */

                            const name =
                                product.name ??
                                product.productName ??
                                item.name ??
                                "Product";


                            /* =========================
                               CATEGORY
                            ========================= */

                            const category =
                                product.category?.name ??
                                product.categoryName ??
                                product.category ??
                                "";


                            /* =========================
                               PRICE
                            ========================= */

                            const price =
                                Number(
                                    product.price ??
                                    item.price ??
                                    item.unitPrice ??
                                    0
                                );


                            /* =========================
                               QUANTITY
                            ========================= */

                            const quantity =
                                Number(
                                    item.quantity ?? 1
                                );


                            /* =========================
                               IMAGE
                            ========================= */

                            const imageMedia =
                                product.media?.find(
                                    (media) =>
                                        media.mediaType ===
                                        "IMAGE"
                                );


                            const image =
                                imageMedia?.url ??
                                product.imageUrl ??
                                product.image ??
                                product.productImage ??
                                item.imageUrl ??
                                "";


                            /* =========================
                               ITEM TOTAL
                            ========================= */

                            const itemTotal =
                                price *
                                quantity;


                            return (

                                <div
                                    className="cart-item"
                                    key={
                                        itemId ??
                                        productId ??
                                        index
                                    }
                                >

                                    {/* IMAGE */}

                                    <div className="cart-item-image">

                                        {image ? (

                                            <img
                                                src={image}
                                                alt={name}
                                            />

                                        ) : (

                                            <div className="product-image-placeholder">

                                                🛍️

                                            </div>

                                        )}

                                    </div>


                                    {/* PRODUCT INFO */}

                                    <div className="cart-item-info">

                                        <h3>
                                            {name}
                                        </h3>


                                        {category && (

                                            <p>
                                                {category}
                                            </p>

                                        )}


                                        <strong>

                                            ₹
                                            {price.toFixed(2)}

                                        </strong>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="cart-quantity">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDecrease(
                                                    item
                                                )
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
                                            onClick={() =>
                                                handleIncrease(
                                                    item
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>


                                    {/* ITEM TOTAL */}

                                    <div className="cart-item-total">

                                        ₹
                                        {itemTotal.toFixed(2)}

                                    </div>


                                    {/* REMOVE */}

                                    <button
                                        type="button"
                                        className="remove-cart-item"
                                        onClick={() =>
                                            handleRemove(
                                                item
                                            )
                                        }
                                        aria-label={
                                            `Remove ${name}`
                                        }
                                    >
                                        ×
                                    </button>

                                </div>

                            );

                        }
                    )}

                </div>


                {/* =========================
                    ORDER SUMMARY
                ========================= */}

                <aside className="cart-summary">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="summary-row">

                        <span>
                            Items
                        </span>

                        <strong>
                            {cartCount}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹
                            {subtotal.toFixed(2)}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Tax
                        </span>

                        <strong>
                            ₹
                            {tax.toFixed(2)}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Shipping
                        </span>

                        <strong>
                            Free
                        </strong>

                    </div>


                    <div className="summary-divider" />


                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹
                            {total.toFixed(2)}
                        </strong>

                    </div>


                    <Link
                        to="/checkout"
                        className="checkout-button"
                    >
                        Proceed to Checkout
                    </Link>


                    <Link
                        to="/products"
                        className="continue-shopping"
                    >
                        ← Continue Shopping
                    </Link>

                </aside>

            </div>

        </div>

    );

}


export default Cart;