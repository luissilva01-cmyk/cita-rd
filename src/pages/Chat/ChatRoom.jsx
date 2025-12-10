// src/pages/chat/ChatRoom.jsx
import React, { useEffect, useState, useRef } from "react";
import { db } from "../../utils/firebase";

// ❗ Quitamos "where" que no se usa
import { collection, addDoc, query, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";

import ChatBubble from "../../components/chat/ChatBubble";
import { useParams } from "react-router-dom";

export default function ChatRoom() {
  const { id } = useParams();
  const uid = localStorage.getItem("uid");
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "chats", id, "mensajes"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMensajes(msgs);
    });

    return () => unsubscribe();
  }, [id]);

  const handleTyping = async (text) => {
    setMensaje(text);

    const userTypingRef = doc(db, "chats", id);
    setTypingUsers({ ...typingUsers, [uid]: text.length > 0 });

    await updateDoc(userTypingRef, {
      [`typing.${uid}`]: text.length > 0,
    });
  };

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    await addDoc(collection(db, "chats", id, "mensajes"), {
      texto: mensaje,
      uid,
      timestamp: new Date(),
    });

    setMensaje("");

    const userTypingRef = doc(db, "chats", id);
    await updateDoc(userTypingRef, {
      [`typing.${uid}`]: false,
    });

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white">
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {mensajes.map((m) => (
          <ChatBubble key={m.id} text={m.texto} mine={m.uid === uid} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-orange-500"
          placeholder="Escribe un mensaje..."
          value={mensaje}
          onChange={(e) => handleTyping(e.target.value)}
        />

        <button
          onClick={enviarMensaje}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
