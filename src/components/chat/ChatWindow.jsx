import React, { useEffect, useRef } from "react";

export default function ChatWindow({ messages, currentUser }) {
  const bottomRef = useRef(null);

  // Auto scroll al recibir mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // ✔ Solo depende de messages

  return (
    <div className="p-3 space-y-2">
      {messages.map((msg) => {
        const isMe = msg.sender === currentUser;

        return (
          <div
            key={msg.id}
            className={`bubble ${isMe ? "bubble-me" : "bubble-other"}`}
          >
            {msg.text}
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
