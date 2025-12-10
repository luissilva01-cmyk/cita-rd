// src/components/ReportarModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reportarUsuario, MOTIVOS_REPORTE } from "../services/reportesService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ReportarModal({ isOpen, onClose, usuarioReportado }) {
  const { user } = useAuth();
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!motivo) {
      toast.error("Selecciona un motivo");
      return;
    }

    setEnviando(true);

    const resultado = await reportarUsuario(
      user.uid,
      usuarioReportado.uid,
      motivo,
      descripcion
    );

    setEnviando(false);

    if (resultado.ok) {
      toast.success("Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.");
      onClose();
      setMotivo("");
      setDescripcion("");
    } else {
      toast.error(resultado.msg);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Reportar usuario
              </h2>

              <p className="text-gray-600 mb-4">
                Reportando a: <strong>{usuarioReportado?.nombre}</strong>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Motivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo del reporte *
                  </label>
                  <select
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un motivo</option>
                    {MOTIVOS_REPORTE.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción adicional (opcional)
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Proporciona más detalles si lo deseas..."
                    className="w-full border border-gray-300 rounded-lg p-2 h-24 resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                    disabled={enviando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                    disabled={enviando}
                  >
                    {enviando ? "Enviando..." : "Enviar reporte"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
