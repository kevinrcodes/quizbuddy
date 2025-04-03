import { useState } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { refresh } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.signInWithEmail(email, password);
      if (!result.success) {
        setError(result.error || "Login failed");
      } else {
        console.log("Login success. User info: ", result.user)
        await refresh()
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-12">
      <h2 className="text-white text-xl font-semibold text-center">Log in</h2>
      <input
        type="email"
        className="bg-white/10 text-white p-2 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="bg-white/10 text-white p-2 rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-white text-black py-2 rounded hover:bg-white/90 transition-colors"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </form>
  );
}
