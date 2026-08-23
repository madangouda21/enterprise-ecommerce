import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import adminProductService from "../../services/adminProductService";
import inventoryService from "../../services/inventoryService";

const categories = ["ELECTRONICS", "CLOTHING", "BOOKS", "HOME", "SPORTS", "OTHER"];

function AdminEditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [form, setForm] = useState(null);
    const [media, setMedia] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const load = async () => {
        try {
            setLoading(true); setError("");
            const product = await adminProductService.getProductById(id);
            setForm({ name: product.name || "", description: product.description || "", price: product.price ?? "", quantity: product.quantity ?? "", category: product.category || "OTHER" });
            setMedia(product.media || await adminProductService.getProductMedia(id));
        } catch (err) { setError(err.message || "Unable to load product."); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [id]);
    const change = e => setForm(current => ({ ...current, [e.target.name]: e.target.value }));

    const save = async e => {
        e.preventDefault(); setError(""); setMessage("");
        try {
            setSaving(true);
            await adminProductService.updateProduct(id, { name: form.name.trim(), description: form.description.trim(), price: Number(form.price), quantity: Number(form.quantity), category: form.category });

            try {
                await inventoryService.updateInventory(id, {
                    quantity: Number(form.quantity)
                });
            } catch (inventoryError) {
                try {
                    await inventoryService.createInventory({
                        productId: Number(id),
                        quantity: Number(form.quantity)
                    });
                } catch (createInventoryError) {
                    console.warn("Inventory was not synchronized:", createInventoryError);
                }
            }

            setMessage("Product updated successfully.");
        } catch (err) { setError(err.message || "Unable to update product."); }
        finally { setSaving(false); }
    };

    const upload = async () => {
        if (!file) return setError("Choose an image or video first.");
        try {
            setUploading(true); setError(""); setMessage("");
            const uploaded = await adminProductService.uploadProductMedia(id, file);
            setMedia(current => [...current, uploaded]); setFile(null); if (inputRef.current) inputRef.current.value = "";
            setMessage("Media uploaded successfully.");
        } catch (err) { setError(err.message || "Unable to upload media."); }
        finally { setUploading(false); }
    };

    const removeMedia = async mediaId => {
        if (!window.confirm("Delete this media file?")) return;
        try { await adminProductService.deleteProductMedia(mediaId); setMedia(current => current.filter(item => item.id !== mediaId)); }
        catch (err) { setError(err.message || "Unable to delete media."); }
    };

    if (loading) return <div className="admin-page"><div className="loading-container"><div className="loading-spinner" /><p>Loading product...</p></div></div>;
    if (!form) return <div className="admin-page"><div className="admin-error">{error || "Product not found."}</div></div>;

    return <div className="admin-page">
        <div className="admin-page-header"><div><span className="admin-eyebrow">PRODUCT #{id}</span><h1>Edit Product</h1><p>Update product information and manage media.</p></div><Link className="admin-secondary" to="/admin/products">← Products</Link></div>
        {error && <div className="admin-error">{error}</div>}{message && <div className="admin-success">{message}</div>}
        <form className="admin-form-card" onSubmit={save}><div className="admin-form-section"><h2>Product information</h2></div><div className="admin-form-grid"><label>Product name<input name="name" value={form.name} onChange={change} /></label><label>Category<select name="category" value={form.category} onChange={change}>{categories.map(item => <option key={item}>{item}</option>)}</select></label><label>Price<input type="number" min="0.01" step="0.01" name="price" value={form.price} onChange={change} /></label><label>Quantity<input type="number" min="0" name="quantity" value={form.quantity} onChange={change} /></label></div><label className="admin-form-full">Description<textarea name="description" value={form.description} onChange={change} rows="7" /></label><div className="admin-form-actions"><button type="button" className="admin-secondary" onClick={() => navigate("/admin/products")}>Cancel</button><button className="admin-primary" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button></div></form>
        <section className="admin-panel-card"><div className="admin-panel-title"><div><h2>Product Media</h2><p>Product Service accepts image/* and video/* files.</p></div></div><div className="admin-upload-row"><input ref={inputRef} type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files?.[0] || null)} /><button className="admin-primary" type="button" onClick={upload} disabled={uploading}>{uploading ? "Uploading..." : "Upload Media"}</button></div>{file && <p className="admin-file-name">Selected: {file.name}</p>}{media.length === 0 ? <div className="admin-empty-small">No media uploaded yet.</div> : <div className="admin-media-grid">{media.map(item => <div className="admin-media-item" key={item.id}>{item.mediaType === "VIDEO" ? <video src={item.url} controls /> : <img src={item.url} alt={item.fileName} />}<div><strong>{item.fileName}</strong><span>{item.mediaType}</span><button onClick={() => removeMedia(item.id)}>Delete</button></div></div>)}</div>}</section>
    </div>;
}

export default AdminEditProduct;
