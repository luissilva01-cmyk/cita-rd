import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { darLike } from "../services/likesService";
import { useAuth } from "../context/AuthContext";

export default function ExplorarPerfilesSwipe() {
  const [index, setIndex] = useState(0);
  const [perfiles, setPerfiles] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const q = await getDocs(collection(db, "perfiles"));
      setPerfiles(q.docs.map(d => ({id:d.id,...d.data()})));
    })();
  }, []);

  const perfil = perfiles[index];

  async function like() {
    await darLike(user.uid, perfil.uid);
    setIndex(i => i + 1);
  }

  function skip() {
    setIndex(i => i + 1);
  }

  if (!perfil) return <h2 className="text-center mt-20 text-gray-600">No hay más perfiles 😅</h2>;

  return (
    <div className="flex flex-col items-center pt-10">
      <AnimatePresence>
        <motion.div
          key={perfil.uid}
          className="bg-white shadow-xl rounded-2xl overflow-hidden w-80 relative"
          drag="x"
          onDragEnd={(e,info) => info.offset.x>120?like():info.offset.x<-120?skip():null}
          initial={{opacity:0,scale:0.7}}
          animate={{opacity:1,scale:1}}
          exit={{opacity:0,scale:0.6}}
        >
          <img src={perfil.foto} className="h-96 w-full object-cover"/>
          <div className="p-4">
            <h3 className="text-2xl font-bold">{perfil.nombre}</h3>
            <p className="text-gray-600">{perfil.descripcion}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-6 mt-6">
        <button className="bg-gray-300 p-3 rounded-full" onClick={skip}>❌</button>
        <button className="bg-pink-500 text-white p-3 rounded-full" onClick={like}>💘</button>
      </div>
    </div>
  );
}
