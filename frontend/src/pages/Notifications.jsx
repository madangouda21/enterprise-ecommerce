import { useEffect, useState } from "react";

import notificationService from "../services/notificationService";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";


function Notifications() {

    const {
        user,
        isAuthenticated
    } = useAuth();


    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const userId =
        user?.id ??
        user?.userId;


    /* =========================
       LOAD NOTIFICATIONS
    ========================= */

    useEffect(() => {

        const loadNotifications = async () => {

            if (
                !isAuthenticated ||
                !userId
            ) {

                setNotifications([]);

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                const data =
                    await notificationService.getNotifications(
                        userId
                    );


                const notificationList =
                    Array.isArray(data)
                        ? data
                        : data?.content ||
                          data?.notifications ||
                          [];


                setNotifications(
                    notificationList
                );

            } catch (err) {

                console.error(
                    "Notification loading error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load notifications."
                );

            } finally {

                setLoading(false);

            }

        };


        loadNotifications();

    }, [
        isAuthenticated,
        userId
    ]);


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="notifications-page">

                <Loading
                    message="Loading notifications..."
                />

            </div>

        );

    }


    /* =========================
       ERROR
    ========================= */

    if (error) {

        return (

            <div className="notifications-page">

                <div className="empty-notifications">

                    <div className="empty-notification-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to load notifications
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );

    }


    /* =========================
       EMPTY
    ========================= */

    if (notifications.length === 0) {

        return (

            <div className="notifications-page">

                <div className="notifications-header">

                    <div>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay updated with your
                            latest activities.
                        </p>

                    </div>

                </div>


                <div className="empty-notifications">

                    <div className="empty-notification-icon">
                        🔔
                    </div>

                    <h2>
                        No Notifications
                    </h2>

                    <p>
                        You don't have any
                        notifications yet.
                    </p>

                </div>

            </div>

        );

    }


    /* =========================
       NOTIFICATIONS
    ========================= */

    return (

        <div className="notifications-page">

            <div className="notifications-header">

                <div>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Stay updated with your
                        latest activities.
                    </p>

                </div>

            </div>


            <div className="notifications-list">

                {notifications.map(
                    (notification, index) => {

                        const notificationId =
                            notification.id ??
                            notification.notificationId ??
                            index;


                        const title =
                            notification.title ??
                            notification.type ??
                            "Notification";


                        const message =
                            notification.message ??
                            notification.content ??
                            notification.description ??
                            "";


                        const createdAt =
                            notification.createdAt ??
                            notification.createdDate ??
                            notification.timestamp;


                        const isRead =
                            notification.read ??
                            notification.isRead ??
                            false;


                        return (

                            <div
                                key={
                                    notificationId
                                }
                                className={`notification-card ${
                                    !isRead
                                        ? "unread"
                                        : ""
                                }`}
                            >

                                <div className="notification-icon">
                                    🔔
                                </div>


                                <div className="notification-content">

                                    <h3>
                                        {title}
                                    </h3>

                                    <p>
                                        {message}
                                    </p>


                                    {createdAt && (

                                        <small>
                                            {new Date(
                                                createdAt
                                            ).toLocaleString()}
                                        </small>

                                    )}

                                </div>


                                {!isRead && (

                                    <span
                                        className="unread-dot"
                                        title="Unread"
                                    />

                                )}

                            </div>

                        );

                    }
                )}

            </div>

        </div>

    );

}


export default Notifications;