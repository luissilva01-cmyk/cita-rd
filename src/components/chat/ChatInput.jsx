import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default function ChatInput({ chatId, currentUser, onTyping }) {
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  // 🔹 Detecta si el usuario está escribiendo
  useEffect(() => {
    if (!onTyping) return;
    if (mensaje.trim().length > 0) {
      onTyping(true);
      const timer = setTimeout(() => onTyping(false), 2000);
      return () => clearTimeout(timer);
    } else {
      onTyping(false);
    }
  }, [mensaje, onTyping]);

  // 🔹 Enviar mensaje
  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!mensaje.trim() || !chatId || !currentUser) return;

    setEnviando(true);
    try {
      await addDoc(collection(db, "chats", chatId, "mensajes"), {
        texto: mensaje.trim(),
        uid: currentUser.uid,
        nombre: currentUser.displayName || "Usuario",
        createdAt: serverTimestamp(),
      });

      // Opcional: marca última actividad del usuario en el chat
      await setDoc(doc(db, "chats", chatId), {
        ultimaActividad: serverTimestamp(),
      }, { merge: true });

      setMensaje("");
    } catch (error) {
      console.error("❌ Error enviando mensaje:", error);
    } finally {
      setEnviando(false);
    }
  };

  // 🔹 Permitir enviar con Enter y salto con Shift+Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar(e);
    }
  };

  return (
    <form
      onSubmit={handleEnviar}
      className="flex items-center space-x-2 bg-white p-3 rounded-xl shadow-md"
    >
      <textarea
        placeholder="Escribe un mensaje..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyDown={handleKeyPress}
        rows={1}
        className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        disabled={enviando}
      />
      <button
        type="submit"
        disabled={enviando || !mensaje.trim()}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition"
      >
        {enviando ? "..." : "➤"}
      </button>
    </form>
  );
}
