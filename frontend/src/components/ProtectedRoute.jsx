import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";


function ProtectedRoute({ children }) {

    const location = useLocation();

    const {
        isAuthenticated,
        loading
    } = useAuth();


    if (loading) {

        return (
            <Loading
                message="Checking authentication..."
            />
        );

    }


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


    return children;
}


export default ProtectedRoute;