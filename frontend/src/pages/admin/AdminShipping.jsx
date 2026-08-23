import { useEffect, useState } from "react";
import shippingService from "../../services/shippingService";

const statuses = ["PENDING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

function AdminShipping() {
    const [shipments, setShipments] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
    const load = async () => { try { setLoading(true); setError(""); setShipments(await shippingService.getShipping()); } catch (err) { setError(err.message || "Unable to load shipping."); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);
    const update = async (id, status) => { try { const updated = await shippingService.updateShippingStatus(id, status); setShipments(current => current.map(item => item.id === id ? updated : item)); } catch (err) { window.alert(err.message || "Unable to update shipment."); } };
    if (loading) return <div className="admin-page"><div className="loading-container"><div className="loading-spinner" /><p>Loading shipping...</p></div></div>;
    return <div className="admin-page"><div className="admin-page-header"><div><span className="admin-eyebrow">FULFILMENT</span><h1>Shipping</h1><p>Track shipments and update delivery status.</p></div></div>{error && <div className="admin-error">{error}<button onClick={load}>Retry</button></div>}<div className="admin-panel-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Shipment</th><th>Order</th><th>User</th><th>Address</th><th>Tracking</th><th>Status</th></tr></thead><tbody>{shipments.map(item => <tr key={item.id}><td>#{item.id}</td><td>#{item.orderId}</td><td>{item.userId}</td><td>{[item.shippingAddress, item.city, item.state, item.postalCode].filter(Boolean).join(", ")}</td><td>{item.trackingNumber || "—"}</td><td><select className="admin-inline-select" value={item.status} onChange={e => update(item.id, e.target.value)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>{shipments.length === 0 && <div className="admin-empty-small">No shipping records found.</div>}</div></div>;
}
export default AdminShipping;
