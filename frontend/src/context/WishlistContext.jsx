import {
    createContext,
    useContext,
    useState
} from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {

    const [wishlistItems, setWishlistItems] = useState([]);


    const isInWishlist = (productId) => {

        return wishlistItems.some(
            (item) =>
                (item.id ?? item.productId) === productId
        );
    };


    const addToWishlist = (product) => {

        const productId =
            product.id ??
            product.productId;

        setWishlistItems((previousItems) => {

            const exists = previousItems.some(
                (item) =>
                    (item.id ?? item.productId) === productId
            );

            if (exists) {
                return previousItems;
            }

            return [
                ...previousItems,
                product
            ];
        });
    };


    const removeFromWishlist = (productId) => {

        setWishlistItems((previousItems) =>
            previousItems.filter(
                (item) =>
                    (item.id ?? item.productId) !== productId
            )
        );
    };


    const toggleWishlist = (product) => {

        const productId =
            product.id ??
            product.productId;

        if (isInWishlist(productId)) {

            removeFromWishlist(productId);

        } else {

            addToWishlist(product);

        }
    };


    const clearWishlist = () => {
        setWishlistItems([]);
    };


    const wishlistCount =
        wishlistItems.length;


    const value = {
        wishlistItems,
        wishlistCount,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist
    };


    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}


export function useWishlist() {

    return useContext(WishlistContext);
}