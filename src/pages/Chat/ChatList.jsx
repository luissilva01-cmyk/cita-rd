// src/pages/chat/ChatList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, query, where, onSnapshot, getDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [infoUsuarios, setInfoUsuarios] = useState({});
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, "chats"), where("usuarios", "array-contains", uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const listaChats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setChats(listaChats);

      // cargar info de perfiles para mostrar nombre y foto
      for (const chat of listaChats) {
        const otroId = chat.usuarios.find((id) => id !== uid);

        if (!infoUsuarios[otroId]) {
          const ref = doc(db, "perfiles", otroId);
          const data = await getDoc(ref);
          if (data.exists()) {
            setInfoUsuarios((prev) => ({
              ...prev,
              [otroId]: data.data()
            }));
          }
        }
      }
    });

    return () => unsubscribe();
  }, [uid, infoUsuarios]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
        💬 Tus Chats
      </h2>

      {chats.length === 0 ? (
        <p className="text-gray-500 text-center">No tienes chats activos todavía.</p>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const otroId = chat.usuarios.find((id) => id !== uid);
            const perfil = infoUsuarios[otroId];

            return (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className="flex items-center gap-3 p-4 bg-white shadow rounded-xl hover:bg-orange-50 transition"
              >
                <img
                  src={perfil?.foto || "/default-avatar.png"}
                  alt="foto"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    {perfil?.nombre || `Usuario: ${otroId}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {chat.ultimoMensaje
                      ? chat.ultimoMensaje?.texto?.slice(0, 40) + "..."
                      : "Sin mensajes aún"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
