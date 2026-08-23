import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminStatsService from "../../services/adminStatsService";

const money = value => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async () => {
        try {
            setLoading(true);
            setError("");
            setData(await adminStatsService.load());
        } catch (err) {
            setError(err.message || "Unable to load dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) {
        return <div className="admin-page"><div className="loading-container"><div className="loading-spinner" /><p>Loading admin dashboard...</p></div></div>;
    }

    if (!data) {
        return <div className="admin-page"><div className="admin-error">{error || "Unable to load dashboard."}<button onClick={load}>Retry</button></div></div>;
    }

    const revenue = data.payments
        .filter(payment => payment.status === "SUCCESS")
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const lowStock = data.inventory.filter(item => Number(item.quantity || 0) <= 5);
    const recentOrders = [...data.orders].slice(-5).reverse();

    const cards = [
        ["📦", "Products", data.products.length, "/admin/products"],
        ["👥", "Users", data.users.length, "/admin/users"],
        ["🧾", "Orders", data.orders.length, "/admin/orders"],
        ["💳", "Payments", data.payments.length, "/admin/payments"],
        ["📊", "Inventory", data.inventory.length, "/admin/inventory"],
        ["🚚", "Shipping", data.shipping.length, "/admin/shipping"]
    ];

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <span className="admin-eyebrow">ADMIN PANEL</span>
                    <h1>Dashboard</h1>
                    <p>Monitor your store and manage the complete backend from one place.</p>
                </div>
                <Link className="admin-primary" to="/admin/products/create">+ Add Product</Link>
            </div>

            {data.errors > 0 && (
                <div className="admin-warning">Some services could not be loaded. The available information is still shown.</div>
            )}

            {error && <div className="admin-error">{error}</div>}

            <div className="admin-stat-grid">
                {cards.map(([icon, title, value, to]) => (
                    <Link key={title} to={to} className="admin-stat-card">
                        <div className="admin-stat-icon">{icon}</div>
                        <div><span>{title}</span><strong>{value}</strong></div>
                        <b>→</b>
                    </Link>
                ))}
            </div>

            <div className="admin-dashboard-columns">
                <section className="admin-panel-card">
                    <div className="admin-panel-title"><div><h2>Revenue</h2><p>Successful payments</p></div><strong>{money(revenue)}</strong></div>
                    <div className="admin-revenue-box">{data.payments.filter(p => p.status === "SUCCESS").length} successful transactions</div>
                </section>

                <section className="admin-panel-card">
                    <div className="admin-panel-title"><div><h2>Low Stock</h2><p>Products at or below 5 units</p></div><strong>{lowStock.length}</strong></div>
                    {lowStock.length === 0 ? <div className="admin-empty-small">Everything is sufficiently stocked.</div> : (
                        <div className="admin-mini-list">
                            {lowStock.slice(0, 5).map(item => <div key={item.id}><span>Product #{item.productId}</span><strong>{item.quantity} left</strong></div>)}
                        </div>
                    )}
                </section>
            </div>

            <section className="admin-panel-card">
                <div className="admin-panel-title"><div><h2>Recent Orders</h2><p>Latest orders returned by Order Service</p></div><Link to="/admin/orders">View all →</Link></div>
                {recentOrders.length === 0 ? <div className="admin-empty-small">No orders found.</div> : (
                    <div className="admin-table-wrap">
                        <table className="admin-table"><thead><tr><th>ID</th><th>User</th><th>Status</th><th>Total</th></tr></thead><tbody>
                            {recentOrders.map(order => <tr key={order.id}><td>#{order.id}</td><td>{order.userId}</td><td><span className={`admin-status status-${String(order.status).toLowerCase()}`}>{order.status}</span></td><td>{money(order.totalAmount)}</td></tr>)}
                        </tbody></table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default AdminDashboard;
