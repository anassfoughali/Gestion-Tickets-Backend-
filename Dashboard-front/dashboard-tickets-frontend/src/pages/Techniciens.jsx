import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar  from "../components/layout/Topbar";
import useTechniciens from "../hooks/useTechniciens";
import { FiRefreshCw, FiUser } from "react-icons/fi";

const BLUE = "#2784c1";

const toStr = (val) => {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const Techniciens = () => {
  const { techniciens, loading, error, refresh } = useTechniciens();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div
          className="w-12 h-12 mx-auto mb-4 border-4 rounded-full animate-spin"
          style={{ borderColor: BLUE, borderTopColor: "transparent" }}
        />
        <p className="text-gray-500">Chargement des techniciens...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 text-center bg-white shadow rounded-xl">
        <p className="font-semibold text-red-500">❌ Erreur de connexion</p>
        <p className="mt-1 text-sm text-gray-400">{error}</p>
        <p className="mt-2 text-xs text-gray-400">Vérifiez que Spring Boot tourne sur le port 8080</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Techniciens</h1>
              <p className="text-sm text-gray-500">Liste des techniciens enregistrés</p>
            </div>
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg shadow-sm transition"
              style={{ backgroundColor: BLUE }}
            >
              <FiRefreshCw size={14} />
              Actualiser
            </button>
          </div>

          {/* Cards grid */}
          {techniciens.length === 0 ? (
            <div className="p-12 text-sm text-center text-gray-400 bg-white border border-gray-100 shadow-sm rounded-xl">
              Aucun technicien disponible
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {techniciens.map((tech, idx) => (
                <div
                  key={tech.id || tech.groupId || idx}
                  className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition"
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full"
                    style={{ backgroundColor: BLUE }}
                  >
                    <FiUser size={20} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {toStr(tech.nom || tech.name || tech.username || tech.technicien)}
                    </p>
                    {(tech.email || tech.groupId) && (
                      <p className="text-xs text-gray-400 truncate">
                        {toStr(tech.email || tech.groupId)}
                      </p>
                    )}
                    {tech.specialite && (
                      <span
                        className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium text-white"
                        style={{ backgroundColor: BLUE }}
                      >
                        {toStr(tech.specialite)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Techniciens;
