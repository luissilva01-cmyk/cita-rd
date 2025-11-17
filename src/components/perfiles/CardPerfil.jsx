import React from "react";
import { useNavigate } from "react-router-dom";
import { crearChatSiNoExiste } from "../../services/chatService";

export default function CardPerfil({ perfil, currentUserId }) {
  const navigate = useNavigate();

  const handleChat = async () => {
    try {
      const chatId = await crearChatSiNoExiste(currentUserId, perfil.uid);
      navigate(`/chat/${chatId}`); // 🔗 Redirige al chat
    } catch (error) {
      console.error("Error al iniciar chat:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <img
        src={perfil.foto || "/default-avatar.png"}
        alt={perfil.nombre}
        className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
      />
      <h3 className="text-lg font-semibold text-center">{perfil.nombre}</h3>
      <p className="text-gray-500 text-sm text-center">{perfil.profesion}</p>

      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={handleChat}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition"
        >
          💬 Chatear
        </button>
      </div>
    </div>
  );
}
