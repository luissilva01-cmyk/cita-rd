export default function EnvDebug() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>🔍 Variables de entorno (Vercel)</h2>
      <ul>
        <li><strong>API Key:</strong> {import.meta.env.VITE_FIREBASE_API_KEY || "❌ No recibida"}</li>
        <li><strong>Auth Domain:</strong> {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "❌ No recibida"}</li>
        <li><strong>Project ID:</strong> {import.meta.env.VITE_FIREBASE_PROJECT_ID || "❌ No recibida"}</li>
        <li><strong>Storage Bucket:</strong> {import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "❌ No recibida"}</li>
        <li><strong>Messaging Sender ID:</strong> {import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "❌ No recibida"}</li>
        <li><strong>App ID:</strong> {import.meta.env.VITE_FIREBASE_APP_ID || "❌ No recibida"}</li>
      </ul>
    </div>
  );
}
