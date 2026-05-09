import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({
            email: decoded.sub,
            name: decoded.name,
            provider: decoded.provider
          });
        }
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('jwt', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
