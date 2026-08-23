import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import reviewService from "../services/reviewService";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";


function Reviews() {

    const {
        user,
        isAuthenticated
    } = useAuth();


    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const userId =
        user?.id ??
        user?.userId;


    /* =========================
       LOAD USER REVIEWS
    ========================= */

    useEffect(() => {

        const loadReviews = async () => {

            if (!isAuthenticated || !userId) {

                setReviews([]);

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                const data =
                    await reviewService.getReviewsByUser(
                        userId
                    );


                const reviewList =
                    Array.isArray(data)
                        ? data
                        : data?.content ||
                          data?.reviews ||
                          [];


                setReviews(reviewList);

            } catch (err) {

                console.error(
                    "Reviews loading error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load your reviews."
                );

            } finally {

                setLoading(false);

            }

        };


        loadReviews();

    }, [
        isAuthenticated,
        userId
    ]);


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="reviews-page">

                <Loading
                    message="Loading your reviews..."
                />

            </div>

        );

    }


    /* =========================
       ERROR
    ========================= */

    if (error) {

        return (

            <div className="reviews-page">

                <div className="empty-reviews">

                    <div>
                        ⚠️
                    </div>

                    <h2>
                        Unable to load reviews
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );

    }


    /* =========================
       CALCULATE RATING
    ========================= */

    const getRating = (review) => {

        return Number(
            review.rating ??
            review.stars ??
            0
        );

    };


    const totalReviews =
        reviews.length;


    const averageRating =
        totalReviews === 0
            ? 0
            : reviews.reduce(
                (total, review) =>
                    total + getRating(review),
                0
            ) / totalReviews;


    const roundedAverage =
        averageRating.toFixed(1);


    /* =========================
       RATING BREAKDOWN
    ========================= */

    const ratingCounts = {

        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0

    };


    reviews.forEach((review) => {

        const rating =
            Math.round(
                getRating(review)
            );


        if (
            rating >= 1 &&
            rating <= 5
        ) {

            ratingCounts[rating]++;

        }

    });


    /* =========================
       PAGE
    ========================= */

    return (

        <div className="reviews-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="reviews-header">

                <div>

                    <h1>
                        My Reviews
                    </h1>

                    <p>
                        Manage the reviews you
                        have submitted.
                    </p>

                </div>

                <Link
                    to="/products"
                    className="primary-button"
                >
                    Browse Products
                </Link>

            </div>


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="reviews-summary">

                <div className="overall-rating">

                    <strong>
                        {roundedAverage}
                    </strong>

                    <div className="review-stars">

                        {"★".repeat(
                            Math.round(
                                averageRating
                            )
                        )}

                        {"☆".repeat(
                            5 -
                            Math.round(
                                averageRating
                            )
                        )}

                    </div>

                    <p>
                        Based on {totalReviews}{" "}
                        review
                        {totalReviews !== 1
                            ? "s"
                            : ""}
                    </p>

                </div>


                <div className="rating-breakdown">

                    {[5, 4, 3, 2, 1].map(
                        (rating) => {

                            const percentage =
                                totalReviews === 0
                                    ? 0
                                    : (
                                        ratingCounts[
                                            rating
                                        ] /
                                        totalReviews
                                    ) *
                                    100;


                            return (

                                <div
                                    key={rating}
                                >

                                    <span>
                                        {rating}★
                                    </span>

                                    <div className="rating-bar">

                                        <div
                                            style={{
                                                width: `${percentage}%`
                                            }}
                                        />

                                    </div>

                                    <span>
                                        {
                                            ratingCounts[
                                                rating
                                            ]
                                        }
                                    </span>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>


            {/* =========================
                EMPTY
            ========================= */}

            {reviews.length === 0 ? (

                <div className="reviews-list-section">

                    <div className="empty-reviews">

                        <div>
                            ⭐
                        </div>

                        <h2>
                            No Reviews Yet
                        </h2>

                        <p>
                            You haven't written
                            any reviews yet.
                        </p>

                        <Link
                            to="/products"
                            className="primary-button"
                        >
                            Find a Product
                        </Link>

                    </div>

                </div>

            ) : (

                /* =========================
                   REVIEW LIST
                ========================= */

                <div className="reviews-list-section">

                    <div className="reviews-list">

                        {reviews.map(
                            (
                                review,
                                index
                            ) => {

                                const reviewId =
                                    review.id ??
                                    review.reviewId ??
                                    index;


                                const rating =
                                    getRating(
                                        review
                                    );


                                const title =
                                    review.title ??
                                    review.productName ??
                                    "Product Review";


                                const text =
                                    review.comment ??
                                    review.content ??
                                    review.review ??
                                    review.description ??
                                    "";


                                const productId =
                                    review.productId ??
                                    review.product?.id;


                                const createdAt =
                                    review.createdAt ??
                                    review.createdDate ??
                                    review.updatedAt;


                                return (

                                    <div
                                        className="review-card"
                                        key={
                                            reviewId
                                        }
                                    >

                                        <div className="review-card-header">

                                            <div className="review-avatar">
                                                {(
                                                    user?.name ??
                                                    user?.username ??
                                                    "U"
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>


                                            <div>

                                                <strong>
                                                    {title}
                                                </strong>

                                                <div className="review-stars">

                                                    {"★".repeat(
                                                        rating
                                                    )}

                                                    {"☆".repeat(
                                                        5 -
                                                        rating
                                                    )}

                                                </div>

                                            </div>

                                        </div>


                                        <p>
                                            {text}
                                        </p>


                                        {createdAt && (

                                            <small>
                                                {new Date(
                                                    createdAt
                                                ).toLocaleDateString()}
                                            </small>

                                        )}


                                        {productId && (

                                            <Link
                                                to={`/products/${productId}`}
                                                className="review-product-link"
                                            >
                                                View Product
                                            </Link>

                                        )}

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>

            )}

        </div>

    );

}


export default Reviews;