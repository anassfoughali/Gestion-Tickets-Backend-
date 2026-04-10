import React, { createContext, useContext, useState, useCallback } from "react";
import { loginRequest } from "../services/authApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "jwt_token";
const USER_KEY  = "auth_user";

export const AuthProvider = ({ children }) => {

  //  Recharge le user depuis sessionStorage au refresh
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  //  Login — appelle POST /api/auth/login → reçoit { token }
  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const response = await loginRequest(username, password);
      const { token } = response.data; // auth-service retourne seulement { token }

      // Sauvegarde le JWT
      sessionStorage.setItem(TOKEN_KEY, token);

      // Construit le user local
      const userData = { username, name: username, role: "ADMIN" };
      sessionStorage.setItem(USER_KEY, JSON.stringify(userData));

      setUser(userData);
      setLoading(false);
      return { success: true };

    } catch (err) {
      setLoading(false);
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        return { success: false, error: "Identifiants incorrects. Veuillez réessayer." };
      }
      if (status >= 500) {
        return { success: false, error: "Erreur serveur. Contactez l'administrateur." };
      }
      return { success: false, error: "Impossible de joindre le serveur. Vérifiez votre connexion." };
    }
  }, []);

  //  Logout — vide sessionStorage
  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const getToken  = useCallback(() => sessionStorage.getItem(TOKEN_KEY), []);
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);