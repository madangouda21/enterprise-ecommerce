import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import authService from "../services/authService";
import userService from "../services/userService";

const AuthContext = createContext(null);

function decodeToken(token) {
    try {
        const parts = token.split(".");

        if (parts.length !== 3) {
            return null;
        }

        const base64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const padded =
            base64 + "=".repeat((4 - (base64.length % 4)) % 4);

        return JSON.parse(atob(padded));
    } catch (error) {
        console.error("Unable to decode JWT:", error);
        return null;
    }
}

function isTokenExpired(payload) {
    if (!payload?.exp) {
        return false;
    }

    return Date.now() >= Number(payload.exp) * 1000;
}

function getRole(payload) {
    const role = payload?.role ?? payload?.roles;

    if (Array.isArray(role)) {
        return role[0];
    }

    return role;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const clearSession = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
    };

    const buildUser = (payload, profile = null) => ({
        id: profile?.id ?? profile?.userId,
        userId: profile?.id ?? profile?.userId,
        firstName: profile?.firstName ?? "",
        lastName: profile?.lastName ?? "",
        email: profile?.email ?? payload?.sub ?? "",
        phone: profile?.phone ?? "",
        address: profile?.address ?? "",
        city: profile?.city ?? "",
        state: profile?.state ?? "",
        country: profile?.country ?? "",
        postalCode: profile?.postalCode ?? "",
        role: profile?.role ?? getRole(payload),
        username: profile?.email ?? payload?.sub ?? ""
    });

    const restoreSession = async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setLoading(false);
            return;
        }

        const payload = decodeToken(token);

        if (!payload || isTokenExpired(payload)) {
            clearSession();
            setLoading(false);
            return;
        }

        try {
            let profile = null;

            try {
                profile = await userService.getProfile();
            } catch (profileError) {
                console.warn("Unable to restore user profile:", profileError);
            }

            const loggedInUser = buildUser(payload, profile);

            localStorage.setItem("user", JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Session restoration error:", error);
            clearSession();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        restoreSession();
    }, []);

    const login = async (email, password) => {
        const response = await authService.login(email, password);

        const token =
            response?.token ??
            response?.accessToken ??
            response?.data?.token ??
            response?.data?.accessToken;

        if (!token) {
            throw new Error("Authentication token was not returned.");
        }

        localStorage.setItem("accessToken", token);

        const payload = decodeToken(token);

        if (!payload || isTokenExpired(payload)) {
            localStorage.removeItem("accessToken");
            throw new Error("Invalid or expired authentication token.");
        }

        let profile = null;

        try {
            profile = await userService.getProfile();
        } catch (profileError) {
            console.warn("Unable to load user profile after login:", profileError);
        }

        const loggedInUser = buildUser(payload, profile);

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setIsAuthenticated(true);

        return {
            ...response,
            user: loggedInUser
        };
    };

    const register = async (userData) => {
        return authService.register(userData);
    };

    const logout = () => {
        clearSession();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                register,
                logout,
                clearSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider.");
    }

    return context;
}

export default AuthContext;
