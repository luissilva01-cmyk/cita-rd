// src/components/chat/ChatWindow.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { loadOlderMessages } from "../../services/chatService";

export default function ChatWindow({ chatId, currentUser, messages, onLoadOlder }) {
  const containerRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState({}); // { uid: true }
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [oldestSnapshot, setOldestSnapshot] = useState(null); // store last doc snapshot for pagination

  // subscribe to chat doc for typing object
  useEffect(() => {
    if (!chatId) return;
    const unsub = onSnapshot(doc(db, "chats", chatId), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setTypingUsers(data.typing || {});
    });
    return () => unsub();
  }, [chatId]);

  // auto-scroll to bottom on new messages
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // infinite scroll handler
  const handleScroll = useCallback(async () => {
    const el = containerRef.current;
    if (!el || loadingOlder) return;
    if (el.scrollTop < 120) {
      // near top -> load older
      setLoadingOlder(true);
      try {
        // use loadOlderMessages; pass the oldestSnapshot (if null, it will fetch last page)
        const { messages: older, lastVisible } = await loadOlderMessages(chatId, 20, oldestSnapshot);
        // caller (ChatPage) should prepend older to existing messages; we use callback onLoadOlder
        if (onLoadOlder && older.length > 0) onLoadOlder(older);
        if (lastVisible) setOldestSnapshot(lastVisible);
      } catch (e) {
        console.error("load older err:", e);
      } finally {
        setLoadingOlder(false);
      }
    }
  }, [chatId, loadingOlder, oldestSnapshot, onLoadOlder]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // compute typing text (exclude currentUser)
  const otherTyping = Object.keys(typingUsers).filter((uid) => typingUsers[uid] && uid !== currentUser?.uid);

  return (
    <div ref={containerRef} className="chat-container overflow-auto" style={{ height: "100%" }}>
      {/* optionally show loading older */}
      {loadingOlder && (
        <div className="text-center text-sm text-gray-500 py-2">Cargando mensajes anteriores...</div>
      )}

      {messages.map((m) => {
        const isMe = m.senderId === currentUser?.uid;
        const reacts = m.reactions || {}; // map uid => emoji
        const reactSummary = Object.values(reacts).reduce((acc, em) => {
          acc[em] = (acc[em] || 0) + 1;
          return acc;
        }, {});
        return (
          <div key={m.id} className={`bubble ${isMe ? "bubble-me" : "bubble-other"}`}>
            {m.replyTo && (
              <div className="text-xs italic opacity-80 border-l-2 pl-2 mb-1">
                {m.replyTo.text || "Mensaje citado"}
              </div>
            )}

            {m.text && <div className="whitespace-pre-wrap">{m.text}</div>}

            {/* Reacciones summary */}
            {Object.keys(reactSummary).length > 0 && (
              <div className="mt-2 inline-flex gap-2 items-center bg-white/60 rounded-full px-2 py-1 shadow-sm text-xs">
                {Object.entries(reactSummary).map(([emoji, count]) => (
                  <div key={emoji} className="flex items-center gap-1 px-2">
                    <span>{emoji}</span>
                    <small className="text-xs">{count}</small>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs opacity-60 mt-1 text-right">
              {m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
            </div>
          </div>
        );
      })}

      {/* typing indicator */}
      {otherTyping.length > 0 && (
        <div className="p-2 text-sm text-gray-600 italic">{otherTyping.length === 1 ? "Está escribiendo…" : "Varios escriben…"}</div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
