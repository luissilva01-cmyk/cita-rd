// src/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { escucharMensajesRealtime, inicializarChat } from "../services/chatService"; 
// ⬆️ Se eliminó enviarMensaje del import

export default function ChatPage() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [other, setOther] = useState(null); 
  // ❌ typingUsers eliminado porque no se usa

  useEffect(() => {
    if (!chatId || !user?.uid) return;

    async function fetchOther() {
      try {
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);
        if (!chatSnap.exists()) return;

        const data = chatSnap.data();

        const otherUid =
          data.users?.find((u) => u !== user.uid) ||
          data.usuarios?.find((u) => u !== user.uid);

        if (!otherUid) return;

        const perfilSnap = await getDoc(doc(db, "perfiles", otherUid));
        setOther({
          uid: otherUid,
          ...(perfilSnap.exists() ? perfilSnap.data() : {}),
        });
      } catch (err) {
        console.error("Error fetching other user:", err);
      }
    }

    fetchOther();
    inicializarChat(chatId, user.uid);

    const unsub = escucharMensajesRealtime(chatId, () => {});
    return () => unsub && unsub();
  }, [chatId, user?.uid]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-3 bg-white shadow">
        <div className="flex items-center gap-3">
          <img
            src={other?.fotoURL || "/default-avatar.png"}
            alt={other?.nombre || "Usuario"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold">{other?.nombre || "Chat"}</div>
            <div className="text-xs text-gray-500">
              {other?.online
                ? "En línea"
                : "Últ. vez: " +
                  (other?.lastSeen
                    ? new Date(other.lastSeen.toDate()).toLocaleString()
                    : "desconocida")}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ChatWindow chatId={chatId} currentUser={user} />
      </main>

      <footer className="p-3 bg-white border-t">
        <ChatInput chatId={chatId} currentUser={user} />
      </footer>
    </div>
  );
}
