import React from "react";

const EMOJIS = ["❤️", "😂", "👍", "🔥", "😮", "😢"];

export default function EmojiReactionPicker({ onSelect, onClose }) {
  return (
    <div className="absolute bottom-full mb-1 right-0 bg-white shadow-xl rounded-2xl p-2 flex gap-2 z-50">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="text-xl hover:scale-125 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
