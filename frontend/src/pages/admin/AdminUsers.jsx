import { useEffect, useState } from "react";
import userService from "../../services/userService";

function AdminUsers() {
    const [users, setUsers] = useState([]); const [search, setSearch] = useState(""); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
    const load = async () => { try { setLoading(true); setError(""); setUsers(await userService.getAllUsers()); } catch (err) { setError(err.message || "Unable to load users."); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);
    const filtered = users.filter(user => `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase()));
    const remove = async id => { if (!window.confirm("Delete this user?")) return; try { await userService.deleteUser(id); setUsers(current => current.filter(user => user.id !== id)); } catch (err) { window.alert(err.message || "Unable to delete user."); } };
    if (loading) return <div className="admin-page"><div className="loading-container"><div className="loading-spinner" /><p>Loading users...</p></div></div>;
    return <div className="admin-page"><div className="admin-page-header"><div><span className="admin-eyebrow">CUSTOMERS</span><h1>Users</h1><p>View and manage user profiles stored by User Service.</p></div></div>{error && <div className="admin-error">{error}<button onClick={load}>Retry</button></div>}<div className="admin-toolbar"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." /><span>{filtered.length} users</span></div><div className="admin-panel-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Role</th><th>Action</th></tr></thead><tbody>{filtered.map(user => <tr key={user.id}><td>#{user.id}</td><td>{user.firstName} {user.lastName}</td><td>{user.email}</td><td>{user.phone || "—"}</td><td>{[user.city, user.state].filter(Boolean).join(", ") || "—"}</td><td><span className="admin-role">{user.role}</span></td><td><button className="admin-table-danger" onClick={() => remove(user.id)}>Delete</button></td></tr>)}</tbody></table></div></div></div>;
}
export default AdminUsers;
