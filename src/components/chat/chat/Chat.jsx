import { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default function Chat({ chatId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId]);

  const enviarMensaje = async () => {
    if (!newMessage.trim()) return;
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: currentUserId,
        text: newMessage,
        createdAt: new Date()
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded shadow p-4">
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-2 rounded ${msg.senderId === currentUserId ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black mr-auto'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-3 py-2 border rounded-l"
        />
        <button
          onClick={enviarMensaje}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
