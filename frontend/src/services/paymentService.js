const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.message || data?.error || "Payment request failed.");
    }
    return data;
};

const paymentService = {
    async createPayment(paymentData) {
        return handleResponse(await fetch(`${API_BASE_URL}/api/v1/payments`, {
            method: "POST", headers: getAuthHeaders(), body: JSON.stringify(paymentData)
        }));
    },

    async getPayments() {
        return handleResponse(await fetch(`${API_BASE_URL}/api/v1/payments`, {
            headers: getAuthHeaders()
        }));
    },

    async getPayment(paymentId) {
        return handleResponse(await fetch(`${API_BASE_URL}/api/v1/payments/${paymentId}`, {
            headers: getAuthHeaders()
        }));
    },

    async getPaymentByOrder(orderId) {
        return handleResponse(await fetch(`${API_BASE_URL}/api/v1/payments/order/${orderId}`, {
            headers: getAuthHeaders()
        }));
    },

    async updatePaymentStatus(paymentId, status) {
        return handleResponse(await fetch(`${API_BASE_URL}/api/v1/payments/${paymentId}/status`, {
            method: "PATCH", headers: getAuthHeaders(), body: JSON.stringify({ status })
        }));
    },

    async deletePayment(paymentId) {
        return handleResponse(await fetch(`${API_BASE_URL}/api/v1/payments/${paymentId}`, {
            method: "DELETE", headers: getAuthHeaders()
        }));
    }
};

export default paymentService;
