import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login      from "./pages/Login";
import Dashboard  from "./pages/Dashboard";
import Tickets    from "./pages/Tickets";
import Techniciens from "./pages/Techniciens";
import Rapports   from "./pages/Rapports";

//  Protège les routes — redirige vers /login si pas connecté
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

//  Redirige vers /dashboard si déjà connecté
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={
      <PublicRoute><Login /></PublicRoute>
    } />
    <Route path="/dashboard" element={
      <PrivateRoute><Dashboard /></PrivateRoute>
    } />
    <Route path="/tickets" element={
      <PrivateRoute><Tickets /></PrivateRoute>
    } />
    <Route path="/techniciens" element={
      <PrivateRoute><Techniciens /></PrivateRoute>
    } />
    <Route path="/rapports" element={
      <PrivateRoute><Rapports /></PrivateRoute>
    } />
    {/* Redirect racine → dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;