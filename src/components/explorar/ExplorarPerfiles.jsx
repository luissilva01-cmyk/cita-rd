import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ExplorarPerfiles() {
  const [perfiles, setPerfiles] = useState([]);
  const [uidActual, setUidActual] = useState(null);
  const [filtroGenero, setFiltroGenero] = useState("");
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUidActual(user.uid);
      } else {
        setUidActual(null);
        setPerfiles([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const obtenerPerfiles = async () => {
      if (!uidActual) return;
      setLoading(true);
      setError("");
      try {
        const perfilesRef = collection(db, "perfiles");
        const snapshot = await getDocs(perfilesRef);
        const perfilesObtenidos = snapshot.docs
          .map((doc) => doc.data())
          .filter((perfil) => perfil.uid !== uidActual);
        setPerfiles(perfilesObtenidos);
      } catch (err) {
        console.error(err);
        setError("Error al cargar perfiles");
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfiles();
  }, [uidActual]);

  const perfilesFiltrados = perfiles.filter((perfil) => {
    const cumpleGenero = filtroGenero === "" || perfil.genero === filtroGenero;
    const cumpleNombre =
      busquedaNombre === "" ||
      perfil.nombre.toLowerCase().includes(busquedaNombre.toLowerCase());
    return cumpleGenero && cumpleNombre;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
          Explorar Perfiles
        </h2>

        <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Buscar perfiles por nombre"
          />
          <select
            value={filtroGenero}
            onChange={(e) => setFiltroGenero(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Filtrar perfiles por género"
          >
            <option value="">Filtrar por género</option>
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {loading && <p className="text-center text-gray-600">Cargando perfiles...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && perfilesFiltrados.length === 0 && (
          <p className="text-center text-gray-600">No se encontraron perfiles.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {perfilesFiltrados.map((perfil, index) => (
            <article
              key={index}
              className="border border-pink-300 rounded-xl p-4 shadow-sm bg-pink-50 flex flex-col items-center"
              tabIndex={0}
              aria-label={`Perfil de ${perfil.nombre}`}
            >
              {perfil.imagenUrl ? (
                <img
                  src={perfil.imagenUrl}
                  alt={`Foto de perfil de ${perfil.nombre}`}
                  className="w-28 h-28 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mb-4">
                  Sin foto
                </div>
              )}
              <h3 className="text-xl font-semibold mb-1">{perfil.nombre}</h3>
              <p className="text-gray-700">Edad: {perfil.edad}</p>
              <p className="text-gray-700">Género: {perfil.genero}</p>
              <p className="text-gray-700 text-center mt-2">{perfil.intereses}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
