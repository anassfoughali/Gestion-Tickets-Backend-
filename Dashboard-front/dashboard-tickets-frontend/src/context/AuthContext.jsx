import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user_info');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    const response = await authService.login({ username, password });
    const token = response.data.token;
    const userInfo = { username };

    sessionStorage.setItem('jwt_token', token);
    sessionStorage.setItem('user_info', JSON.stringify(userInfo));
    setUser(userInfo);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);