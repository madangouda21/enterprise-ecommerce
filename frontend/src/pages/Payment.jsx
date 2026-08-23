import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import paymentService from "../services/paymentService";
import orderService from "../services/orderService";
import shippingService from "../services/shippingService";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";


function Payment() {

    const navigate = useNavigate();

    const {
        cartItems,
        cartCount,
        cartTotal,
        clearCart
    } = useCart();

    const {
        user,
        isAuthenticated
    } = useAuth();


    const [paymentMethod, setPaymentMethod] =
        useState("CARD");

    const [checkoutData, setCheckoutData] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const [cardData, setCardData] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: ""
    });


    const userId =
        user?.id ??
        user?.userId;


    /* =========================
       LOAD CHECKOUT DATA
    ========================= */

    useEffect(() => {

        const storedData =
            sessionStorage.getItem(
                "checkoutData"
            );


        if (storedData) {

            try {

                setCheckoutData(
                    JSON.parse(storedData)
                );

            } catch (err) {

                console.error(
                    "Invalid checkout data:",
                    err
                );

                setError(
                    "Invalid checkout information."
                );

            }

        }

    }, []);


    /* =========================
       CARD INPUT
    ========================= */

    const handleCardChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setCardData(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );

    };


    /* =========================
       PAYMENT
    ========================= */

    const handlePayment = async (event) => {

        event.preventDefault();


        if (!isAuthenticated || !userId) {

            setError(
                "Please login before making payment."
            );

            return;
        }


        if (!checkoutData) {

            setError(
                "Checkout information is missing."
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
             * Create order first.
             */

            const orderData = {

                userId,

                items: cartItems.map(
                    (item) => ({

                        productId:
                            item.productId ?? item.product?.id,

                        quantity:
                            item.quantity,

                        price:
                            Number(
                                item.price ??
                                item.unitPrice ??
                                item.product?.price ??
                                0
                            )

                    })
                ),

                shippingAddress:
                    checkoutData.shippingAddress,

                deliveryMethod:
                    checkoutData.deliveryMethod,

                subtotal:
                    checkoutData.subtotal,

                tax:
                    checkoutData.tax,

                shippingCost:
                    checkoutData.shippingCost,

                total:
                    checkoutData.total

            };


            const orderResponse =
                await orderService.createOrder(
                    orderData
                );


            const order =
                orderResponse?.data ??
                orderResponse;


            const orderId =
                order?.id ??
                order?.orderId;


            if (!orderId) {

                throw new Error(
                    "Order ID was not returned."
                );

            }


            /* =========================
               CREATE PAYMENT
            ========================= */

            const paymentData = {

                orderId,

                userId,

                amount:
                    checkoutData.total,

                paymentMethod,

                ...(paymentMethod === "CARD" && {

                    cardNumber:
                        cardData.cardNumber,

                    cardHolder:
                        cardData.cardHolder,

                    expiryDate:
                        cardData.expiryDate,

                    cvv:
                        cardData.cvv

                })

            };


            const paymentResponse =
                await paymentService.createPayment(
                    paymentData
                );


            const payment =
                paymentResponse?.data ??
                paymentResponse;


            const paymentId =
                payment?.id ??
                payment?.paymentId;


            /* =========================
               CREATE SHIPPING
            ========================= */

            try {
                await shippingService.createShipping({
                    orderId,
                    userId,
                    shippingAddress: [
                        checkoutData.shippingAddress.firstName,
                        checkoutData.shippingAddress.lastName,
                        checkoutData.shippingAddress.address
                    ].filter(Boolean).join(", "),
                    city: checkoutData.shippingAddress.city,
                    state: checkoutData.shippingAddress.state,
                    postalCode: checkoutData.shippingAddress.postalCode
                });
            } catch (shippingError) {
                console.error("Shipping creation failed:", shippingError);
                throw new Error(
                    shippingError.message ||
                    "Payment succeeded, but shipping information could not be created."
                );
            }


            /*
             * Save result for OrderSuccess page.
             */

            sessionStorage.setItem(
                "paymentResult",
                JSON.stringify({
                    orderId,
                    paymentId,
                    amount:
                        checkoutData.total,
                    paymentMethod
                })
            );


            /*
             * Clear checkout information.
             */

            sessionStorage.removeItem(
                "checkoutData"
            );


            /*
             * Clear cart after successful
             * payment creation.
             */

            await clearCart();


            navigate(
                `/order-success?orderId=${orderId}`
            );

        } catch (err) {

            console.error(
                "Payment error:",
                err
            );


            setError(
                err.message ||
                "Payment failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================
       TOTALS
    ========================= */

    const subtotal =
        Number(
            checkoutData?.subtotal ??
            cartTotal ??
            0
        );


    const tax =
        Number(
            checkoutData?.tax ??
            subtotal * 0.18
        );


    const shippingCost =
        Number(
            checkoutData?.shippingCost ??
            0
        );


    const total =
        Number(
            checkoutData?.total ??
            subtotal +
            tax +
            shippingCost
        );


    /* =========================
       PAYMENT PAGE
    ========================= */

    return (

        <div className="payment-page">

            <div className="payment-header">

                <h1>
                    Payment
                </h1>

                <p>
                    Choose your payment method
                    to complete your order.
                </p>

            </div>


            {error && (

                <div className="payment-error">
                    {error}
                </div>

            )}


            <div className="payment-layout">

                {/* =========================
                    PAYMENT MAIN
                ========================= */}

                <div className="payment-main">

                    <form
                        onSubmit={handlePayment}
                        className="payment-form"
                    >

                        <section className="payment-section">

                            <div className="payment-section-title">

                                <span className="payment-step">
                                    1
                                </span>

                                <div>

                                    <h2>
                                        Payment Method
                                    </h2>

                                    <p>
                                        Select how you
                                        want to pay.
                                    </p>

                                </div>

                            </div>


                            {/* =========================
                                CARD
                            ========================= */}

                            <label className="payment-method">

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CARD"
                                    checked={
                                        paymentMethod ===
                                        "CARD"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <div className="payment-method-content">

                                    <div className="payment-method-icon">
                                        💳
                                    </div>

                                    <div>

                                        <strong>
                                            Credit / Debit Card
                                        </strong>

                                        <p>
                                            Pay securely
                                            using your card.
                                        </p>

                                    </div>

                                </div>

                            </label>


                            {/* =========================
                                UPI
                            ========================= */}

                            <label className="payment-method">

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="UPI"
                                    checked={
                                        paymentMethod ===
                                        "UPI"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <div className="payment-method-content">

                                    <div className="payment-method-icon">
                                        📱
                                    </div>

                                    <div>

                                        <strong>
                                            UPI
                                        </strong>

                                        <p>
                                            Pay using
                                            your UPI app.
                                        </p>

                                    </div>

                                </div>

                            </label>


                            {/* =========================
                                CASH
                            ========================= */}

                            <label className="payment-method">

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={
                                        paymentMethod ===
                                        "COD"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <div className="payment-method-content">

                                    <div className="payment-method-icon">
                                        💵
                                    </div>

                                    <div>

                                        <strong>
                                            Cash on Delivery
                                        </strong>

                                        <p>
                                            Pay when your
                                            order arrives.
                                        </p>

                                    </div>

                                </div>

                            </label>

                        </section>


                        {/* =========================
                            CARD DETAILS
                        ========================= */}

                        {paymentMethod === "CARD" && (

                            <section className="payment-section">

                                <div className="payment-section-title">

                                    <span className="payment-step">
                                        2
                                    </span>

                                    <div>

                                        <h2>
                                            Card Details
                                        </h2>

                                        <p>
                                            Enter your card
                                            information.
                                        </p>

                                    </div>

                                </div>


                                <div className="payment-form">

                                    <div className="payment-form-group">

                                        <label>
                                            Card Number
                                        </label>

                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={
                                                cardData.cardNumber
                                            }
                                            onChange={
                                                handleCardChange
                                            }
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            required
                                        />

                                    </div>


                                    <div className="payment-form-group">

                                        <label>
                                            Card Holder
                                        </label>

                                        <input
                                            type="text"
                                            name="cardHolder"
                                            value={
                                                cardData.cardHolder
                                            }
                                            onChange={
                                                handleCardChange
                                            }
                                            placeholder="Name on card"
                                            required
                                        />

                                    </div>


                                    <div className="payment-form-row">

                                        <div className="payment-form-group">

                                            <label>
                                                Expiry Date
                                            </label>

                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={
                                                    cardData.expiryDate
                                                }
                                                onChange={
                                                    handleCardChange
                                                }
                                                placeholder="MM/YY"
                                                required
                                            />

                                        </div>


                                        <div className="payment-form-group">

                                            <label>
                                                CVV
                                            </label>

                                            <input
                                                type="password"
                                                name="cvv"
                                                value={
                                                    cardData.cvv
                                                }
                                                onChange={
                                                    handleCardChange
                                                }
                                                placeholder="•••"
                                                maxLength="4"
                                                required
                                            />

                                        </div>

                                    </div>

                                </div>

                            </section>

                        )}


                        {/* =========================
                            SECURITY
                        ========================= */}

                        <div className="payment-security">

                            <span>
                                🔒
                            </span>

                            <div>

                                <strong>
                                    Secure Payment
                                </strong>

                                <p>
                                    Your payment
                                    information is
                                    transmitted securely.
                                </p>

                            </div>

                        </div>


                        {/* =========================
                            ACTIONS
                        ========================= */}

                        <div className="payment-actions">

                            <Link
                                to="/checkout"
                                className="payment-back"
                            >
                                ← Back to Checkout
                            </Link>


                            <button
                                type="submit"
                                className="payment-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Processing..."
                                    : `Pay ₹${total.toFixed(
                                        2
                                    )}`}

                            </button>

                        </div>

                    </form>

                </div>


                {/* =========================
                    SUMMARY
                ========================= */}

                <aside className="payment-summary">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="payment-summary-row">

                        <span>
                            Items
                        </span>

                        <strong>
                            {cartCount}
                        </strong>

                    </div>


                    <div className="payment-summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹{subtotal.toFixed(2)}
                        </strong>

                    </div>


                    <div className="payment-summary-row">

                        <span>
                            Tax
                        </span>

                        <strong>
                            ₹{tax.toFixed(2)}
                        </strong>

                    </div>


                    <div className="payment-summary-row">

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


                    <div className="payment-summary-divider" />


                    <div className="payment-total">

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


export default Payment;