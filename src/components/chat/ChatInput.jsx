// src/components/chat/ChatInput.jsx
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default function ChatInput({ chatId, currentUser }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e && e.preventDefault();
    if (!text.trim() || !chatId || !currentUser) return;

    setSending(true);
    try {
      await addDoc(collection(db, "chats", chatId, "mensajes"), {
        texto: text.trim(),
        uid: currentUser.uid,
        nombre: currentUser.displayName || currentUser.email || "Usuario",
        createdAt: serverTimestamp(),
      });

      // actualizar campo ultimoMensaje y updatedAt en chat padre (útil para ChatList)
      await updateDoc(doc(db, "chats", chatId), {
        ultimoMensaje: {
          texto: text.trim(),
          uid: currentUser.uid,
          nombre: currentUser.displayName || currentUser.email || "Usuario",
          createdAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });

      setText("");
      // vibración breve (si el dispositivo lo soporta)
      if (navigator.vibrate) navigator.vibrate(40);
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2 items-center">
      <input
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe un mensaje..."
        disabled={sending}
      />
      <button
        type="submit"
        className={`px-4 py-2 rounded-full text-white ${sending ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"}`}
        disabled={sending || !text.trim()}
      >
        {sending ? "..." : "Enviar"}
      </button>
    </form>
  );
}
