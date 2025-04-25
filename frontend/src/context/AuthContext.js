import React, { createContext, useContext, useState, useEffect } from 'react'; // React core and hooks
import api from '../api/axiosConfig'; // Axios instance with base config

const AuthContext = createContext(); // create context for auth state

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store current user or null

  // On mount, if there's a token saved, try to fetch the user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Token ${token}`; // attach token to future requests
      api.get('auth/user/')
        .then(res => setUser(res.data)) // set user on success
        .catch(() => {
          // if token invalid, remove it
          localStorage.removeItem('token');
          delete api.defaults.headers.Authorization;
        });
    }
  }, []);

  const login = async ({ username, password, role, remember }) => {
    // authenticate and store token
    const res = await api.post('token-auth/', { username, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    api.defaults.headers.Authorization = `Token ${token}`;

    // fetch the authenticated user's info
    const me = await api.get('auth/user/');
    const meData = me.data;

    // block non-staff from admin area
    if (role === 'admin' && !meData.is_staff) {
      // rollback on failure
      localStorage.removeItem('token');
      delete api.defaults.headers.Authorization;
      throw new Error('Invalid admin credentials');
    }

    setUser(meData); // update state with user data
  };

  const logout = () => {
    // clear token and reset user
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} {/* render app */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // custom hook for consuming auth context
