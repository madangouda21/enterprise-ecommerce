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
            "Shipping request failed."
        );
    }


    return data;
};


const shippingService = {

    /* =========================
       CREATE SHIPPING
    ========================= */

    async createShipping(shippingData) {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/shipping`,
            {
                method: "POST",

                headers: getAuthHeaders(),

                body: JSON.stringify(
                    shippingData
                )
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET ALL SHIPPING
    ========================= */

    async getShipping() {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/shipping`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET SHIPPING BY ID
    ========================= */

    async getShippingById(shippingId) {

        if (!shippingId) {

            throw new Error(
                "Shipping ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/shipping/${shippingId}`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET SHIPPING BY ORDER
    ========================= */

    async getShippingByOrder(orderId) {

        if (!orderId) {

            throw new Error(
                "Order ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/shipping/order/${orderId}`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET SHIPPING BY USER
    ========================= */

    async getShippingByUser(userId) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/shipping/user/${userId}`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       UPDATE SHIPPING STATUS
    ========================= */

    async updateShippingStatus(
        shippingId,
        status
    ) {

        if (!shippingId) {

            throw new Error(
                "Shipping ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/shipping/${shippingId}/status`,
            {
                method: "PATCH",

                headers: getAuthHeaders(),

                body: JSON.stringify({
                    status
                })
            }
        );


        return handleResponse(response);
    },


    /* =========================
       DELETE SHIPPING
    ========================= */

    async deleteShipping(shippingId) {

        if (!shippingId) {

            throw new Error(
                "Shipping ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/shipping/${shippingId}`,
            {
                method: "DELETE",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    }

};


export default shippingService;