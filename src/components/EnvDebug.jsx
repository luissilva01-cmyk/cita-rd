export default function EnvDebug() {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>🔍 Variables de entorno</h2>
      <p><strong>API Key:</strong> {apiKey || "❌ No recibida"}</p>
    </div>
  );
}
