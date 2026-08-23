const API_BASE_URL =
    import.meta.env.VITE_API_GATEWAY_URL ||
    "http://localhost:8080";


const getAuthHeaders = () => {

    const token =
        localStorage.getItem("accessToken");

    return {
        "Content-Type": "application/json",

        ...(token && {
            Authorization: `Bearer ${token}`
        })
    };
};


const handleResponse = async (response) => {

    const data =
        await response.json().catch(
            () => null
        );


    if (!response.ok) {

        throw new Error(
            data?.message ||
            data?.error ||
            "Review request failed."
        );
    }


    return data;
};


const reviewService = {

    /* =========================
       GET REVIEWS BY PRODUCT
    ========================= */

    async getReviewsByProduct(productId) {

        if (!productId) {

            throw new Error(
                "Product ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/reviews/product/${productId}`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET REVIEW BY ID
    ========================= */

    async getReviewById(reviewId) {

        if (!reviewId) {

            throw new Error(
                "Review ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/reviews/${reviewId}`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET REVIEWS BY USER
    ========================= */

    async getReviewsByUser(userId) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/reviews/user/${userId}`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       CREATE REVIEW
    ========================= */

    async createReview(reviewData) {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/reviews`,
            {
                method: "POST",

                headers: getAuthHeaders(),

                body: JSON.stringify(
                    reviewData
                )
            }
        );


        return handleResponse(response);
    },


    /* =========================
       UPDATE REVIEW
    ========================= */

    async updateReview(
        reviewId,
        reviewData
    ) {

        if (!reviewId) {

            throw new Error(
                "Review ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/reviews/${reviewId}`,
            {
                method: "PUT",

                headers: getAuthHeaders(),

                body: JSON.stringify(
                    reviewData
                )
            }
        );


        return handleResponse(response);
    },


    /* =========================
       DELETE REVIEW
    ========================= */

    async deleteReview(reviewId) {

        if (!reviewId) {

            throw new Error(
                "Review ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/reviews/${reviewId}`,
            {
                method: "DELETE",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    }

};


export default reviewService;