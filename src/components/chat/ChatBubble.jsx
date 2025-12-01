// src/components/chat/ChatBubble.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ChatBubble({ text, mine }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-xs w-fit px-4 py-2 rounded-2xl text-sm shadow-md ${
        mine
          ? "bg-orange-500 text-white ml-auto"
          : "bg-white text-gray-800 border border-gray-200"
      }`}
    >
      {text}
    </motion.div>
  );
}
