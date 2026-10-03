import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hemolink_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hemolink_token');
      if (savedToken) {
        api.setToken(savedToken);
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setUser(res.data.user);
            setProfile(res.data.profile);
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid, clearing credentials.');
          api.setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      setUser(res.data.user);
      setProfile(res.data.profile);
      setToken(res.data.accessToken);
      api.setToken(res.data.accessToken);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.success) {
      setUser(res.data.user);
      setToken(res.data.accessToken);
      api.setToken(res.data.accessToken);
      // Fetch fresh profile
      const meRes = await api.get('/auth/me').catch(() => null);
      if (meRes && meRes.success) {
        setProfile(meRes.data.profile);
      }
    }
    return res;
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    setProfile(null);
    setToken(null);
  };

  // Demo helper: quickly log in as one of the pre-seeded demo accounts
  const quickDemoLogin = async (roleName) => {
    let email = 'donor1@hemolink.org';
    let password = 'Password@123';

    switch (roleName) {
      case 'DONOR':
        email = 'donor1@hemolink.org';
        break;
      case 'DONOR_UNIVERSAL':
        email = 'donor2@hemolink.org'; // O- Universal Donor
        break;
      case 'PATIENT':
        email = 'patient1@hemolink.org';
        break;
      case 'HOSPITAL':
        email = 'hospital1@hemolink.org';
        break;
      case 'BLOOD_BANK':
        email = 'bloodbank1@hemolink.org';
        break;
      case 'ADMIN':
        email = 'admin@hemolink.org';
        password = 'Admin@123';
        break;
      default:
        email = 'donor1@hemolink.org';
    }

    return login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        role: user?.role || null,
        login,
        register,
        logout,
        quickDemoLogin,
        setUser,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
