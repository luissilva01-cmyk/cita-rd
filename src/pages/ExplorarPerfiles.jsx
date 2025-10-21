// src/pages/ExplorarPerfiles.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import PerfilCardProfesional from "../components/PerfilCardProfesional";
import { motion as Motion } from "framer-motion"; // ✅ renombrado para evitar warnings

export default function ExplorarPerfiles() {
  const [perfiles, setPerfiles] = useState([]);

  useEffect(() => {
    const fetchPerfiles = async () => {
      const querySnapshot = await getDocs(collection(db, "perfiles"));
      const lista = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPerfiles(lista);
    };
    fetchPerfiles();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // animación en cascada entre tarjetas
      },
    },
  };

  const handleVerMas = (perfil) => {
    alert(`💬 Perfil: ${perfil.nombre}\n${perfil.bio}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-white p-8">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
        Explorar Perfiles
      </h2>

      <Motion.div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {perfiles.map((perfil, i) => (
          <PerfilCardProfesional
            key={perfil.id}
            perfil={perfil}
            index={i}
            onVerMas={handleVerMas}
          />
        ))}
      </Motion.div>
    </div>
  );
}
