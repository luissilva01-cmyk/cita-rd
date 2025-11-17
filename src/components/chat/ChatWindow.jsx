import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWindow({ mensajes, currentUser }) {
  const scrollRef = useRef(null);

  // 🔹 Scroll automático al último mensaje
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const formatearHora = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const fecha = timestamp.toDate();
    return fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col space-y-2 p-4 overflow-y-auto h-full bg-gradient-to-b from-orange-50 to-white">
      {mensajes.length === 0 && (
        <p className="text-gray-400 text-center mt-10">No hay mensajes todavía.</p>
      )}

      <AnimatePresence>
        {mensajes.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex ${
              msg.uid === currentUser?.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl shadow-sm ${
                msg.uid === currentUser?.uid
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm font-semibold">{msg.nombre}</p>
              <p className="text-sm break-words">{msg.texto}</p>
              <p
                className={`text-[10px] mt-1 ${
                  msg.uid === currentUser?.uid ? "text-orange-100" : "text-gray-400"
                }`}
              >
                {formatearHora(msg.createdAt)}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div ref={scrollRef} />
    </div>
  );
}
