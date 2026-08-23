import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {

    const location = useLocation();

    const {
        user,
        isAuthenticated,
        loading
    } = useAuth();


    // Wait for AuthContext
    if (loading) {

        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>

                <p>
                    Checking admin access...
                </p>
            </div>
        );

    }


    // Not logged in
    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                state={{
                    from: location
                }}
                replace
            />
        );

    }


    // Admin check
    if (
        user?.role !== "ROLE_ADMIN"
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    return children;
}

export default AdminRoute;