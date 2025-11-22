// KnowledgeTraceNavbar.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use auth context if available
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const logout = authContext?.logout || (() => {});

  const links = [
    { label: "Home", path: "/" },
    { label: "Recent Projects", path: "/" },
    { label: "Thesis Finder", path: "/thesis-finder" },
    { label: "My Work", path: "/my-work" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      {/* ---------- Large Screens ---------- */}
      <div className="hidden lg:flex items-center justify-between px-10 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <h1 className="text-3xl font-bold text-black italic">
          Knowledge<span className="text-green-700">Trace</span>
        </h1>

        {/* MENU LINKS */}
        <ul className="flex gap-10">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link
                to={link.path}
                className="cursor-pointer text-black hover:text-green-500 transition text-lg"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUser} />
                {user?.name || "Dashboard"}
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faRightToBracket} />
              Login
            </Link>
          )}
        </div>
      </div>

      {/* ---------- Small Screens (Logo + Hamburger) ---------- */}
      <div className="lg:hidden bg-white/20 backdrop-blur-md border-b border-white/20 px-5 py-3 flex justify-between items-center">

        {/* Mobile Logo */}
        <h1 className="text-2xl font-bold text-black italic">
          Knowledge<span className="text-green-700">Trace</span>
        </h1>

        {/* Menu Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl font-bold text-black"
        >
          ☰
        </button>
      </div>

      {/* ---------- Mobile Dropdown Menu ---------- */}
      {open && (
        <div className="lg:hidden bg-white/30 backdrop-blur-xl border-b border-white/20 shadow-md py-4">
          <ul className="flex flex-col items-center gap-4">
            {links.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="cursor-pointer text-black text-lg hover:text-green-600 transition"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* MOBILE AUTH BUTTONS */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="mt-3 px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faUser} />
                  Dashboard
                </Link>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-3 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                Login
              </Link>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
