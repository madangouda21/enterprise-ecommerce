import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminProductService from "../../services/adminProductService";
import inventoryService from "../../services/inventoryService";

const categories = ["ELECTRONICS", "CLOTHING", "BOOKS", "HOME", "SPORTS", "OTHER"];

function AdminCreateProduct() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", description: "", price: "", quantity: "", category: "ELECTRONICS" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const change = e => setForm(current => ({ ...current, [e.target.name]: e.target.value }));

    const submit = async e => {
        e.preventDefault(); setError("");
        if (!form.name.trim()) return setError("Product name is required.");
        if (form.price === "" || Number(form.price) <= 0) return setError("Enter a valid price.");
        if (form.quantity === "" || Number(form.quantity) < 0) return setError("Enter a valid quantity.");
        try {
            setLoading(true);
            const product = await adminProductService.createProduct({
                name: form.name.trim(), description: form.description.trim(), price: Number(form.price), quantity: Number(form.quantity), category: form.category
            });
            try {
                await inventoryService.createInventory({
                    productId: product.id,
                    quantity: Number(form.quantity)
                });
            } catch (inventoryError) {
                console.warn("Inventory record was not created automatically:", inventoryError);
            }

            navigate(`/admin/products/${product.id}/edit`);
        } catch (err) { setError(err.message || "Unable to create product."); }
        finally { setLoading(false); }
    };

    return <div className="admin-page">
        <div className="admin-page-header"><div><span className="admin-eyebrow">CATALOG</span><h1>Add Product</h1><p>Create the product first, then upload its images and videos.</p></div><Link className="admin-secondary" to="/admin/products">← Products</Link></div>
        {error && <div className="admin-error">{error}</div>}
        <form className="admin-form-card" onSubmit={submit}>
            <div className="admin-form-section"><h2>Product information</h2><p>These fields match the Product Service CreateProductRequest.</p></div>
            <div className="admin-form-grid"><label>Product name<input name="name" value={form.name} onChange={change} placeholder="iPhone 17" disabled={loading} /></label><label>Category<select name="category" value={form.category} onChange={change} disabled={loading}>{categories.map(item => <option key={item}>{item}</option>)}</select></label><label>Price<input type="number" min="0.01" step="0.01" name="price" value={form.price} onChange={change} placeholder="79999" disabled={loading} /></label><label>Quantity<input type="number" min="0" name="quantity" value={form.quantity} onChange={change} placeholder="25" disabled={loading} /></label></div>
            <label className="admin-form-full">Description<textarea name="description" value={form.description} onChange={change} rows="7" placeholder="Describe the product..." disabled={loading} /></label>
            <div className="admin-form-actions"><Link className="admin-secondary" to="/admin/products">Cancel</Link><button className="admin-primary" disabled={loading}>{loading ? "Creating..." : "Create Product"}</button></div>
        </form>
    </div>;
}

export default AdminCreateProduct;
