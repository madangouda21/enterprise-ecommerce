import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import orderService from "../services/orderService";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";


function OrderDetails() {

    const { orderId } = useParams();

    const { user, isAuthenticated } = useAuth();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const userId =
        user?.id ??
        user?.userId;


    /* =========================
       LOAD ORDER
    ========================= */

    useEffect(() => {

        const loadOrder = async () => {

            if (
                !isAuthenticated ||
                !userId ||
                !orderId
            ) {
                setLoading(false);
                return;
            }


            try {

                setLoading(true);

                setError("");


                const response =
                    await orderService.getOrderById(
                        orderId
                    );


                const data =
                    response?.data ??
                    response;


                setOrder(data);

            } catch (err) {

                console.error(
                    "Order details error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load order details."
                );

            } finally {

                setLoading(false);

            }

        };


        loadOrder();

    }, [
        orderId,
        userId,
        isAuthenticated
    ]);


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="order-details-page">

                <Loading
                    message="Loading order..."
                />

            </div>

        );

    }


    /* =========================
       ERROR
    ========================= */

    if (error || !order) {

        return (

            <div className="order-details-page">

                <div className="empty-orders">

                    <div className="empty-orders-icon">
                        ⚠️
                    </div>

                    <h2>
                        Order Not Found
                    </h2>

                    <p>
                        {error ||
                            "We couldn't find this order."}
                    </p>

                    <Link
                        to="/orders"
                        className="primary-button"
                    >
                        Back to Orders
                    </Link>

                </div>

            </div>

        );

    }


    /* =========================
       ORDER DATA
    ========================= */

    const id =
        order.id ??
        order.orderId ??
        orderId;


    const status =
        order.status ??
        order.orderStatus ??
        "PENDING";


    const items =
        order.items ??
        order.orderItems ??
        [];


    const subtotal =
        Number(
            order.subtotal ??
            0
        );


    const tax =
        Number(
            order.tax ??
            order.taxAmount ??
            0
        );


    const shipping =
        Number(
            order.shippingCost ??
            order.shippingAmount ??
            0
        );


    const total =
        Number(
            order.total ??
            order.totalAmount ??
            order.amount ??
            subtotal +
            tax +
            shipping
        );


    const createdAt =
        order.createdAt ??
        order.orderDate ??
        order.createdDate;


    const shippingAddress =
        order.shippingAddress ??
        order.address ??
        null;


    const payment =
        order.payment ??
        order.paymentDetails ??
        null;


    /* =========================
       STATUS
    ========================= */

    const normalizedStatus =
        String(status)
            .toUpperCase();


    const statuses = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED"
    ];


    const currentIndex =
        statuses.indexOf(
            normalizedStatus
        );


    /* =========================
       PAGE
    ========================= */

    return (

        <div className="order-details-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="order-details-header">

                <div>

                    <Link to="/orders">
                        ← Back to Orders
                    </Link>

                    <h1>
                        Order #{id}
                    </h1>

                </div>

                <span className="order-status">
                    {status}
                </span>

            </div>


            {/* =========================
                PROGRESS
            ========================= */}

            <section className="order-progress-section">

                <h2>
                    Order Status
                </h2>


                <div className="order-progress">

                    {statuses.map(
                        (step, index) => {

                            const active =
                                currentIndex >=
                                index;


                            return (

                                <div
                                    key={step}
                                    className="progress-step"
                                >

                                    <div
                                        className={`progress-icon ${
                                            active
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        {index + 1}
                                    </div>

                                    <span>
                                        {step}
                                    </span>

                                </div>

                            );

                        }
                    )}

                </div>

            </section>


            <div className="order-details-layout">

                {/* =========================
                    ITEMS
                ========================= */}

                <section className="order-items-section">

                    <h2>
                        Order Items
                    </h2>


                    {items.length === 0 ? (

                        <div className="order-items-empty">

                            <div>
                                📦
                            </div>

                            <p>
                                No items found.
                            </p>

                        </div>

                    ) : (

                        <div className="order-details-items">

                            {items.map(
                                (
                                    item,
                                    index
                                ) => {

                                    const product =
                                        item.product ??
                                        item;


                                    const productName =
                                        product.name ??
                                        product.productName ??
                                        "Product";


                                    const image =
                                        product.imageUrl ??
                                        product.image ??
                                        "";


                                    const quantity =
                                        Number(
                                            item.quantity ??
                                            1
                                        );


                                    const price =
                                        Number(
                                            item.price ??
                                            item.unitPrice ??
                                            product.price ??
                                            0
                                        );


                                    return (

                                        <div
                                            key={
                                                item.id ??
                                                item.orderItemId ??
                                                index
                                            }
                                            className="order-detail-item"
                                        >

                                            <div className="order-detail-item-image">

                                                {image ? (

                                                    <img
                                                        src={image}
                                                        alt={productName}
                                                    />

                                                ) : (

                                                    <span>
                                                        📦
                                                    </span>

                                                )}

                                            </div>


                                            <div className="order-detail-item-info">

                                                <h3>
                                                    {productName}
                                                </h3>

                                                <p>
                                                    Quantity:{" "}
                                                    {quantity}
                                                </p>

                                            </div>


                                            <strong>
                                                ₹
                                                {(
                                                    price *
                                                    quantity
                                                ).toFixed(2)}
                                            </strong>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>


                {/* =========================
                    SHIPPING
                ========================= */}

                <section className="shipping-details-section">

                    <h2>
                        Shipping Details
                    </h2>


                    {shippingAddress ? (

                        <div className="shipping-address">

                            <p>
                                <strong>
                                    {shippingAddress.firstName}{" "}
                                    {shippingAddress.lastName}
                                </strong>
                            </p>

                            <p>
                                {shippingAddress.address}
                            </p>

                            <p>
                                {shippingAddress.city},{" "}
                                {shippingAddress.state}
                            </p>

                            <p>
                                {shippingAddress.country}{" "}
                                {shippingAddress.postalCode}
                            </p>

                            {shippingAddress.phone && (

                                <p>
                                    Phone:{" "}
                                    {shippingAddress.phone}
                                </p>

                            )}

                        </div>

                    ) : (

                        <p className="shipping-placeholder">
                            Shipping information is not
                            available.
                        </p>

                    )}

                </section>


                {/* =========================
                    PAYMENT
                ========================= */}

                <section className="payment-details-section">

                    <h2>
                        Payment Details
                    </h2>


                    <div className="payment-detail-row">

                        <span>
                            Payment Method
                        </span>

                        <strong>
                            {payment?.paymentMethod ??
                                order.paymentMethod ??
                                "—"}
                        </strong>

                    </div>


                    <div className="payment-detail-row">

                        <span>
                            Payment Status
                        </span>

                        <strong>
                            {payment?.status ??
                                order.paymentStatus ??
                                "—"}
                        </strong>

                    </div>


                    {payment?.transactionId && (

                        <div className="payment-detail-row">

                            <span>
                                Transaction ID
                            </span>

                            <strong>
                                {payment.transactionId}
                            </strong>

                        </div>

                    )}

                </section>


                {/* =========================
                    TOTAL
                ========================= */}

                <section className="order-total-section">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="order-total-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹{subtotal.toFixed(2)}
                        </strong>

                    </div>


                    <div className="order-total-row">

                        <span>
                            Tax
                        </span>

                        <strong>
                            ₹{tax.toFixed(2)}
                        </strong>

                    </div>


                    <div className="order-total-row">

                        <span>
                            Shipping
                        </span>

                        <strong>
                            {shipping === 0
                                ? "Free"
                                : `₹${shipping.toFixed(2)}`}
                        </strong>

                    </div>


                    <div className="order-total-divider" />


                    <div className="order-grand-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{total.toFixed(2)}
                        </strong>

                    </div>


                    {createdAt && (

                        <p className="order-created-date">
                            Placed on{" "}
                            {new Date(
                                createdAt
                            ).toLocaleString()}
                        </p>

                    )}

                </section>

            </div>

        </div>

    );

}


export default OrderDetails;