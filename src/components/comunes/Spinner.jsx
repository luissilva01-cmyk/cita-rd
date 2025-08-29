import React from "react";
import { motion as Motion } from "framer-motion";

export default function Spinner() {
  return (
    <Motion.div
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Motion.div
        className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </Motion.div>
  );
}
