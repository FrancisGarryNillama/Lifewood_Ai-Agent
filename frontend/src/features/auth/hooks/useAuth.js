import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../../api';
import { useNotification } from '../../../hooks';
import { useAuthContext } from '../../../context';

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const { login: contextLogin, logout: contextLogout } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const login = async (accountID, accountPass) => {
    setLoading(true);
    try {
      // Call the context login directly with username and password
      const result = await contextLogin(accountID, accountPass);

      if (result.success) {
        showSuccess('Login successful!');

        // Navigate to the page the user tried to access, or the Dashboard
        const from = location.state?.from;
        if (from && from.pathname && from.pathname !== '/') {
          navigate(from.pathname, { replace: true });
        } else {
          navigate('/Dashboard', { replace: true });
        }
      } else {
        showError(result.error || 'Login failed');
      }
      return result;
    } catch (error) {
      showError(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (accountID, accountPass) => {
    setLoading(true);
    try {
      const data = await authApi.register(accountID, accountPass);
      showSuccess(data.message || 'Registration successful!');
      return true;
    } catch (error) {
      showError(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Call logout API to invalidate token on server
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API error:', error);
    } finally {
      // Always clear local state
      contextLogout();
      setLoading(false);
      navigate('/', { replace: true });
    }
  };

  return { login, register, logout, loading };
}

