import React from "react";

export default function ReplyPreview({ message, onCancel }) {
  return (
    <div className="bg-gray-100 p-2 rounded-lg mb-2 border-l-4 border-orange-500">
      <div className="flex justify-between items-center">
        <p className="text-sm opacity-80 italic truncate max-w-[80%]">
          Respondiendo a: {message.text || "mensaje"}
        </p>

        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
