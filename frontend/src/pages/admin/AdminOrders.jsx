import { useEffect, useState } from "react";
import orderService from "../../services/orderService";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const money = value => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function AdminOrders() {
    const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
    const load = async () => { try { setLoading(true); setError(""); setOrders(await orderService.getOrders()); } catch (err) { setError(err.message || "Unable to load orders."); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);
    const status = async (id, value) => { try { const updated = await orderService.updateOrderStatus(id, value); setOrders(current => current.map(order => order.id === id ? updated : order)); } catch (err) { window.alert(err.message || "Unable to update order."); } };
    const remove = async id => { if (!window.confirm("Delete this order?")) return; try { await orderService.deleteOrder(id); setOrders(current => current.filter(order => order.id !== id)); } catch (err) { window.alert(err.message || "Unable to delete order."); } };
    if (loading) return <div className="admin-page"><div className="loading-container"><div className="loading-spinner" /><p>Loading orders...</p></div></div>;
    return <div className="admin-page"><div className="admin-page-header"><div><span className="admin-eyebrow">SALES</span><h1>Orders</h1><p>Review orders and update their lifecycle status.</p></div></div>{error && <div className="admin-error">{error}<button onClick={load}>Retry</button></div>}<div className="admin-panel-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>User</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td>#{order.id}</td><td>{order.userId}</td><td>{order.items?.length || 0}</td><td>{money(order.totalAmount)}</td><td><select className="admin-inline-select" value={order.status} onChange={e => status(order.id, e.target.value)}>{statuses.map(item => <option key={item}>{item}</option>)}</select></td><td><button className="admin-table-danger" onClick={() => remove(order.id)}>Delete</button></td></tr>)}</tbody></table></div>{orders.length === 0 && <div className="admin-empty-small">No orders found.</div>}</div></div>;
}
export default AdminOrders;
