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
            "Order request failed."
        );
    }


    return data;
};


const orderService = {

    /* =========================
       CREATE ORDER
    ========================= */

    async createOrder(orderData) {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/orders`,
            {
                method: "POST",

                headers: getAuthHeaders(),

                body: JSON.stringify(orderData)
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET ALL ORDERS
    ========================= */

    async getOrders() {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/orders`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET ORDER BY ID
    ========================= */

    async getOrderById(orderId) {

        if (!orderId) {

            throw new Error(
                "Order ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/orders/${orderId}`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET ORDERS BY USER
    ========================= */

    async getOrdersByUser(userId) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/orders/user/${userId}`,
            {
                method: "GET",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       UPDATE ORDER STATUS
    ========================= */

    async updateOrderStatus(
        orderId,
        status
    ) {

        if (!orderId) {

            throw new Error(
                "Order ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/orders/${orderId}/status`,
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
       DELETE ORDER
    ========================= */

    async deleteOrder(orderId) {

        if (!orderId) {

            throw new Error(
                "Order ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/orders/${orderId}`,
            {
                method: "DELETE",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    }

};


export default orderService;