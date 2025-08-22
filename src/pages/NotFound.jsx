import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200 p-6">
      <h1 className="text-6xl font-bold text-pink-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Página no encontrada</p>
      <Link
        to="/"
        className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
      >
        Ir a Inicio
      </Link>
    </div>
  );
}
