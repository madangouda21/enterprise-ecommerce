import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../services/authService";


function Register() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });


    const [acceptedTerms, setAcceptedTerms] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* =========================
       INPUT CHANGE
    ========================= */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));


        setError("");
        setSuccess("");

    };


    /* =========================
       REGISTER
    ========================= */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        if (formData.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (!acceptedTerms) {

            setError(
                "Please accept the terms and conditions."
            );

            return;
        }


        try {

            setLoading(true);


            const {
                confirmPassword,
                ...registrationData
            } = formData;


            await authService.register(
                registrationData
            );


            setSuccess(
                "Account created successfully. Redirecting to login..."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1200);

        } catch (err) {

            console.error(
                "Registration error:",
                err
            );


            setError(
                err.message ||
                "Unable to create your account."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card register-card">

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
                        Create Account
                    </h1>

                    <p>
                        Create your account and
                        start shopping.
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
                    SUCCESS
                ========================= */}

                {success && (

                    <div className="auth-success">
                        {success}
                    </div>

                )}


                {/* =========================
                    FORM
                ========================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-form-row">

                        <div className="auth-form-group">

                            <label htmlFor="firstName">
                                First Name
                            </label>

                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={
                                    formData.firstName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="First name"
                                autoComplete="given-name"
                                required
                            />

                        </div>


                        <div className="auth-form-group">

                            <label htmlFor="lastName">
                                Last Name
                            </label>

                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={
                                    formData.lastName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Last name"
                                autoComplete="family-name"
                                required
                            />

                        </div>

                    </div>


                    <div className="auth-form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />

                    </div>


                    <div className="auth-form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Create a password"
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    <div className="auth-form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={
                                formData.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    <label className="terms-checkbox">

                        <input
                            type="checkbox"
                            checked={
                                acceptedTerms
                            }
                            onChange={(event) =>
                                setAcceptedTerms(
                                    event.target.checked
                                )
                            }
                        />

                        <span>
                            I agree to the terms and
                            conditions.
                        </span>

                    </label>


                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>


                {/* =========================
                    LOGIN
                ========================= */}

                <div className="auth-divider">
                    <span>
                        OR
                    </span>
                </div>


                <div className="auth-register">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Register;