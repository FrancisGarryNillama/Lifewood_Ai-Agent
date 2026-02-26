import { API_BASE_URL } from './config';
import { authSync } from '../utils/authSync';

// Event for handling auth errors globally
const AUTH_ERROR_EVENT = 'auth:error';
const AUTH_LOGOUT_EVENT = 'auth:logout';

// Dispatch auth error event
export const dispatchAuthError = () => {
  window.dispatchEvent(new CustomEvent(AUTH_ERROR_EVENT));
};

// Dispatch logout event
export const dispatchLogout = () => {
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
};

// Subscribe to auth error events
export const onAuthError = (callback) => {
  window.addEventListener(AUTH_ERROR_EVENT, callback);
  return () => window.removeEventListener(AUTH_ERROR_EVENT, callback);
};

// Subscribe to logout events
export const onLogout = (callback) => {
  window.addEventListener(AUTH_LOGOUT_EVENT, callback);
  return () => window.removeEventListener(AUTH_LOGOUT_EVENT, callback);
};

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  /**
   * Process queued requests after token refresh
   */
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Refresh access token using JWT cookies
   */
  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: 'POST',
        credentials: 'include', // Send cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      // Broadcast token refresh to other tabs
      authSync.broadcastTokenRefresh();

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: 'include', // CRITICAL: Send cookies with every request
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401 && !options._retry) {
        // If already refreshing, queue this request
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return this.request(endpoint, { ...options, _retry: true });
            })
            .catch(err => {
              throw err;
            });
        }

        // Mark as refreshing
        this.isRefreshing = true;

        try {
          // Try to refresh the token using JWT cookies
          await this.refreshToken();

          // Token refreshed successfully
          this.isRefreshing = false;
          this.processQueue(null);

          // Retry the original request
          return this.request(endpoint, { ...options, _retry: true });
        } catch (refreshError) {
          // Refresh failed - logout user
          this.isRefreshing = false;
          this.processQueue(refreshError, null);

          // Clear everything and dispatch logout
          dispatchLogout();
          authSync.broadcastLogout();

          throw new Error('Session expired. Please login again.');
        }
      }

      // Handle 403 Forbidden - insufficient permissions
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action.');
      }

      if (!response.ok) {
        // Extract error message from various possible fields
        const errorMessage = data.error || data.message || data.detail || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      return { data, status: response.status };
    } catch (error) {
      // Don't log 404 errors - they're expected when resources don't exist
      if (!error.message?.includes('404')) {
        console.error(`API Error [${endpoint}]:`, error);
      }
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'DELETE' });
  }

  postFormData(endpoint, formData) {
    return fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      credentials: 'include', // Send cookies
      body: formData,
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));

      // Handle 401 Unauthorized
      if (response.status === 401) {
        dispatchLogout();
        authSync.broadcastLogout();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.error || data.detail || `HTTP ${response.status}`);
      }
      return { data, status: response.status };
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);


