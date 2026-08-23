import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const location = useLocation();

    const {
        login
    } = useAuth();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const from =
        location.state?.from?.pathname ||
        "/";


    // =====================================================
    // LOGIN
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // -----------------------------------------------
        // VALIDATION
        // -----------------------------------------------

        if (!email.trim()) {

            setError(
                "Please enter your email."
            );

            return;
        }


        if (!password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            // -------------------------------------------
            // LOGIN
            // -------------------------------------------

            const response =
                await login(
                    email.trim(),
                    password
                );


            console.log(
                "Login response:",
                response
            );


            // -------------------------------------------
            // GET LOGGED-IN USER
            // -------------------------------------------

            const loggedInUser =
                response?.user;


            console.log(
                "Logged-in user:",
                loggedInUser
            );


            // -------------------------------------------
            // ADMIN
            // -------------------------------------------

            if (
                loggedInUser?.role ===
                "ROLE_ADMIN"
            ) {

                navigate(
                    "/admin",
                    {
                        replace: true
                    }
                );

                return;
            }


            // -------------------------------------------
            // CUSTOMER
            // -------------------------------------------

            navigate(
                from,
                {
                    replace: true
                }
            );


        } catch (err) {

            console.error(
                "Login error:",
                err
            );


            setError(
                err.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* =========================
                    LOGO
                ========================= */}

                <Link
                    to="/"
                    className="auth-logo"
                >
                    Shop<span>Sphere</span>
                </Link>


                {/* =========================
                    HEADER
                ========================= */}

                <div className="auth-header">

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Login to your account
                        to continue shopping.
                    </p>

                </div>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="auth-error">

                        {error}

                    </div>

                )}


                {/* =========================
                    FORM
                ========================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >


                    {/* EMAIL */}

                    <div className="auth-form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="auth-form-group">

                        <div className="password-label">

                            <label htmlFor="password">
                                Password
                            </label>

                            <Link
                                to="/forgot-password"
                            >
                                Forgot Password?
                            </Link>

                        </div>


                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                {/* =========================
                    REGISTER
                ========================= */}

                <div className="auth-divider">

                    <span>
                        OR
                    </span>

                </div>


                <div className="auth-register">

                    <span>
                        Don't have an account?
                    </span>

                    <Link
                        to="/register"
                    >
                        Create Account
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Login;