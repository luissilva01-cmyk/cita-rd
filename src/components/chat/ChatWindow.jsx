// src/components/chat/ChatWindow.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { escucharMensajesRealtime } from "../../services/chatService";
import { db } from "../../utils/firebase";
import { getDoc, doc } from "firebase/firestore";

export default function ChatWindow({ chatId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [profiles, setProfiles] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const unsub = escucharMensajesRealtime(chatId, setMessages);
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⬇️ MEMORIZAMOS loadUser para que no cambie en cada render
  const loadUser = useCallback(async (uid) => {
    if (!uid || profiles[uid]) return;
    const snap = await getDoc(doc(db, "perfiles", uid));
    if (snap.exists()) {
      setProfiles((p) => ({ ...p, [uid]: snap.data() }));
    }
  }, [profiles]);

  // ⬇️ Ya podemos agregarlo como dependencia correctamente
  useEffect(() => {
    messages.forEach((m) => loadUser(m.uid));
  }, [messages, loadUser]);

  return (
    <div className="p-3 space-y-2 h-full overflow-y-auto">
      {messages.map((msg) => {
        const isMe = msg.uid === currentUser?.uid;
        const foto = profiles[msg.uid]?.fotoURL || "/default-avatar.png";
        const hora = msg.createdAt?.toDate?.()?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });

        return (
          <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
            {!isMe && <img src={foto} className="w-7 h-7 rounded-full object-cover shadow-sm" />}

            <div className={`max-w-[70%] px-3 py-2 text-sm rounded-lg shadow 
              ${isMe ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"}`}>
              <p>{msg.text || msg.texto}</p>
              <span className="text-[10px] block text-right opacity-70 mt-1">{hora}</span>
            </div>

            {isMe && <img src={foto} className="w-7 h-7 rounded-full object-cover shadow-sm" />}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
