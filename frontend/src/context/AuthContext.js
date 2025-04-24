// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, if there's a token, fetch current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Token ${token}`;
      api.get('auth/user/')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          delete api.defaults.headers.Authorization;
        });
    }
  }, []);

  const login = async ({ username, password, role, remember }) => {
    // get token
    const res = await api.post('token-auth/', { username, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    api.defaults.headers.Authorization = `Token ${token}`;

    // fetch current user
    const me = await api.get('auth/user/');
    const meData = me.data;

    // if they tried admin but aren't staff, block
    if (role === 'admin' && !meData.is_staff) {
      // rollback
      localStorage.removeItem('token');
      delete api.defaults.headers.Authorization;
      throw new Error('Invalid admin credentials');
    }

    setUser(meData);
  };

  const logout = () => {
    // clear token & user
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
