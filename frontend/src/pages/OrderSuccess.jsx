import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function OrderSuccess() {

    const [searchParams] = useSearchParams();

    const [paymentResult, setPaymentResult] =
        useState(null);


    const orderId =
        searchParams.get("orderId");


    useEffect(() => {

        const storedResult =
            sessionStorage.getItem(
                "paymentResult"
            );


        if (storedResult) {

            try {

                setPaymentResult(
                    JSON.parse(
                        storedResult
                    )
                );

            } catch (error) {

                console.error(
                    "Unable to read payment result:",
                    error
                );

            }

        }

    }, []);


    const paymentId =
        paymentResult?.paymentId ??
        "—";


    const amount =
        Number(
            paymentResult?.amount ?? 0
        );


    const paymentMethod =
        paymentResult?.paymentMethod ??
        "—";


    return (

        <div className="order-success-page">

            <div className="order-success-card">

                {/* =========================
                    SUCCESS ICON
                ========================= */}

                <div className="success-icon">
                    ✓
                </div>


                {/* =========================
                    MESSAGE
                ========================= */}

                <h1>
                    Order Placed Successfully!
                </h1>


                <p>
                    Thank you for your purchase.
                    Your order has been placed
                    successfully and is being
                    processed.
                </p>


                {/* =========================
                    ORDER INFORMATION
                ========================= */}

                <div className="order-success-info">

                    <div>

                        <span>
                            Order ID
                        </span>

                        <strong>
                            #{orderId ?? "—"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Payment ID
                        </span>

                        <strong>
                            {paymentId}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Payment Method
                        </span>

                        <strong>
                            {paymentMethod}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Amount Paid
                        </span>

                        <strong>
                            ₹{amount.toFixed(2)}
                        </strong>

                    </div>

                </div>


                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="order-success-actions">

                    {orderId && (

                        <Link
                            to={`/orders/${orderId}`}
                            className="primary-button"
                        >
                            View Order
                        </Link>

                    )}


                    <Link
                        to="/products"
                        className="secondary-button"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default OrderSuccess;