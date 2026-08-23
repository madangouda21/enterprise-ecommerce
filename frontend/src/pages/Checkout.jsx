import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import shippingService from "../services/shippingService";
import orderService from "../services/orderService";


function Checkout() {

    const navigate = useNavigate();

    const {
        cartItems,
        cartCount,
        cartTotal
    } = useCart();

    const {
        user,
        isAuthenticated
    } = useAuth();


    const [formData, setFormData] = useState({

        firstName:
            user?.firstName ??
            "",

        lastName:
            user?.lastName ??
            "",

        email:
            user?.email ??
            "",

        phone:
            user?.phone ??
            "",

        address: "",

        city: "",

        state: "",

        country: "",

        postalCode: ""

    });


    const [deliveryMethod, setDeliveryMethod] =
        useState("STANDARD");


    const [shippingCost, setShippingCost] =
        useState(0);


    const [loading, setLoading] =
        useState(false);


    const [shippingLoading, setShippingLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const userId =
        user?.id ??
        user?.userId;


    /* =========================
       UPDATE USER DATA
    ========================= */

    useEffect(() => {

        setFormData((previous) => ({

            ...previous,

            firstName:
                user?.firstName ??
                previous.firstName,

            lastName:
                user?.lastName ??
                previous.lastName,

            email:
                user?.email ??
                previous.email,

            phone:
                user?.phone ??
                previous.phone

        }));

    }, [user]);


    /* =========================
       INPUT CHANGE
    ========================= */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    /* =========================
       SHIPPING COST
    ========================= */

    useEffect(() => {

        const calculateShipping = async () => {

            if (!cartItems.length) {

                setShippingCost(0);

                return;
            }


            try {

                setShippingLoading(true);


                /*
                 * Shipping service does not expose a
                 * frontend "calculate" endpoint.
                 *
                 * Therefore we use the delivery
                 * method as a local estimate here.
                 *
                 * The final shipping amount should
                 * ultimately come from the Shipping
                 * Service when the order is created.
                 */

                if (
                    deliveryMethod ===
                    "EXPRESS"
                ) {

                    setShippingCost(15);

                } else {

                    setShippingCost(0);

                }

            } finally {

                setShippingLoading(false);

            }

        };


        calculateShipping();

    }, [
        deliveryMethod,
        cartItems.length
    ]);


    /* =========================
       TOTAL
    ========================= */

    const subtotal =
        Number(cartTotal || 0);


    const tax =
        subtotal * 0.18;


    const total =
        subtotal +
        tax +
        shippingCost;


    /* =========================
       CONTINUE TO PAYMENT
    ========================= */

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!isAuthenticated || !userId) {

            setError(
                "Please login before continuing."
            );

            return;
        }


        if (!cartItems.length) {

            setError(
                "Your cart is empty."
            );

            return;
        }


        try {

            setLoading(true);

            setError("");


            /*
             * Save checkout information temporarily
             * so Payment.jsx can use it.
             */

            const checkoutData = {

                userId,

                shippingAddress: {

                    firstName:
                        formData.firstName,

                    lastName:
                        formData.lastName,

                    email:
                        formData.email,

                    phone:
                        formData.phone,

                    address:
                        formData.address,

                    city:
                        formData.city,

                    state:
                        formData.state,

                    country:
                        formData.country,

                    postalCode:
                        formData.postalCode

                },

                deliveryMethod,

                shippingCost,

                subtotal,

                tax,

                total

            };


            sessionStorage.setItem(
                "checkoutData",
                JSON.stringify(
                    checkoutData
                )
            );


            /*
             * Keep order creation in the
             * payment flow so an order is not
             * created before payment is completed.
             */

            navigate("/payment");

        } catch (err) {

            console.error(
                "Checkout error:",
                err
            );


            setError(
                err.message ||
                "Unable to continue to payment."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================
       EMPTY CART
    ========================= */

    if (!cartItems.length) {

        return (

            <div className="checkout-page">

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h1>
                        Your Cart Is Empty
                    </h1>

                    <p>
                        Add some products before
                        continuing to checkout.
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


    return (

        <div className="checkout-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="checkout-header">

                <h1>
                    Checkout
                </h1>

                <p>
                    Enter your delivery
                    information.
                </p>

            </div>


            {error && (

                <div className="checkout-error">
                    {error}
                </div>

            )}


            <div className="checkout-layout">

                {/* =========================
                    MAIN
                ========================= */}

                <div className="checkout-main">

                    <form
                        className="checkout-form"
                        onSubmit={handleSubmit}
                    >

                        {/* =========================
                            DELIVERY INFORMATION
                        ========================= */}

                        <section className="checkout-section">

                            <div className="checkout-section-title">

                                <span className="checkout-step">
                                    1
                                </span>

                                <div>

                                    <h2>
                                        Delivery Information
                                    </h2>

                                    <p>
                                        Where should we
                                        deliver your order?
                                    </p>

                                </div>

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={
                                            formData.firstName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={
                                            formData.lastName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={
                                            formData.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={
                                            formData.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Country
                                    </label>

                                    <input
                                        type="text"
                                        name="country"
                                        value={
                                            formData.country
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Postal Code
                                    </label>

                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={
                                            formData.postalCode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>

                        </section>


                        {/* =========================
                            DELIVERY METHOD
                        ========================= */}

                        <section className="checkout-section">

                            <div className="checkout-section-title">

                                <span className="checkout-step">
                                    2
                                </span>

                                <div>

                                    <h2>
                                        Delivery Method
                                    </h2>

                                    <p>
                                        Select your preferred
                                        delivery option.
                                    </p>

                                </div>

                            </div>


                            <div className="delivery-options">

                                <label className="delivery-option">

                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value="STANDARD"
                                        checked={
                                            deliveryMethod ===
                                            "STANDARD"
                                        }
                                        onChange={(event) =>
                                            setDeliveryMethod(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <div>

                                        <strong>
                                            Standard Delivery
                                        </strong>

                                        <p>
                                            Regular delivery
                                        </p>

                                    </div>

                                    <span>
                                        Free
                                    </span>

                                </label>


                                <label className="delivery-option">

                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value="EXPRESS"
                                        checked={
                                            deliveryMethod ===
                                            "EXPRESS"
                                        }
                                        onChange={(event) =>
                                            setDeliveryMethod(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <div>

                                        <strong>
                                            Express Delivery
                                        </strong>

                                        <p>
                                            Faster delivery
                                        </p>

                                    </div>

                                    <span>
                                        ₹15
                                    </span>

                                </label>

                            </div>

                        </section>


                        {/* =========================
                            ACTIONS
                        ========================= */}

                        <div className="checkout-actions">

                            <Link
                                to="/cart"
                                className="back-to-cart"
                            >
                                ← Back to Cart
                            </Link>


                            <button
                                type="submit"
                                className="checkout-continue"
                                disabled={
                                    loading ||
                                    shippingLoading
                                }
                            >

                                {loading
                                    ? "Continuing..."
                                    : "Continue to Payment →"}

                            </button>

                        </div>

                    </form>

                </div>


                {/* =========================
                    SUMMARY
                ========================= */}

                <aside className="checkout-summary">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="checkout-summary-row">

                        <span>
                            Items
                        </span>

                        <strong>
                            {cartCount}
                        </strong>

                    </div>


                    <div className="checkout-summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹{subtotal.toFixed(2)}
                        </strong>

                    </div>


                    <div className="checkout-summary-row">

                        <span>
                            Tax
                        </span>

                        <strong>
                            ₹{tax.toFixed(2)}
                        </strong>

                    </div>


                    <div className="checkout-summary-row">

                        <span>
                            Shipping
                        </span>

                        <strong>

                            {shippingCost === 0
                                ? "Free"
                                : `₹${shippingCost.toFixed(
                                    2
                                )}`}

                        </strong>

                    </div>


                    <div className="checkout-summary-divider" />


                    <div className="checkout-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{total.toFixed(2)}
                        </strong>

                    </div>

                </aside>

            </div>

        </div>

    );

}


export default Checkout;