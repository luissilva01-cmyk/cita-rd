import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ExplorarPerfiles() {
  const [perfiles, setPerfiles] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("todos");
  const [filtroUbicacion, setFiltroUbicacion] = useState("todos");

  useEffect(() => {
    const fetchPerfiles = async () => {
      const querySnapshot = await getDocs(collection(db, "perfiles"));
      setPerfiles(querySnapshot.docs.map((doc) => doc.data()));
    };
    fetchPerfiles();
  }, []);

  // 🔍 Filtrado dinámico
  const perfilesFiltrados = perfiles.filter((p) => {
    const coincideBusqueda =
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.bio?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideGenero =
      filtroGenero === "todos" || p.genero === filtroGenero;

    const coincideUbicacion =
      filtroUbicacion === "todos" ||
      p.ubicacion?.toLowerCase() === filtroUbicacion.toLowerCase();

    return coincideBusqueda && coincideGenero && coincideUbicacion;
  });

  // Extraer ubicaciones únicas para el filtro
  const ubicacionesUnicas = [
    ...new Set(perfiles.map((p) => p.ubicacion).filter(Boolean)),
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-pink-600 text-center">
        Explorar Perfiles
      </h2>

      {/* Controles de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o bio..."
          className="border border-gray-300 rounded-md p-2 w-full sm:w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="border border-gray-300 rounded-md p-2"
          value={filtroGenero}
          onChange={(e) => setFiltroGenero(e.target.value)}
        >
          <option value="todos">Todos los géneros</option>
          <option value="hombre">Hombres</option>
          <option value="mujer">Mujeres</option>
          <option value="otro">Otros</option>
        </select>

        <select
          className="border border-gray-300 rounded-md p-2"
          value={filtroUbicacion}
          onChange={(e) => setFiltroUbicacion(e.target.value)}
        >
          <option value="todos">Todas las ubicaciones</option>
          {ubicacionesUnicas.map((ubi) => (
            <option key={ubi} value={ubi}>
              {ubi}
            </option>
          ))}
        </select>
      </div>

      {/* Listado de perfiles */}
      {perfilesFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {perfilesFiltrados.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-200 hover:shadow-lg transition"
            >
              <img
                src={p.foto || "https://via.placeholder.com/150"}
                alt={p.nombre}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
              />
              <h3 className="font-semibold text-lg text-gray-800">{p.nombre}</h3>
              <p className="text-gray-500 text-sm">{p.ubicacion || "Sin ubicación"}</p>
              <p className="text-gray-600 mt-2 text-sm line-clamp-3">{p.bio}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No hay perfiles que coincidan con tu búsqueda o filtros.
        </p>
      )}
    </div>
  );
}
