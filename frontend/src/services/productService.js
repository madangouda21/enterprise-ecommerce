const API_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";


// =====================================================
// GET TOKEN
// =====================================================

const getToken = () => {
    return localStorage.getItem("accessToken");
};


// =====================================================
// AUTH HEADERS
// =====================================================

const getAuthHeaders = () => {

    const token = getToken();

    return {
        Authorization: `Bearer ${token}`
    };
};


// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getAllProducts = async () => {

    const response = await fetch(
        `${API_URL}/api/v1/products`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Unable to fetch products."
        );
    }

    return data;
};


// =====================================================
// GET PRODUCT BY ID
// =====================================================

export const getProductById = async (id) => {

    const response = await fetch(
        `${API_URL}/api/v1/products/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Unable to fetch product."
        );
    }

    return data;
};


// =====================================================
// CREATE PRODUCT
// =====================================================

export const createProduct = async (product) => {

    const response = await fetch(
        `${API_URL}/api/v1/products`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },

            body: JSON.stringify(product)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Unable to create product."
        );
    }

    return data;
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (
    id,
    product
) => {

    const response = await fetch(
        `${API_URL}/api/v1/products/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },

            body: JSON.stringify(product)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Unable to update product."
        );
    }

    return data;
};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (id) => {

    const response = await fetch(
        `${API_URL}/api/v1/products/${id}`,
        {
            method: "DELETE",

            headers: {
                ...getAuthHeaders()
            }
        }
    );

    if (!response.ok) {

        let data = {};

        try {
            data = await response.json();
        } catch (error) {
            // No response body
        }

        throw new Error(
            data.message ||
            data.error ||
            "Unable to delete product."
        );
    }

    return true;
};


// =====================================================
// UPLOAD IMAGE / VIDEO
// =====================================================

export const uploadProductMedia = async (
    productId,
    file
) => {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const response = await fetch(
        `${API_URL}/api/v1/products/${productId}/media`,
        {
            method: "POST",

            headers: {
                ...getAuthHeaders()
            },

            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Unable to upload media."
        );
    }

    return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

const productService = {

    getAllProducts,

    getProductById,

    createProduct,

    updateProduct,

    deleteProduct,

    uploadProductMedia

};

export default productService;