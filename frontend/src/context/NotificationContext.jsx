import React, { createContext, useContext, useState, useCallback } from 'react';
import { Notification } from '../components/common';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((type, message, duration = 5000) => {
        setNotification({ type, message, show: true });

        if (duration > 0) {
            setTimeout(() => {
                setNotification(null);
            }, duration);
        }
    }, []);

    const showSuccess = useCallback((message, duration) => {
        showNotification('success', message, duration);
    }, [showNotification]);

    const showError = useCallback((message, duration = 6000) => {
        showNotification('error', message, duration);
    }, [showNotification]);

    const showWarning = useCallback((message, duration) => {
        showNotification('warning', message, duration);
    }, [showNotification]);

    const showInfo = useCallback((message, duration) => {
        showNotification('info', message, duration);
    }, [showNotification]);

    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notification,
                showSuccess,
                showError,
                showWarning,
                showInfo,
                closeNotification,
            }}
        >
            {children}

            {/* Global Notification Component */}
            {notification?.show && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={closeNotification}
                    show={notification.show}
                />
            )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
}
