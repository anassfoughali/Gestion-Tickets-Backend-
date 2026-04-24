import { useState, useEffect } from "react";
import { FiHome, FiList, FiUsers, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const BLUE = "#2784c1";

const navItems = [
  { icon: <FiHome size={20} />, label: "Dashboard", path: "/dashboard" },
  { icon: <FiList size={20} />, label: "Tickets", path: "/tickets" },
  { icon: <FiUsers size={20} />, label: "Techniciens", path: "/techniciens" },
];

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`hamburger-button ${isOpen ? "hamburger-button-hidden" : ""}`}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Backdrop Overlay */}
      <div
        className={`menu-backdrop ${isOpen ? "menu-backdrop-open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Menu */}
      <aside className={`hamburger-menu ${isOpen ? "hamburger-menu-open" : ""}`}>
        {/* Header */}
        <div className="menu-header">
          <div className="menu-logo">
            <div className="logo-icon">
              <span className="logo-text">FG</span>
            </div>
            <div>
              <p className="company-name">Finatech Group</p>
              <p className="company-subtitle">Support Manager</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="close-button"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="menu-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`menu-item ${isActive ? "menu-item-active" : ""}`}
              >
                <span className="menu-item-icon">{item.icon}</span>
                <span className="menu-item-label">{item.label}</span>
                {isActive && <span className="menu-item-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="menu-footer">
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Inline Styles */}
      <style jsx>{`
        /* Hamburger Button */
        .hamburger-button {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: white;
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: ${BLUE};
        }

        .hamburger-button:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: scale(1.05);
        }

        .hamburger-button:active {
          transform: scale(0.95);
        }

        .hamburger-button-hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        /* Backdrop */
        .menu-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .menu-backdrop-open {
          opacity: 1;
          visibility: visible;
        }

        /* Menu Container */
        .hamburger-menu {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          background: ${BLUE};
          z-index: 1050;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hamburger-menu-open {
          transform: translateX(0);
        }

        /* Header */
        .menu-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          background: ${BLUE};
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .menu-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: ${BLUE};
        }

        .company-name {
          font-size: 15px;
          font-weight: 600;
          color: white;
          line-height: 1.3;
          margin: 0;
        }

        .company-subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        /* Close Button */
        .close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .close-button:active {
          transform: scale(0.95);
        }

        /* Navigation */
        .menu-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
          background: ${BLUE};
        }

        .menu-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 4px;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
          text-align: left;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .menu-item-active {
          background: white;
          color: ${BLUE};
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .menu-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .menu-item-label {
          flex: 1;
        }

        .menu-item-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: white;
          border-radius: 4px 0 0 4px;
        }

        /* Footer */
        .menu-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          background: ${BLUE};
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: #dc2626;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .logout-button:hover {
          background: #b91c1c;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
        }

        .logout-button:active {
          background: #991b1b;
          transform: scale(0.98);
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3);
        }

        /* Responsive */
        @media (min-width: 1024px) {
          .hamburger-menu {
            width: 320px;
          }
        }

        /* Scrollbar */
        .menu-nav::-webkit-scrollbar {
          width: 6px;
        }

        .menu-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .menu-nav::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .menu-nav::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
};

export default HamburgerMenu;
