const API_URL =
    import.meta.env.VITE_API_GATEWAY_URL ||
    "http://localhost:8080";

const getToken = () => localStorage.getItem("accessToken");

const getHeaders = (json = true) => {
    const token = getToken();
    return {
        ...(json ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

const readResponse = async (response) => {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(
            data?.message || data?.error || "Admin product request failed."
        );
    }
    return data;
};

export const getAllProducts = async () => {
    const response = await fetch(`${API_URL}/api/v1/products`, {
        headers: getHeaders(false)
    });
    return readResponse(response);
};

export const getProductById = async (id) => {
    const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
        headers: getHeaders(false)
    });
    return readResponse(response);
};

export const createProduct = async (product) => {
    const response = await fetch(`${API_URL}/api/v1/products`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(product)
    });
    return readResponse(response);
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(product)
    });
    return readResponse(response);
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
        method: "DELETE",
        headers: getHeaders(false)
    });
    await readResponse(response);
    return true;
};

export const getProductMedia = async (productId) => {
    const response = await fetch(
        `${API_URL}/api/v1/products/${productId}/media`,
        { headers: getHeaders(false) }
    );
    return readResponse(response);
};

export const uploadProductMedia = async (productId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/api/v1/products/${productId}/media`,
        {
            method: "POST",
            headers: getHeaders(false),
            body: formData
        }
    );

    return readResponse(response);
};

export const deleteProductMedia = async (mediaId) => {
    const response = await fetch(
        `${API_URL}/api/v1/products/media/${mediaId}`,
        {
            method: "DELETE",
            headers: getHeaders(false)
        }
    );
    await readResponse(response);
    return true;
};

const adminProductService = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductMedia,
    uploadProductMedia,
    deleteProductMedia
};

export default adminProductService;
