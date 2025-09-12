import { useState, useEffect, useRef, useCallback } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import CardPerfil from "./CardPerfil";
import Spinner from "../comunes/Spinner";

const PAGE_SIZE = 10;

export default function ExplorarPerfiles() {
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const cargarPerfiles = useCallback(async () => {
    setLoading(true);
    try {
      const perfilesRef = collection(db, "perfiles");
      let q = query(perfilesRef, orderBy("createdAt", "desc"), limit(PAGE_SIZE));
      if (lastDoc) q = query(perfilesRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(PAGE_SIZE));
      const snapshot = await getDocs(q);

      const nuevosPerfiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPerfiles(prev => [...prev, ...nuevosPerfiles]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      if (snapshot.docs.length < PAGE_SIZE) setHasMore(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [lastDoc]);

  const lastPerfilRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        cargarPerfiles();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, cargarPerfiles]);

  useEffect(() => {
    cargarPerfiles();
  }, [cargarPerfiles]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {perfiles.map((perfil, index) => {
        if (index === perfiles.length - 1) {
          return <CardPerfil key={perfil.id} perfil={perfil} ref={lastPerfilRef} />;
        }
        return <CardPerfil key={perfil.id} perfil={perfil} />;
      })}
      {loading && <Spinner />}
      {!hasMore && <p className="text-center text-gray-500">No hay más perfiles</p>}
    </div>
  );
}
