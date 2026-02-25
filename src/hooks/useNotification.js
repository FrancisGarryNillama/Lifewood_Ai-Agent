import { useState, useCallback } from 'react';

export function useNotification() {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((type, message, duration = 3000) => {
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

  const showError = useCallback((message, duration = 5000) => {
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

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification,
  };
}