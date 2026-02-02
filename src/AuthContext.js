// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Note: This AuthContext has been simplified for development/testing.
// It accepts any username/password and creates a local dev token and user.
// This avoids calling the backend for authentication so you can test the
// frontend login flow without a working server.

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // On mount, load any saved user/token from localStorage (dev mode)
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
        setError(null);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // login: accept any credentials and create a local dev token + user
  const login = async (credentials) => {
    // Create a simple dev token and user object
    const token = `devtoken-${Date.now()}`;
    const user = {
      _id: token,
      name: credentials.email || credentials.username || 'Dev User',
      email: credentials.email || `${credentials.username || 'dev'}@example.com`,
      role: 'student',
      createdAt: new Date().toISOString()
    };

    // Persist to localStorage so refresh preserves login
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setCurrentUser(user);
    setError(null);
    return user;
  };

  const logout = async () => {
    // Clear local dev auth
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setError(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
