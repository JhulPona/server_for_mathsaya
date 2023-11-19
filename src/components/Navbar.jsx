import React from "react";
import Logo from "../assets/logo.png";
import "../App.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-center bg-primary sticky top-0 z-50 shadow-md">
      <Link to="/">
        <div className="flex items-center space-x-4 md:space-x-8">
          <img
            src={Logo}
            alt="Site Logo"
            className="w-20 h-20 md:w-16 md:h-16"
          />
          <span className="text-xl md:text-4xl whitespace-nowrap">
            <span className="md:mr-2 text-white font-escape">Math</span>
            <span className="md:mr-2 text-white font-escape">Saya</span>
          </span>
        </div>
      </Link>
    </nav>
  );
}
