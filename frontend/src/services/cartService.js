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
            "Cart request failed."
        );
    }


    return data;
};


const cartService = {

    /* =========================
       GET USER CART
    ========================= */

    async getCart(userId) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/carts/${userId}`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       ADD ITEM TO CART
    ========================= */

    async addToCart(
        userId,
        productId,
        quantity = 1
    ) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        if (!productId) {

            throw new Error(
                "Product ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/carts/${userId}/items`,
            {
                method: "POST",

                headers: getAuthHeaders(),

                body: JSON.stringify({
                    productId,
                    quantity
                })
            }
        );


        return handleResponse(response);
    },


    /* =========================
       UPDATE CART ITEM
    ========================= */

    async updateQuantity(
        userId,
        itemId,
        quantity
    ) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        if (!itemId) {

            throw new Error(
                "Cart item ID is required."
            );
        }


        if (quantity <= 0) {

            return this.removeFromCart(
                userId,
                itemId
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/carts/${userId}/items/${itemId}`,
            {
                method: "PUT",

                headers: getAuthHeaders(),

                body: JSON.stringify({
                    quantity
                })
            }
        );


        return handleResponse(response);
    },


    /* =========================
       REMOVE CART ITEM
    ========================= */

    async removeFromCart(
        userId,
        itemId
    ) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        if (!itemId) {

            throw new Error(
                "Cart item ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/carts/${userId}/items/${itemId}`,
            {
                method: "DELETE",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       CLEAR CART
    ========================= */

    async clearCart(userId) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/carts/${userId}/items`,
            {
                method: "DELETE",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    }

};


export default cartService;