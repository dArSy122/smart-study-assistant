import { createContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authService.js';
import { getStoredToken, removeStoredToken, setStoredToken } from '../services/apiClient.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    async function loadUser() {
      const token = getStoredToken();

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.data.user);
      } catch (error) {
        removeStoredToken();
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(credentials) {
    const response = await loginUser(credentials);

    setStoredToken(response.data.token);
    setUser(response.data.user);

    return response.data.user;
  }

  async function register(payload) {
    const response = await registerUser(payload);

    setStoredToken(response.data.token);
    setUser(response.data.user);

    return response.data.user;
  }

  function logout() {
    removeStoredToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAuthLoading,
      login,
      register,
      logout
    }),
    [user, isAuthenticated, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}