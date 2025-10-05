import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function ExplorarPerfiles() {
  const [perfiles, setPerfiles] = useState([]);

  useEffect(() => {
    const fetchPerfiles = async () => {
      const querySnapshot = await getDocs(collection(db, "perfiles"));
      setPerfiles(querySnapshot.docs.map((doc) => doc.data()));
    };
    fetchPerfiles();
  }, []);

  return (
    <div>
      <h2>Explorar Perfiles</h2>
      {perfiles.length > 0 ? (
        <ul>
          {perfiles.map((p, i) => (
            <li key={i}>
              <strong>{p.nombre}</strong> - {p.bio}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay perfiles disponibles.</p>
      )}
    </div>
  );
}

export default ExplorarPerfiles;
