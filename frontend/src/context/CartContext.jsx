import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import cartService from "../services/cartService";
import productService from "../services/productService";
import { useAuth } from "./AuthContext";


const CartContext = createContext(null);


export function CartProvider({ children }) {

    const {
        user,
        isAuthenticated
    } = useAuth();


    const [cartItems, setCartItems] = useState([]);

    const [loading, setLoading] = useState(false);


    const userId =
        user?.id ??
        user?.userId;


    /* =========================
       LOAD CART
    ========================= */

    const loadCart = async () => {

        if (!isAuthenticated || !userId) {

            setCartItems([]);

            return;
        }


        try {

            setLoading(true);


            const response =
                await cartService.getCart(
                    userId
                );


            const data =
                response?.data ??
                response;


            const items =
                data?.items ??
                data?.cartItems ??
                (Array.isArray(data)
                    ? data
                    : []);


            /* =========================
               LOAD PRODUCT DETAILS
            ========================= */

            const enrichedItems =
                await Promise.all(

                    items.map(async (item) => {

                        try {

                            const productId =
                                item.productId ??
                                item.product?.id;


                            if (!productId) {

                                return item;

                            }


                            const product =
                                await productService.getProductById(
                                    productId
                                );


                            return {

                                ...item,

                                product:
                                    product?.data ??
                                    product

                            };

                        } catch (error) {

                            console.error(
                                `Failed to load product ${item.productId}:`,
                                error
                            );


                            return item;

                        }

                    })

                );


            setCartItems(
                enrichedItems
            );

        } catch (error) {

            console.error(
                "Failed to load cart:",
                error
            );


            setCartItems([]);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadCart();

    }, [
        isAuthenticated,
        userId
    ]);


    /* =========================
       ADD TO CART
    ========================= */

    const addToCart = async (
        product,
        quantity = 1
    ) => {

        if (!isAuthenticated || !userId) {

            throw new Error(
                "Please login to add products to cart."
            );

        }


        const productId =
            product?.id ??
            product?.productId;


        if (!productId) {

            throw new Error(
                "Product ID is missing."
            );

        }


        await cartService.addToCart(
            userId,
            productId,
            quantity
        );


        await loadCart();

    };


    /* =========================
       UPDATE QUANTITY
    ========================= */

    const updateQuantity = async (
        cartItemId,
        quantity
    ) => {

        if (!cartItemId) {

            throw new Error(
                "Cart item ID is missing."
            );

        }


        if (quantity < 1) {

            return;

        }


        await cartService.updateQuantity(
            userId,
            cartItemId,
            quantity
        );


        await loadCart();

    };


    /* =========================
       REMOVE ITEM
    ========================= */

    const removeFromCart = async (
        cartItemId
    ) => {

        if (!cartItemId) {

            throw new Error(
                "Cart item ID is missing."
            );

        }


        await cartService.removeFromCart(
            userId,
            cartItemId
        );


        await loadCart();

    };


    /* =========================
       CLEAR CART
    ========================= */

    const clearCart = async () => {

        if (!userId) {

            return;

        }


        await cartService.clearCart(
            userId
        );


        setCartItems([]);

    };


    /* =========================
       CART COUNT
    ========================= */

    const cartCount = useMemo(() => {

        return cartItems.reduce(

            (total, item) => {

                return total +
                    Number(
                        item.quantity ?? 0
                    );

            },

            0

        );

    }, [cartItems]);


    /* =========================
       CART TOTAL
    ========================= */

    const cartTotal = useMemo(() => {

        return cartItems.reduce(

            (total, item) => {

                const product =
                    item.product ??
                    {};


                const price =
                    Number(
                        product.price ??
                        item.price ??
                        item.unitPrice ??
                        0
                    );


                const quantity =
                    Number(
                        item.quantity ?? 1
                    );


                return total +
                    price *
                    quantity;

            },

            0

        );

    }, [cartItems]);


    /* =========================
       CONTEXT VALUE
    ========================= */

    const value = {

        cartItems,

        cartCount,

        cartTotal,

        loading,

        loadCart,

        addToCart,

        updateQuantity,

        removeFromCart,

        clearCart

    };


    return (

        <CartContext.Provider
            value={value}
        >

            {children}

        </CartContext.Provider>

    );

}


export function useCart() {

    const context =
        useContext(CartContext);


    if (!context) {

        throw new Error(
            "useCart must be used inside CartProvider."
        );

    }


    return context;

}


export default CartContext;