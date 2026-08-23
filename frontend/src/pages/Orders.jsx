import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import orderService from "../services/orderService";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";


function Orders() {

    const {
        user,
        isAuthenticated
    } = useAuth();


    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const userId =
        user?.id ??
        user?.userId;


    /* =========================
       LOAD ORDERS
    ========================= */

    useEffect(() => {

        const loadOrders = async () => {

            if (!isAuthenticated || !userId) {

                setOrders([]);

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                const data =
                    await orderService.getOrdersByUser(
                        userId
                    );


                const orderList =
                    Array.isArray(data)
                        ? data
                        : data?.content ||
                          data?.orders ||
                          [];


                setOrders(orderList);

            } catch (err) {

                console.error(
                    "Orders loading error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load your orders."
                );

            } finally {

                setLoading(false);

            }

        };


        loadOrders();

    }, [
        isAuthenticated,
        userId
    ]);


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="orders-page">

                <Loading
                    message="Loading your orders..."
                />

            </div>

        );

    }


    /* =========================
       ERROR
    ========================= */

    if (error) {

        return (

            <div className="orders-page">

                <div className="orders-error">

                    <div>
                        ⚠️
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    /* =========================
       EMPTY
    ========================= */

    if (orders.length === 0) {

        return (

            <div className="orders-page">

                <div className="empty-orders">

                    <div>
                        📦
                    </div>

                    <h1>
                        No Orders Yet
                    </h1>

                    <p>
                        You haven't placed any
                        orders yet.
                    </p>

                    <Link
                        to="/products"
                        className="primary-button"
                    >
                        Start Shopping
                    </Link>

                </div>

            </div>

        );

    }


    /* =========================
       ORDERS PAGE
    ========================= */

    return (

        <div className="orders-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="orders-header">

                <div>

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        View and track your orders
                    </p>

                </div>

            </div>


            {/* =========================
                ORDERS
            ========================= */}

            <div className="orders-list">

                {orders.map((order) => {

                    const orderId =
                        order.id ??
                        order.orderId;


                    const status =
                        order.status ??
                        order.orderStatus ??
                        "PENDING";


                    const total =
                        Number(
                            order.total ??
                            order.totalAmount ??
                            order.amount ??
                            0
                        );


                    const createdAt =
                        order.createdAt ??
                        order.orderDate ??
                        order.createdDate;


                    const items =
                        order.items ??
                        order.orderItems ??
                        [];


                    const itemCount =
                        items.length;


                    return (

                        <div
                            className="order-card"
                            key={orderId}
                        >

                            {/* =========================
                                ORDER HEADER
                            ========================= */}

                            <div className="order-card-header">

                                <div>

                                    <span>
                                        Order
                                    </span>

                                    <strong>
                                        #{orderId}
                                    </strong>

                                </div>


                                <span
                                    className={`order-status status-${String(
                                        status
                                    ).toLowerCase()}`}
                                >
                                    {status}
                                </span>

                            </div>


                            {/* =========================
                                ORDER DETAILS
                            ========================= */}

                            <div className="order-card-details">

                                <div>

                                    <span>
                                        Order Date
                                    </span>

                                    <strong>
                                        {createdAt
                                            ? new Date(
                                                createdAt
                                            ).toLocaleDateString()
                                            : "—"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Items
                                    </span>

                                    <strong>
                                        {itemCount}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹
                                        {total.toFixed(2)}
                                    </strong>

                                </div>

                            </div>


                            {/* =========================
                                PRODUCTS PREVIEW
                            ========================= */}

                            {items.length > 0 && (

                                <div className="order-items-preview">

                                    {items
                                        .slice(0, 3)
                                        .map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const product =
                                                    item.product ??
                                                    item;


                                                const name =
                                                    product.name ??
                                                    product.productName ??
                                                    "Product";


                                                const image =
                                                    product.imageUrl ??
                                                    product.image ??
                                                    "";


                                                return (

                                                    <div
                                                        key={
                                                            item.id ??
                                                            index
                                                        }
                                                        className="order-product-preview"
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


                                                        <span>
                                                            {name}
                                                        </span>

                                                    </div>

                                                );

                                            }
                                        )}

                                </div>

                            )}


                            {/* =========================
                                ACTION
                            ========================= */}

                            <div className="order-card-footer">

                                <Link
                                    to={`/orders/${orderId}`}
                                    className="view-order-button"
                                >
                                    View Order →
                                </Link>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}


export default Orders;