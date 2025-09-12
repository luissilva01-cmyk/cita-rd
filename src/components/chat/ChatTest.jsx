// src/components/chat/ChatTest.jsx
import { useState } from "react";
import { crearChat } from "../../services/chatService";

export default function ChatTest() {
  const [status, setStatus] = useState("");

  const handleCrearChat = async () => {
    try {
      // ⚡ Simulación: tu usuario logueado (ejemplo)
      const uid1 = "PvmMD6yw4nWgBBpSx9vYYNadVV22"; 
      // ⚡ Simulación: otro usuario con quien vas a chatear
      const uid2 = "OtroUIDdePrueba";             

      const chatId = await crearChat(uid1, uid2);
      setStatus(`✅ Chat creado con ID: ${chatId}`);
    } catch (error) {
      console.error("Error creando chat:", error);
      setStatus("❌ Error creando chat");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-2">Prueba de Chat</h2>
      <button
        onClick={handleCrearChat}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Crear Chat
      </button>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
