import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  suscribirMensajes,
  suscribirStatusUsuario,
  enviarMensaje,
  marcarMensajesLeidos,
  setOnlineStatus,
} from "../../services/chatService";
import { useAuth } from "../../context/AuthContext";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatInput from "../../components/chat/ChatInput";

const Chat = () => {
  const { chatId } = useParams();
  const { usuario: currentUser } = useAuth();

  const [mensajes, setMensajes] = useState([]);
  const [typingStatus, setTypingStatus] = useState(false);
  const [onlineStatus, setOnlineStatusState] = useState(false);

  const endRef = useRef(null);

  // Obtener UID del otro usuario (NO poner función, así evitamos warnings)
  const otherUid = chatId
    ? chatId.split("_").find((id) => id !== currentUser?.uid)
    : null;

  // 🔹 SUSCRIBIR MENSAJES
  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = suscribirMensajes(chatId, (msgs) => {
      setMensajes(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  // 🔹 MARCAR MENSAJES LEÍDOS
  useEffect(() => {
    if (!chatId || !currentUser) return;
    if (mensajes.length === 0) return;

    marcarMensajesLeidos(chatId, currentUser.uid);
  }, [mensajes, chatId, currentUser]);

  // 🔹 SUSCRIBIR ESTADO (online + escribiendo)
  useEffect(() => {
    if (!chatId || !otherUid) return;

    const unsubscribe = suscribirStatusUsuario(chatId, otherUid, (status) => {
      if (!status) return;

      setTypingStatus(status.typing ?? false);
      setOnlineStatusState(status.online ?? false);
    });

    return () => unsubscribe();
  }, [chatId, otherUid]);

  // 🔹 ACTUALIZAR MI ESTADO ONLINE
  useEffect(() => {
    if (!chatId || !currentUser) return;

    setOnlineStatus(chatId, currentUser.uid, true);

    const handleOffline = () => {
      setOnlineStatus(chatId, currentUser.uid, false);
    };

    window.addEventListener("beforeunload", handleOffline);
    return () => handleOffline();
  }, [chatId, currentUser]);

  // 🔹 SCROLL AUTOMÁTICO
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes]);

  // 🔹 Enviar mensaje
  const handleSend = (texto) => {
    if (!texto.trim()) return;
    enviarMensaje(chatId, currentUser.uid, texto);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-orange-50 to-white">
      
      {/* HEADER */}
      <header className="flex items-center gap-3 p-4 bg-orange-500 text-white shadow">
        <div>
          {typingStatus ? (
            <p className="text-xs italic text-orange-100">escribiendo…</p>
          ) : onlineStatus ? (
            <p className="text-xs text-orange-100">En línea</p>
          ) : (
            <p className="text-xs text-orange-100 italic">Última vez recientemente</p>
          )}
        </div>
      </header>

      {/* MENSAJES */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        <ChatWindow mensajes={mensajes} currentUser={currentUser} />
        <div ref={endRef} />
      </main>

      {/* INPUT */}
      <footer className="p-3 bg-white border-t">
        <ChatInput chatId={chatId} currentUser={currentUser} onSend={handleSend} />
      </footer>
    </div>
  );
};

export default Chat;
