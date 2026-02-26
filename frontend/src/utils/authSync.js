/**
 * Cross-Tab Authentication Synchronization
 * Syncs login/logout state across all browser tabs instantly
 */

const AUTH_CHANNEL = 'cred_it_auth_channel';
const AUTH_EVENT_KEY = 'cred_it_auth_event';

class AuthSync {
    constructor() {
        this.channel = null;

        // Use BroadcastChannel for modern browsers
        if ('BroadcastChannel' in window) {
            this.channel = new BroadcastChannel(AUTH_CHANNEL);
        }
    }

    /**
     * Broadcast login event to all tabs
     */
    broadcastLogin(user) {
        const message = { type: 'LOGIN', user, timestamp: Date.now() };

        // BroadcastChannel (modern browsers)
        if (this.channel) {
            this.channel.postMessage(message);
        }

        // Fallback: localStorage event (works across all browsers)
        localStorage.setItem(AUTH_EVENT_KEY, JSON.stringify(message));
        // Clear immediately to allow repeated events
        setTimeout(() => localStorage.removeItem(AUTH_EVENT_KEY), 100);
    }

    /**
     * Broadcast logout event to all tabs
     */
    broadcastLogout() {
        const message = { type: 'LOGOUT', timestamp: Date.now() };

        // BroadcastChannel
        if (this.channel) {
            this.channel.postMessage(message);
        }

        // Fallback: localStorage event
        localStorage.setItem(AUTH_EVENT_KEY, JSON.stringify(message));
        setTimeout(() => localStorage.removeItem(AUTH_EVENT_KEY), 100);
    }

    /**
     * Broadcast token refresh event
     */
    broadcastTokenRefresh() {
        const message = { type: 'TOKEN_REFRESH', timestamp: Date.now() };

        if (this.channel) {
            this.channel.postMessage(message);
        }

        localStorage.setItem(AUTH_EVENT_KEY, JSON.stringify(message));
        setTimeout(() => localStorage.removeItem(AUTH_EVENT_KEY), 100);
    }

    /**
     * Listen for auth events from other tabs
     * @param {Function} callback - Called with event data
     * @returns {Function} Cleanup function
     */
    onAuthEvent(callback) {
        // BroadcastChannel listener
        if (this.channel) {
            this.channel.onmessage = (event) => {
                callback(event.data);
            };
        }

        // localStorage event listener (fallback + cross-browser support)
        const handleStorageEvent = (e) => {
            if (e.key === AUTH_EVENT_KEY && e.newValue) {
                try {
                    const data = JSON.parse(e.newValue);
                    callback(data);
                } catch (error) {
                    console.error('Failed to parse auth event:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageEvent);

        // Return cleanup function
        return () => {
            if (this.channel) {
                this.channel.close();
                this.channel = null;
            }
            window.removeEventListener('storage', handleStorageEvent);
        };
    }
}

export const authSync = new AuthSync();


