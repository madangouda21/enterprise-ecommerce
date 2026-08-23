const API_BASE_URL =
    import.meta.env.VITE_API_GATEWAY_URL ||
    "http://localhost:8080";


const handleResponse = async (response) => {

    const data =
        await response.json().catch(
            () => null
        );


    if (!response.ok) {

        throw new Error(
            data?.message ||
            data?.error ||
            "Authentication request failed."
        );
    }


    return data;
};


const authService = {

    /* =========================
       LOGIN
    ========================= */

    async login(email, password) {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );


        return handleResponse(response);
    },


    /* =========================
       REGISTER
    ========================= */

    async register(userData) {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(userData)
            }
        );


        return handleResponse(response);
    }

};


export default authService;