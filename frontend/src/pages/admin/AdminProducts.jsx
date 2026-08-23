import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import adminProductService from "../../services/adminProductService";

const categories = ["ALL", "ELECTRONICS", "CLOTHING", "BOOKS", "HOME", "SPORTS", "OTHER"];
const money = value => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProducts = async () => {
        try {
            setLoading(true); setError("");
            const data = await adminProductService.getAllProducts();
            setProducts(Array.isArray(data) ? data : data?.content || []);
        } catch (err) { setError(err.message || "Unable to load products."); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadProducts(); }, []);

    const filtered = useMemo(() => products.filter(product => {
        const matchesSearch = `${product.name || ""} ${product.description || ""}`.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "ALL" || product.category === category;
        return matchesSearch && matchesCategory;
    }), [products, search, category]);

    const remove = async id => {
        if (!window.confirm("Delete this product? This cannot be undone.")) return;
        try {
            await adminProductService.deleteProduct(id);
            setProducts(current => current.filter(product => product.id !== id));
        } catch (err) { window.alert(err.message || "Unable to delete product."); }
    };

    if (loading) return <div className="admin-page"><div className="loading-container"><div className="loading-spinner" /><p>Loading products...</p></div></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><span className="admin-eyebrow">CATALOG</span><h1>Manage Products</h1><p>Create, update, delete and manage product media.</p></div>
                <Link className="admin-primary" to="/admin/products/create">+ Add Product</Link>
            </div>
            {error && <div className="admin-error">{error}<button onClick={loadProducts}>Retry</button></div>}

            <div className="admin-toolbar">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." />
                <select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select>
                <span>{filtered.length} of {products.length} products</span>
            </div>

            {filtered.length === 0 ? <div className="admin-empty"><div>📦</div><h2>No products found</h2><p>Try another search or create a new product.</p></div> : (
                <div className="admin-product-list">
                    {filtered.map(product => {
                        const image = (product.media || []).find(item => item.mediaType === "IMAGE");
                        return <article key={product.id} className="admin-product-row">
                            <div className="admin-product-thumb">{image ? <img src={image.url} alt={product.name} /> : <span>📦</span>}</div>
                            <div className="admin-product-main"><h3>{product.name}</h3><p>{product.description || "No description"}</p><div className="admin-product-meta"><span>{product.category}</span><span>{money(product.price)}</span><span>Stock: {product.quantity}</span><span>{(product.media || []).length} media</span></div></div>
                            <div className="admin-row-actions"><Link to={`/admin/products/${product.id}/edit`}>Edit</Link><button onClick={() => remove(product.id)}>Delete</button></div>
                        </article>;
                    })}
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
