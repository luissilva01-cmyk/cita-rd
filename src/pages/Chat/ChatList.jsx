import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, "chats"), where("usuarios", "array-contains", uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaChats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(listaChats);
    });

    return () => unsubscribe();
  }, [uid]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
        💬 Tus Chats
      </h2>

      {chats.length === 0 ? (
        <p className="text-gray-500 text-center">No tienes chats activos todavía.</p>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const otroUsuarioId = chat.usuarios.find((id) => id !== uid);
            return (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className="block p-4 bg-white shadow rounded-xl hover:bg-purple-50 transition"
              >
                <p className="font-medium text-gray-800">
                  Chat con: <span className="text-purple-600">{otroUsuarioId}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {chat.ultimoMensaje
                    ? chat.ultimoMensaje.texto?.slice(0, 40) + "..."
                    : "Sin mensajes aún"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
