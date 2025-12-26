// KnowledgeTraceNavbar.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Use auth context if available
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const logout = authContext?.logout || (() => { });

  const links = [
    { label: "Home", path: "/" },
    { label: "Thesis Finder", path: "/thesis-finder" },
    { label: "Collaborate", path: "/collaborate" },
    { label: "My Work", path: "/my-work" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      {/* ---------- Large Screens ---------- */}
      <div className="hidden lg:flex items-center justify-between px-6 lg:px-12 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Knowledge<span className="text-green-600">Trace</span>
          </h1>
        </Link>

        {/* MENU LINKS */}
        <ul className="flex items-center gap-1">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link
                to={link.path}
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 text-sm font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <FontAwesomeIcon icon={faUser} className="text-sm" />
                <span className="hidden xl:inline">{user?.displayName || user?.name || "Dashboard"}</span>
                <span className="xl:hidden">Dashboard</span>
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg text-sm font-medium"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg font-medium text-sm"
            >
              <FontAwesomeIcon icon={faRightToBracket} className="text-sm" />
              Login
            </Link>
          )}
        </div>
      </div>

      {/* ---------- Small Screens (Logo + Hamburger) ---------- */}
      <div className="lg:hidden px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Knowledge<span className="text-green-600">Trace</span>
          </h1>
        </Link>

        {/* Menu Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* ---------- Mobile Dropdown Menu ---------- */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top duration-200">
          <ul className="flex flex-col py-4">
            {links.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="block px-6 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <div className="border-t border-gray-200 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-6 py-3">
                    <NotificationBell />
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 font-medium"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Dashboard
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-6 py-3 bg-red-500 text-white hover:bg-red-600 transition-all duration-200 flex items-center gap-2 font-medium"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium mx-4 rounded-lg shadow-md"
                >
                  <FontAwesomeIcon icon={faRightToBracket} />
                  Login
                </Link>
              )}
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
