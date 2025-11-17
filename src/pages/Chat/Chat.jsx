import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatInput from "../../components/chat/ChatInput";

const Chat = () => {
  const { chatId } = useParams();
  const { usuario: currentUser } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [infoOtroUsuario, setInfoOtroUsuario] = useState(null);
  const [escribiendo, setEscribiendo] = useState(false);
  const endRef = useRef(null);

  // 🔹 Obtener mensajes del chat en tiempo real
  useEffect(() => {
    if (!chatId) return;

    const mensajesRef = collection(db, "chats", chatId, "mensajes");
    const q = query(mensajesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mensajesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMensajes(mensajesData);
    });

    return () => unsubscribe();
  }, [chatId]);

  // 🔹 Obtener información del otro usuario (nombre, foto)
  useEffect(() => {
    const obtenerInfoOtroUsuario = async () => {
      if (!chatId || !currentUser) return;
      try {
        // Chat ID con formato `${uid1}_${uid2}` → extraemos el otro UID
        const ids = chatId.split("_");
        const otroId = ids.find((id) => id !== currentUser.uid);

        const otroPerfilRef = doc(db, "perfiles", otroId);
        const docSnap = await getDoc(otroPerfilRef);
        if (docSnap.exists()) {
          setInfoOtroUsuario(docSnap.data());
        }
      } catch (error) {
        console.error("❌ Error obteniendo info del otro usuario:", error);
      }
    };
    obtenerInfoOtroUsuario();
  }, [chatId, currentUser]);

  // 🔹 Scroll automático al final
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes]);

  // 🔹 Función auxiliar: enviar mensaje
  const enviarMensaje = async (texto) => {
    if (!texto.trim()) return;
    const mensajesRef = collection(db, "chats", chatId, "mensajes");
    await setDoc(doc(mensajesRef), {
      texto,
      remitenteId: currentUser.uid,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* 🔹 Encabezado con foto del otro usuario */}
      <header className="flex items-center gap-3 p-4 bg-orange-500 text-white shadow">
        {infoOtroUsuario ? (
          <>
            <img
              src={infoOtroUsuario.fotoURL || "/default-avatar.png"}
              alt="perfil"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold">{infoOtroUsuario.nombre}</h2>
              {escribiendo ? (
                <p className="text-xs text-orange-100 italic">escribiendo...</p>
              ) : (
                <p className="text-xs text-orange-100">En línea</p>
              )}
            </div>
          </>
        ) : (
          <p className="font-medium">Cargando chat...</p>
        )}
      </header>

      {/* 🔹 Ventana de mensajes */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        <ChatWindow mensajes={mensajes} currentUser={currentUser} />
        <div ref={endRef} />
      </main>

      {/* 🔹 Entrada de texto */}
      <footer className="p-3 border-t bg-white">
        {currentUser ? (
          <ChatInput
            chatId={chatId}
            currentUser={currentUser}
            onSend={enviarMensaje}
            onTyping={setEscribiendo}
          />
        ) : (
          <p className="text-center text-gray-500">
            Debes iniciar sesión para enviar mensajes.
          </p>
        )}
      </footer>
    </div>
  );
};

export default Chat;
