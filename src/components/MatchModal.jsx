import { motion, AnimatePresence } from "framer-motion";

export default function MatchModal({ visible, usuario, matchUser, onClose }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <h2 className="text-3xl font-bold text-pink-500 mb-3">
              💘 ¡Es un Match!
            </h2>

            <div className="flex justify-center gap-4 my-4">
              <img src={usuario?.foto} className="w-20 h-20 rounded-full object-cover shadow" />
              <img src={matchUser?.foto} className="w-20 h-20 rounded-full object-cover shadow" />
            </div>

            <p className="text-gray-700 font-medium mb-4">
              Tú y <span className="text-pink-500">{matchUser?.nombre}</span> se gustaron 🥰
            </p>

            <button
              onClick={onClose}
              className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full w-full mt-2"
            >
              OK 💬
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
