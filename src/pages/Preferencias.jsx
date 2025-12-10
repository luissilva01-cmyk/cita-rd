// src/pages/Preferencias.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { obtenerPreferencias, guardarPreferencias } from "../services/preferenciasService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Preferencias() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  const [preferencias, setPreferencias] = useState({
    edadMin: 18,
    edadMax: 99,
    distanciaMax: 50,
    generoInteres: "todos",
    mostrarPerfil: true,
    notificaciones: {
      matches: true,
      mensajes: true,
      likes: true
    }
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    cargarPreferencias();
  }, [user]);

  async function cargarPreferencias() {
    const resultado = await obtenerPreferencias(user.uid);
    if (resultado.ok) {
      setPreferencias(resultado.data);
    }
    setLoading(false);
  }

  async function handleGuardar(e) {
    e.preventDefault();
    setGuardando(true);

    const resultado = await guardarPreferencias(user.uid, preferencias);

    setGuardando(false);

    if (resultado.ok) {
      toast.success("Preferencias guardadas");
    } else {
      toast.error(resultado.msg);
    }
  }

  if (loading) {
    return <div className="text-center mt-20">Cargando preferencias...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Preferencias</h1>

      <form onSubmit={handleGuardar} className="space-y-6 bg-white rounded-2xl shadow-lg p-6">
        
        {/* Rango de edad */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Rango de edad</h3>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Mínima</label>
              <input
                type="number"
                min="18"
                max="99"
                value={preferencias.edadMin}
                onChange={(e) => setPreferencias({...preferencias, edadMin: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <span className="text-gray-400 mt-6">-</span>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Máxima</label>
              <input
                type="number"
                min="18"
                max="99"
                value={preferencias.edadMax}
                onChange={(e) => setPreferencias({...preferencias, edadMax: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        </div>

        {/* Distancia máxima */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Distancia máxima: {preferencias.distanciaMax} km
          </h3>
          <input
            type="range"
            min="1"
            max="200"
            value={preferencias.distanciaMax}
            onChange={(e) => setPreferencias({...preferencias, distanciaMax: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>

        {/* Género de interés */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Interesado en</h3>
          <select
            value={preferencias.generoInteres}
            onChange={(e) => setPreferencias({...preferencias, generoInteres: e.target.value})}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="todos">Todos</option>
            <option value="hombres">Hombres</option>
            <option value="mujeres">Mujeres</option>
          </select>
        </div>

        {/* Notificaciones */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Notificaciones</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preferencias.notificaciones.matches}
                onChange={(e) => setPreferencias({
                  ...preferencias,
                  notificaciones: {...preferencias.notificaciones, matches: e.target.checked}
                })}
                className="w-5 h-5"
              />
              <span>Nuevos matches</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preferencias.notificaciones.mensajes}
                onChange={(e) => setPreferencias({
                  ...preferencias,
                  notificaciones: {...preferencias.notificaciones, mensajes: e.target.checked}
                })}
                className="w-5 h-5"
              />
              <span>Mensajes nuevos</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preferencias.notificaciones.likes}
                onChange={(e) => setPreferencias({
                  ...preferencias,
                  notificaciones: {...preferencias.notificaciones, likes: e.target.checked}
                })}
                className="w-5 h-5"
              />
              <span>Likes recibidos</span>
            </label>
          </div>
        </div>

        {/* Mostrar perfil */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferencias.mostrarPerfil}
              onChange={(e) => setPreferencias({...preferencias, mostrarPerfil: e.target.checked})}
              className="w-5 h-5"
            />
            <span className="text-gray-700">Mostrar mi perfil en exploración</span>
          </label>
        </div>

        {/* Botón guardar */}
        <button
          type="submit"
          disabled={guardando}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar preferencias"}
        </button>
      </form>
    </div>
  );
}
