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
            "Notification request failed."
        );
    }


    return data;
};


const notificationService = {

    /* =========================
       GET USER NOTIFICATIONS
    ========================= */

    async getNotifications(userId) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/notifications/user/${userId}`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    },


    /* =========================
       GET UNREAD NOTIFICATIONS
    ========================= */

    async getUnreadNotifications(userId) {

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        const response = await fetch(
            `${API_BASE_URL}/api/v1/notifications/user/${userId}/unread`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


        return handleResponse(response);
    }

};


export default notificationService;