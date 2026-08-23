const STORAGE_KEY = "wishlistItems";

const read = () => {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
};

const write = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items;
};

const getProductId = (item) =>
    item?.productId ?? item?.product?.id ?? item?.id;

const wishlistService = {
    async getWishlist() {
        return read();
    },

    async addToWishlist(product) {
        const productId = getProductId(product);
        if (!productId) throw new Error("Product ID is required.");

        const items = read();
        if (items.some(item => getProductId(item) === productId)) {
            return items;
        }

        return write([...items, product]);
    },

    async removeFromWishlist(productId) {
        return write(read().filter(item => getProductId(item) !== productId));
    },

    async isInWishlist(productId) {
        return read().some(item => getProductId(item) === productId);
    }
};

export default wishlistService;
