import { Leaf } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <Leaf className="text-green-600" />

          <span className="font-bold text-xl">
            CarbonWise AI
          </span>
        </Link>

        <Link
          to="/register"
          className="
          bg-green-600
          text-white
          px-4
          py-2
          rounded-lg
          hover:bg-green-700
          transition
          "
        >
          Get Started
        </Link>

      </div>
    </header>
  );
}