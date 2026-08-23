import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import userService from "../services/userService";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";


function Profile() {

    const {
        user,
        isAuthenticated
    } = useAuth();


    /* =====================================================
       PROFILE DATA
    ===================================================== */

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: ""
    });


    /* =====================================================
       STATES
    ===================================================== */

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    /*
     * false = profile details hidden
     * true  = profile details visible
     */
    const [showProfile, setShowProfile] =
        useState(false);

    /*
     * false = read-only mode
     * true  = edit mode
     */
    const [editing, setEditing] =
        useState(false);


    /* =====================================================
       LOAD PROFILE
    ===================================================== */

    useEffect(() => {

        const loadUser = async () => {

            if (!isAuthenticated) {

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");

                const userData =
                    await userService.getProfile();


                setFormData({

                    firstName:
                        userData?.firstName ?? "",

                    lastName:
                        userData?.lastName ?? "",

                    email:
                        userData?.email ?? "",

                    phone:
                        userData?.phone ?? "",

                    address:
                        userData?.address ?? "",

                    city:
                        userData?.city ?? "",

                    state:
                        userData?.state ?? "",

                    country:
                        userData?.country ?? "",

                    postalCode:
                        userData?.postalCode ?? ""

                });

            } catch (err) {

                console.error(
                    "Profile loading error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load profile."
                );

            } finally {

                setLoading(false);

            }

        };


        loadUser();

    }, [isAuthenticated]);


    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

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


    /* =====================================================
       SHOW / HIDE PROFILE
    ===================================================== */

    const handleShowProfile = () => {

        setShowProfile(
            (previous) => !previous
        );

        /*
         * Every time the profile is opened,
         * start in read-only mode.
         */
        setEditing(false);

        setError("");

        setSuccess("");

    };


    /* =====================================================
       EDIT PROFILE
    ===================================================== */

    const handleEdit = () => {

        setEditing(true);

        setError("");

        setSuccess("");

    };


    /* =====================================================
       CANCEL EDIT
    ===================================================== */

    const handleCancel = async () => {

        setEditing(false);

        setError("");

        setSuccess("");

        /*
         * Reload the saved data from backend.
         * This removes any unsaved changes.
         */
        try {

            const userData =
                await userService.getProfile();


            setFormData({

                firstName:
                    userData?.firstName ?? "",

                lastName:
                    userData?.lastName ?? "",

                email:
                    userData?.email ?? "",

                phone:
                    userData?.phone ?? "",

                address:
                    userData?.address ?? "",

                city:
                    userData?.city ?? "",

                state:
                    userData?.state ?? "",

                country:
                    userData?.country ?? "",

                postalCode:
                    userData?.postalCode ?? ""

            });

        } catch (err) {

            console.error(
                "Profile reload error:",
                err
            );

        }

    };


    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();


        try {

            setSaving(true);

            setError("");

            setSuccess("");


            const updatedUser =
                await userService.updateProfile(
                    formData
                );


            /*
             * Update the screen with the
             * response returned by backend.
             */
            setFormData({

                firstName:
                    updatedUser?.firstName ?? "",

                lastName:
                    updatedUser?.lastName ?? "",

                email:
                    updatedUser?.email ?? "",

                phone:
                    updatedUser?.phone ?? "",

                address:
                    updatedUser?.address ?? "",

                city:
                    updatedUser?.city ?? "",

                state:
                    updatedUser?.state ?? "",

                country:
                    updatedUser?.country ?? "",

                postalCode:
                    updatedUser?.postalCode ?? ""

            });


            /*
             * Return to read-only mode.
             */
            setEditing(false);


            setSuccess(
                "Profile updated successfully."
            );

        } catch (err) {

            console.error(
                "Profile update error:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to update profile."
            );

        } finally {

            setSaving(false);

        }

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="profile-page">

                <Loading
                    message="Loading profile..."
                />

            </div>

        );

    }


    /* =====================================================
       NOT AUTHENTICATED
    ===================================================== */

    if (!isAuthenticated) {

        return (

            <div className="profile-page">

                <div className="profile-error">

                    Please login to view
                    your profile.

                </div>

            </div>

        );

    }


    /* =====================================================
       DISPLAY NAME
    ===================================================== */

    const displayName =
        formData.firstName ||
        user?.firstName ||
        user?.name ||
        user?.username ||
        "User";


    /* =====================================================
       AVATAR
    ===================================================== */

    const avatarLetter =
        displayName
            .charAt(0)
            .toUpperCase();


    /* =====================================================
       DISPLAY VALUE
    ===================================================== */

    const displayValue = (value) => {

        return value
            ? value
            : "—";

    };


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="profile-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="profile-header">

                <div>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your account
                        information.
                    </p>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="profile-error">

                    {error}

                </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="profile-success">

                    {success}

                </div>

            )}


            {/* =================================================
                PROFILE LAYOUT
            ================================================= */}

            <div className="profile-layout">


                {/* =================================================
                    PROFILE CARD
                ================================================= */}

                <div className="profile-card">


                    <div className="profile-avatar">

                        {avatarLetter}

                    </div>


                    <h2>

                        {displayName}

                    </h2>


                    <p>

                        {formData.email ||
                            user?.email ||
                            "—"}

                    </p>


                    <button
                        type="button"
                        className="profile-edit-button"
                        onClick={handleShowProfile}
                    >

                        {showProfile
                            ? "Close Profile"
                            : "My Profile"}

                    </button>

                </div>


                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                {showProfile && (

                    <div className="profile-information">


                        {/* =================================================
                            SECTION HEADER
                        ================================================= */}

                        <div className="profile-section-header">

                            <h2>
                                Personal Information
                            </h2>

                            <p>

                                {editing
                                    ? "Edit your account information."
                                    : "View your account information."}

                            </p>

                        </div>


                        {/* =================================================
                            READ ONLY MODE
                        ================================================= */}

                        {!editing && (

                            <div className="profile-details">


                                {/* FIRST NAME / LAST NAME */}

                                <div className="profile-details-row">

                                    <div className="profile-details-group">

                                        <label>
                                            First Name
                                        </label>

                                        <div className="profile-detail-value">

                                            {displayValue(
                                                formData.firstName
                                            )}

                                        </div>

                                    </div>


                                    <div className="profile-details-group">

                                        <label>
                                            Last Name
                                        </label>

                                        <div className="profile-detail-value">

                                            {displayValue(
                                                formData.lastName
                                            )}

                                        </div>

                                    </div>

                                </div>


                                {/* EMAIL / PHONE */}

                                <div className="profile-details-row">

                                    <div className="profile-details-group">

                                        <label>
                                            Email
                                        </label>

                                        <div className="profile-detail-value">

                                            {displayValue(
                                                formData.email
                                            )}

                                        </div>

                                    </div>


                                    <div className="profile-details-group">

                                        <label>
                                            Phone
                                        </label>

                                        <div className="profile-detail-value">

                                            {displayValue(
                                                formData.phone
                                            )}

                                        </div>

                                    </div>

                                </div>


                                {/* ADDRESS */}

                                <div className="profile-details-group">

                                    <label>
                                        Address
                                    </label>

                                    <div className="profile-detail-value">

                                        {displayValue(
                                            formData.address
                                        )}

                                    </div>

                                </div>


                                {/* CITY / STATE */}

                                <div className="profile-details-row">

                                    <div className="profile-details-group">

                                        <label>
                                            City
                                        </label>

                                        <div className="profile-detail-value">

                                            {displayValue(
                                                formData.city
                                            )}

                                        </div>

                                    </div>


                                    <div className="profile-details-group">

                                        <label>
                                            State
                                        </label>

                                        <div className="profile-detail-value">

                                            {displayValue(
                                                formData.state
                                            )}

                                        </div>

                                    </div>

                                </div>


                                {/* COUNTRY / POSTAL CODE */}

                                <div className="profile-details-row">

                                    <div className="profile-details-group">

                                        <label>
                                            Country
                                        </label>

                                        <div className="profile-detail-value">

                                            {displayValue(
                                                formData.country
                                            )}

                                        </div>

                                    </div>


                                    <div className="profile-details-group">

                                        <label>
                                            Postal Code
                                        </label>

                                        <div className="profile-detail-value">

                                            {displayValue(
                                                formData.postalCode
                                            )}

                                        </div>

                                    </div>

                                </div>


                                {/* EDIT PROFILE */}

                                <div className="profile-save-section">

                                    <div>

                                        <h3>
                                            Profile Information
                                        </h3>

                                        <p>
                                            Want to change your information?
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className="save-profile-button"
                                        onClick={handleEdit}
                                    >

                                        Edit Profile

                                    </button>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            EDIT MODE
                        ================================================= */}

                        {editing && (

                            <form
                                className="profile-form"
                                onSubmit={handleSubmit}
                            >


                                {/* FIRST NAME / LAST NAME */}

                                <div className="profile-form-row">

                                    <div className="profile-form-group">

                                        <label>
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={
                                                formData.firstName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="profile-form-group">

                                        <label>
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            value={
                                                formData.lastName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                </div>


                                {/* EMAIL / PHONE */}

                                <div className="profile-form-row">

                                    <div className="profile-form-group">

                                        <label>
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="profile-form-group">

                                        <label>
                                            Phone
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>


                                {/* ADDRESS */}

                                <div className="profile-form-group">

                                    <label>
                                        Address
                                    </label>

                                    <input
                                        type="text"
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                {/* CITY / STATE */}

                                <div className="profile-form-row">

                                    <div className="profile-form-group">

                                        <label>
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            value={
                                                formData.city
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    <div className="profile-form-group">

                                        <label>
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            value={
                                                formData.state
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>


                                {/* COUNTRY / POSTAL CODE */}

                                <div className="profile-form-row">

                                    <div className="profile-form-group">

                                        <label>
                                            Country
                                        </label>

                                        <input
                                            type="text"
                                            name="country"
                                            value={
                                                formData.country
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    <div className="profile-form-group">

                                        <label>
                                            Postal Code
                                        </label>

                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={
                                                formData.postalCode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>


                                {/* SAVE / CANCEL */}

                                <div className="profile-save-section">

                                    <div>

                                        <h3>
                                            Save Profile
                                        </h3>

                                        <p>
                                            Save your updated personal information.
                                        </p>

                                    </div>


                                    <div className="profile-form-actions">

                                        <button
                                            type="button"
                                            className="profile-cancel-button"
                                            onClick={handleCancel}
                                            disabled={saving}
                                        >

                                            Cancel

                                        </button>


                                        <button
                                            type="submit"
                                            className="save-profile-button"
                                            disabled={saving}
                                        >

                                            {saving
                                                ? "Saving..."
                                                : "Save Profile"}

                                        </button>

                                    </div>

                                </div>

                            </form>

                        )}

                    </div>

                )}


                {/* =================================================
                    ACCOUNT ACTIONS
                ================================================= */}

                <div className="profile-actions">

                    <h2>
                        Account
                    </h2>


                    {/* ORDERS */}

                    <Link to="/orders">

                        <span>
                            📦
                        </span>

                        <div>

                            <strong>
                                My Orders
                            </strong>

                            <p>
                                View your order
                                history.
                            </p>

                        </div>

                        <span>
                            →
                        </span>

                    </Link>


                    {/* REVIEWS */}

                    <Link to="/reviews">

                        <span>
                            ⭐
                        </span>

                        <div>

                            <strong>
                                My Reviews
                            </strong>

                            <p>
                                View your product
                                reviews.
                            </p>

                        </div>

                        <span>
                            →
                        </span>

                    </Link>


                    {/* NOTIFICATIONS */}

                    <Link to="/notifications">

                        <span>
                            🔔
                        </span>

                        <div>

                            <strong>
                                Notifications
                            </strong>

                            <p>
                                View your latest
                                notifications.
                            </p>

                        </div>

                        <span>
                            →
                        </span>

                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Profile;