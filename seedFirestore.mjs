// seedFirestore.mjs
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// 🔥 Usa tus credenciales reales desde firebase.js
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "citard-fbc26.firebaseapp.com",
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedFirestore() {
  console.log("⏳ Creando colecciones y documentos de ejemplo...");

  const perfiles = [
    {
      id: "uid1",
      nombre: "Luis Martínez",
      edad: 29,
      genero: "masculino",
      intereses: ["música", "viajes", "tecnología"],
      descripcion: "Amo la programación y conocer nuevas culturas.",
      fotoPerfil: "https://randomuser.me/api/portraits/men/32.jpg",
      visible: true,
      creadoEn: serverTimestamp(),
    },
    {
      id: "uid2",
      nombre: "Ana Pérez",
      edad: 27,
      genero: "femenino",
      intereses: ["arte", "fotografía", "aventuras"],
      descripcion: "Creativa y amante de la naturaleza 🌿.",
      fotoPerfil: "https://randomuser.me/api/portraits/women/45.jpg",
      visible: true,
      creadoEn: serverTimestamp(),
    },
    {
      id: "uid3",
      nombre: "Carlos Gómez",
      edad: 31,
      genero: "masculino",
      intereses: ["deporte", "cine", "cocina"],
      descripcion: "Buscando nuevas amistades con buena vibra.",
      fotoPerfil: "https://randomuser.me/api/portraits/men/77.jpg",
      visible: true,
      creadoEn: serverTimestamp(),
    },
  ];

  for (const perfil of perfiles) {
    await setDoc(doc(collection(db, "perfiles"), perfil.id), perfil);
  }

  const matches = [
    {
      id: "match1",
      usuarios: ["uid1", "uid2"],
      creadoEn: serverTimestamp(),
    },
    {
      id: "match2",
      usuarios: ["uid2", "uid3"],
      creadoEn: serverTimestamp(),
    },
  ];

  for (const match of matches) {
    await setDoc(doc(collection(db, "matches"), match.id), match);
  }

  console.log("✅ Datos de prueba creados correctamente en Firestore");
}

// 🚀 Ejecutar la función y cerrar el proceso
seedFirestore()
  .then(() => {
    console.log("👋 Script finalizado.");
  })
  .catch((error) => {
    console.error("❌ Error creando los datos:", error);
  });
