/**
 * Secure Token Storage Utilities
 * Handles JWT access and refresh tokens securely
 */

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

/**
 * Store authentication tokens securely
 * Note: For production, consider using httpOnly cookies set by backend
 */
export const tokenStorage = {
  // Access Token
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  removeAccessToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // Refresh Token
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // User Data
  getUserData: () => {
    try {
      const data = localStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUserData: (userData) => {
    if (userData) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  },

  removeUserData: () => {
    localStorage.removeItem(USER_DATA_KEY);
  },

  // Store all auth data at once
  setAuthData: ({ accessToken, refreshToken, user }) => {
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
    tokenStorage.setUserData(user);
  },

  // Clear all auth data
  clearAll: () => {
    tokenStorage.removeAccessToken();
    tokenStorage.removeRefreshToken();
    tokenStorage.removeUserData();
    // Also clear legacy userName key
    localStorage.removeItem('userName');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    // Check if we have user data (current implementation doesn't use JWT)
    const userData = tokenStorage.getUserData();
    if (userData && userData.username) {
      return true;
    }

    // Fallback: Check for JWT token (for future implementation)
    const token = tokenStorage.getAccessToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch {
      return false;
    }
  },

  // Get token expiry time
  getTokenExpiry: () => {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  },

  // Check if token needs refresh (expires in less than 5 minutes)
  needsRefresh: () => {
    const expiry = tokenStorage.getTokenExpiry();
    if (!expiry) return true;

    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() > expiry - fiveMinutes;
  },
};

export default tokenStorage;
