// src/pages/VerPerfil.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;

export default function VerPerfil() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const docSnap = await getDoc(doc(db, "perfiles", id));
      if (docSnap.exists()) {
        setPerfil(docSnap.data());
      }
    };
    fetchPerfil();
  }, [id]);

  if (!perfil) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <MotionDiv
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-200 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <MotionDiv
        className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MotionH1
          className="text-2xl font-bold text-pink-600 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Perfil de {perfil.nombre}
        </MotionH1>

        <img
          src={perfil.foto || "https://via.placeholder.com/150"}
          alt={perfil.nombre}
          className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
        />

        <p className="text-gray-700 text-lg">Edad: {perfil.edad}</p>
      </MotionDiv>
    </MotionDiv>
  );
}
