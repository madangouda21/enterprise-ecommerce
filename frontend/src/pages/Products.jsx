import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import productService from "../services/productService";


function Products() {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("ALL");

    const [sort, setSort] = useState("DEFAULT");


    /* =========================
       LOAD PRODUCTS
    ========================= */

    useEffect(() => {

        const loadProducts = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await productService.getAllProducts();


                /*
                 * Depending on the backend response,
                 * support either:
                 *
                 * [...]
                 *
                 * or:
                 *
                 * {
                 *     content: [...]
                 * }
                 */

                const data =
                    response?.data ??
                    response;


                const productList =
                    Array.isArray(data)
                        ? data
                        : data?.content ??
                          data?.products ??
                          [];


                setProducts(productList);

            } catch (err) {

                console.error(
                    "Products loading error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load products."
                );

            } finally {

                setLoading(false);

            }

        };


        loadProducts();

    }, []);


    /* =========================
       CATEGORIES
    ========================= */

    const categories = useMemo(() => {

        const values = products
            .map(
                (product) =>
                    product.category
            )
            .filter(Boolean);


        return [
            ...new Set(values)
        ];

    }, [products]);


    /* =========================
       FILTER + SORT
    ========================= */

    const filteredProducts = useMemo(() => {

        let result = [...products];


        /* =========================
           SEARCH
        ========================= */

        if (search.trim()) {

            const query =
                search
                    .trim()
                    .toLowerCase();


            result = result.filter(
                (product) => {

                    const name =
                        product.name ??
                        "";


                    const description =
                        product.description ??
                        "";


                    const productCategory =
                        product.category ??
                        "";


                    return (
                        name
                            .toLowerCase()
                            .includes(query) ||

                        description
                            .toLowerCase()
                            .includes(query) ||

                        String(
                            productCategory
                        )
                            .toLowerCase()
                            .includes(query)
                    );

                }
            );

        }


        /* =========================
           CATEGORY FILTER
        ========================= */

        if (category !== "ALL") {

            result = result.filter(
                (product) =>
                    String(
                        product.category
                    ) === category
            );

        }


        /* =========================
           PRICE LOW → HIGH
        ========================= */

        if (sort === "PRICE_LOW") {

            result.sort(
                (a, b) =>
                    Number(a.price ?? 0) -
                    Number(b.price ?? 0)
            );

        }


        /* =========================
           PRICE HIGH → LOW
        ========================= */

        if (sort === "PRICE_HIGH") {

            result.sort(
                (a, b) =>
                    Number(b.price ?? 0) -
                    Number(a.price ?? 0)
            );

        }


        /* =========================
           NAME
        ========================= */

        if (sort === "NAME") {

            result.sort(
                (a, b) => {

                    const nameA =
                        a.name ?? "";

                    const nameB =
                        b.name ?? "";


                    return nameA.localeCompare(
                        nameB
                    );

                }
            );

        }


        return result;

    }, [
        products,
        search,
        category,
        sort
    ]);


    /* =========================
       PRODUCT CARD
    ========================= */

    const renderProduct = (
        product
    ) => {

        const id =
            product.id;


        const name =
            product.name ??
            "Product";


        const price =
            Number(
                product.price ?? 0
            );


        /*
         * Your backend returns:
         *
         * media: [
         *     {
         *         mediaType: "IMAGE",
         *         url: "http://localhost:8083/..."
         *     },
         *     {
         *         mediaType: "VIDEO",
         *         url: "http://localhost:8083/..."
         *     }
         * ]
         */

        const imageMedia =
            product.media?.find(
                (media) =>
                    media.mediaType === "IMAGE"
            );


        const image =
            imageMedia?.url ??
            "";


        const productCategory =
            product.category ??
            "";


        const stock =
            Number(
                product.quantity ?? 0
            );


        /*
         * Rating is not currently returned
         * by your Product Service.
         *
         * Keep zero until rating/review
         * functionality is implemented.
         */

        const rating = 0;

        const reviewCount = 0;


        /*
         * Your current ProductResponse
         * does not contain originalPrice.
         *
         * Therefore don't show a fake
         * discount.
         */

        const originalPrice =
            price;


        const discount = 0;


        return (

            <Link
                key={id}
                to={`/products/${id}`}
                className="product-card"
            >

                {/* =========================
                    PRODUCT IMAGE
                ========================= */}

                <div className="product-image">

                    {discount > 0 && (

                        <span className="discount-badge">
                            -{discount}%
                        </span>

                    )}


                    {image ? (

                        <img
                            src={image}
                            alt={name}
                        />

                    ) : (

                        <div className="product-image-placeholder">
                            🛍️
                        </div>

                    )}

                </div>


                {/* =========================
                    PRODUCT INFO
                ========================= */}

                <div className="product-info">


                    {/* =========================
                        RATING
                    ========================= */}

                    <div className="product-rating">

                        <span>

                            {"★".repeat(
                                Math.round(rating)
                            )}

                            {"☆".repeat(
                                Math.max(
                                    0,
                                    5 -
                                    Math.round(
                                        rating
                                    )
                                )
                            )}

                        </span>


                        {reviewCount > 0 && (

                            <small>
                                ({reviewCount})
                            </small>

                        )}

                    </div>


                    {/* =========================
                        PRODUCT NAME
                    ========================= */}

                    <h3>
                        {name}
                    </h3>


                    {/* =========================
                        CATEGORY
                    ========================= */}

                    {productCategory && (

                        <p className="product-category">
                            {productCategory}
                        </p>

                    )}


                    {/* =========================
                        PRICE
                    ========================= */}

                    <div className="product-price">

                        <strong>
                            ₹{price.toFixed(2)}
                        </strong>


                        {originalPrice > price && (

                            <del>
                                ₹
                                {originalPrice.toFixed(
                                    2
                                )}
                            </del>

                        )}

                    </div>


                    {/* =========================
                        STOCK
                    ========================= */}

                    {stock <= 0 && (

                        <div className="product-out-of-stock">
                            Out of Stock
                        </div>

                    )}

                </div>

            </Link>

        );

    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="products-page">

                <div className="loading-container">

                    <div className="loading-spinner" />

                    <p>
                        Loading products...
                    </p>

                </div>

            </div>

        );

    }


    /* =========================
       ERROR
    ========================= */

    if (error) {

        return (

            <div className="products-page">

                <div className="empty-products-page">

                    <div>
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Products
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );

    }


    /* =========================
       PAGE
    ========================= */

    return (

        <div className="products-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="products-header">

                <div>

                    <h1>
                        All Products
                    </h1>

                    <p>
                        Discover products you'll love.
                    </p>

                </div>


                {/* =========================
                    SEARCH
                ========================= */}

                <div className="products-search">

                    🔍

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search products..."
                    />

                </div>

            </div>


            <div className="products-layout">


                {/* =========================
                    FILTERS
                ========================= */}

                <aside className="filters">

                    <h3>
                        Filters
                    </h3>


                    <div className="filter-group">

                        <h4>
                            Category
                        </h4>


                        {/* ALL */}

                        <button
                            type="button"
                            className={
                                category === "ALL"
                                    ? "filter-active"
                                    : ""
                            }
                            onClick={() =>
                                setCategory("ALL")
                            }
                        >
                            All Products
                        </button>


                        {/* CATEGORIES */}

                        {categories.map(
                            (item) => (

                                <button
                                    key={item}
                                    type="button"
                                    className={
                                        category === item
                                            ? "filter-active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setCategory(
                                            item
                                        )
                                    }
                                >
                                    {item}
                                </button>

                            )
                        )}

                    </div>

                </aside>


                {/* =========================
                    PRODUCTS CONTENT
                ========================= */}

                <div className="products-content">


                    {/* =========================
                        TOOLBAR
                    ========================= */}

                    <div className="products-toolbar">

                        <span>
                            {filteredProducts.length}{" "}
                            products found
                        </span>


                        <select
                            value={sort}
                            onChange={(event) =>
                                setSort(
                                    event.target.value
                                )
                            }
                        >

                            <option value="DEFAULT">
                                Sort: Default
                            </option>

                            <option value="PRICE_LOW">
                                Price: Low to High
                            </option>

                            <option value="PRICE_HIGH">
                                Price: High to Low
                            </option>

                            <option value="NAME">
                                Name
                            </option>

                        </select>

                    </div>


                    {/* =========================
                        EMPTY STATE
                    ========================= */}

                    {filteredProducts.length === 0 ? (

                        <div className="empty-products">
                            No products found.
                        </div>

                    ) : (


                        /* =========================
                           PRODUCT GRID
                        ========================= */

                        <div className="products-grid">

                            {filteredProducts.map(
                                renderProduct
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}


export default Products;