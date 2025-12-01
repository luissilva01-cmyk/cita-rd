// src/pages/ChatPage.jsx (esqueleto)
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import { inicializarChat, escucharMensajesRealtime, enviarMensaje } from "../services/chatService";
import { useAuth } from "../context/AuthProvider";

export default function ChatPage() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;
    inicializarChat(chatId);
    const unsub = escucharMensajesRealtime(chatId, (msgs) => setMessages(msgs));
    return () => unsub();
  }, [chatId]);

  const handleSend = async (payload) => {
    await enviarMensaje({ chatId, senderId: user.uid, ...payload });
  };

  const handleLoadOlder = (older) => {
    setMessages((prev) => [...older, ...prev]);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <ChatWindow chatId={chatId} currentUser={user} messages={messages} onLoadOlder={handleLoadOlder} />
      </div>

      <ChatInput chatId={chatId} currentUser={user} onMessageSent={handleSend} />
    </div>
  );
}
