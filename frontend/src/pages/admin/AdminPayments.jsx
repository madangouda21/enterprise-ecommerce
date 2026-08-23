import { useEffect, useState } from "react";
import paymentService from "../../services/paymentService";

const statuses = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"];
const money = value => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function AdminPayments() {
    const [payments, setPayments] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
    const load = async () => { try { setLoading(true); setError(""); setPayments(await paymentService.getPayments()); } catch (err) { setError(err.message || "Unable to load payments."); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);
    const update = async (id, status) => { try { const updated = await paymentService.updatePaymentStatus(id, status); setPayments(current => current.map(payment => payment.id === id ? updated : payment)); } catch (err) { window.alert(err.message || "Unable to update payment."); } };
    if (loading) return <div className="admin-page"><div className="loading-container"><div className="loading-spinner" /><p>Loading payments...</p></div></div>;
    return <div className="admin-page"><div className="admin-page-header"><div><span className="admin-eyebrow">FINANCE</span><h1>Payments</h1><p>Review payment transactions and statuses.</p></div></div>{error && <div className="admin-error">{error}<button onClick={load}>Retry</button></div>}<div className="admin-panel-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Payment</th><th>Order</th><th>User</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead><tbody>{payments.map(payment => <tr key={payment.id}><td>#{payment.id}</td><td>#{payment.orderId}</td><td>{payment.userId}</td><td>{money(payment.amount)}</td><td>{payment.paymentMethod}</td><td><select className="admin-inline-select" value={payment.status} onChange={e => update(payment.id, e.target.value)}>{statuses.map(item => <option key={item}>{item}</option>)}</select></td></tr>)}</tbody></table></div>{payments.length === 0 && <div className="admin-empty-small">No payments found.</div>}</div></div>;
}
export default AdminPayments;
