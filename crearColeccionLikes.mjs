import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

// 🔥 Copia tus credenciales EXACTAS desde src/utils/firebase.js
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

async function crearLikes() {
  console.log("⏳ Creando colección 'likes' en Firestore...");

  try {
    // Creamos un documento vacío de ejemplo
    await setDoc(doc(db, "likes", "example_like"), {
      de: "uid_demo_1",
      para: "uid_demo_2",
      timestamp: Date.now(),
    });

    console.log("✅ Colección 'likes' creada con documento example_like");
  } catch (error) {
    console.error("❌ Error creando likes:", error);
  }
}

crearLikes()
  .then(() => {
    console.log("🎉 Script finalizado");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
