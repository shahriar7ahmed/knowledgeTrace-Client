// KnowledgeTraceNavbar.jsx
import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll"; 
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const links = [
        { label: "Home", href: "home" },
        { label: "Thesis Finder", href: "thesis-finder" },
    ];

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
                            <ScrollLink
                                to={link.href}
                                smooth={true}
                                duration={500}
                                offset={-70}
                                className="cursor-pointer text-black hover:text-green-500 transition text-lg"
                            >
                                {link.label}
                            </ScrollLink>
                        </li>
                    ))}
                </ul>

                {/* LOGIN BUTTON */}
                <Link
                    to="/login"
                    className="px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition flex items-center"
                >
                    <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                    Login
                </Link>
            </div>

            {/* ---------- Small Screens (Logo + Hamburger) ---------- */}
            <div className="lg:hidden bg-white/20 backdrop-blur-md border-b border-white/20 px-5 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black italic">
                    Knowledge<span className="text-green-700">Trace</span>
                </h1>

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
                                <ScrollLink
                                    to={link.href}
                                    smooth={true}
                                    duration={500}
                                    offset={-70}
                                    className="cursor-pointer text-black text-lg hover:text-green-600 transition"
                                    onClick={() => setOpen(false)}
                                >
                                    {link.label}
                                </ScrollLink>
                            </li>
                        ))}

                        {/* MOBILE LOGIN BUTTON */}
                        <Link
                            to="/login"
                            onClick={() => setOpen(false)}
                            className="mt-3 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition flex items-center"
                        >
                            <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                            Login
                        </Link>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
