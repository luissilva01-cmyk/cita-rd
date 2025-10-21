// src/components/PerfilCardProfesional.jsx
import React from "react";
import { motion as M } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120, damping: 12 },
  }),
};

export default function PerfilCardProfesional({ perfil, index, onVerMas }) {
  return (
    <M.div
      className="bg-white rounded-2xl p-6 shadow-lg max-w-xs mx-auto cursor-grab hover:scale-105 hover:shadow-2xl transition-transform duration-300 border border-gray-200"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileTap={{ scale: 0.95 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.3}
      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(128, 90, 213, 0.3)" }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) {
          console.log("💜 Swiped right:", perfil.nombre);
        } else if (info.offset.x < -100) {
          console.log("🖤 Swiped left:", perfil.nombre);
        }
      }}
    >
      <h3 className="text-xl font-bold mb-2 text-purple-600">{perfil.nombre}</h3>
      <p className="text-gray-700 mb-4 line-clamp-3">{perfil.bio}</p>
      <button
        onClick={() => onVerMas(perfil)}
        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 w-full"
      >
        Ver más
      </button>
    </M.div>
  );
}
