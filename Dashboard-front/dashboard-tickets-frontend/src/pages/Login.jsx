import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import logo from "../assets/finatech_group_logo.png"; // ✅

const BLUE = "#2784c1";
const GRAY = "#a3a3a3";

const Login = () => {
  const [formData, setFormData]         = useState({ username: "", password: "" });
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) return;
    setLoading(true);
    setError("");

    const result = await login(formData.username.trim(), formData.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
      setFormData((prev) => ({ ...prev, password: "" }));
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* ── Panneau gauche ── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col items-center justify-between py-16 px-12 relative overflow-hidden"
        style={{ backgroundColor: BLUE }}
      >
        {/* Cercles décoratifs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-28 -right-20 w-[28rem] h-[28rem] rounded-full opacity-10 bg-white" />
        <div className="absolute top-1/3 right-0 w-52 h-52 rounded-full opacity-5 bg-white" />

        {/* Logo */}
        <div className="relative z-10 w-full">
          <img src={logo} alt="Finatech Group" className="h-56 object-contain" />
        </div>

        {/* Texte central */}
        <div className="relative z-10 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            Gestion Tickets
          </h1>
          <p className="text-white text-base opacity-80 font-light max-w-xs mx-auto leading-relaxed">
            Plateforme de suivi et gestion des tickets SAP HANA en temps réel
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-10 justify-center">
          {[
            { label: "Tickets traités", value: "500+" },
            { label: "Techniciens",     value: "12"   },
            { label: "Disponibilité",   value: "99%"  },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-xs text-white opacity-60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panneau droit ── */}
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <img src={logo} alt="Finatech Group" className="h-12 object-contain mb-3" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Bon retour 👋</h2>
            <p className="text-sm" style={{ color: GRAY }}>
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Erreur */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <FiAlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FiUser size={15} style={{ color: GRAY }} />
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  autoFocus
                  placeholder="Entrez votre identifiant"
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none transition-all duration-200"
                  onFocus={(e) => {
                    e.target.style.borderColor = BLUE;
                    e.target.style.backgroundColor = "#fff";
                    e.target.style.boxShadow = `0 0 0 3px rgba(39,132,193,0.12)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.backgroundColor = "#f9fafb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FiLock size={15} style={{ color: GRAY }} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none transition-all duration-200"
                  onFocus={(e) => {
                    e.target.style.borderColor = BLUE;
                    e.target.style.backgroundColor = "#fff";
                    e.target.style.boxShadow = `0 0 0 3px rgba(39,132,193,0.12)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.backgroundColor = "#f9fafb";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 transition-colors duration-200"
                  style={{ color: GRAY }}
                  onMouseEnter={(e) => e.currentTarget.style.color = BLUE}
                  onMouseLeave={(e) => e.currentTarget.style.color = GRAY}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !formData.username.trim() || !formData.password.trim()}
              className="w-full py-3 mt-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: BLUE }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#1e6fa3"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = BLUE; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Connexion en cours...
                </span>
              ) : "Se connecter"}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-center space-y-1">
            <p className="text-xs" style={{ color: GRAY }}>
              © {new Date().getFullYear()} Finatech Group — Tous droits réservés
            </p>
            <p className="text-xs" style={{ color: GRAY }}>
              Plateforme Gestion Tickets SAP HANA
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;