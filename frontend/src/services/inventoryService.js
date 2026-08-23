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
            "Inventory request failed."
        );
    }


    return data;
};


const inventoryService = {

    /* =========================
       GET ALL INVENTORY
    ========================= */

    async getInventory() {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/inventory`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET INVENTORY BY PRODUCT
    ========================= */

    async getInventoryByProductId(productId) {

        if (!productId) {
            throw new Error(
                "Product ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/inventory/product/${productId}`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       CREATE INVENTORY
    ========================= */

    async createInventory(inventoryData) {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/inventory`,
            {
                method: "POST",

                headers: getAuthHeaders(),

                body: JSON.stringify(
                    inventoryData
                )
            }
        );


        return handleResponse(response);
    },


    /* =========================
       UPDATE INVENTORY
    ========================= */

    async updateInventory(
        productId,
        inventoryData
    ) {

        if (!productId) {
            throw new Error(
                "Product ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/inventory/product/${productId}`,
            {
                method: "PUT",

                headers: getAuthHeaders(),

                body: JSON.stringify(
                    inventoryData
                )
            }
        );


        return handleResponse(response);
    },


    /* =========================
       DELETE INVENTORY
    ========================= */

    async deleteInventory(productId) {

        if (!productId) {
            throw new Error(
                "Product ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/inventory/product/${productId}`,
            {
                method: "DELETE",

                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    }

};


export default inventoryService;