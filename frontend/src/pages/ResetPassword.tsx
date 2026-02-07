// src/pages/ResetPassword.tsx
import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authClient } from "../lib/auth";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwörter stimmen nicht überein");
      return;
    }

    if (password.length < 8) {
      toast.error("Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    if (!token) {
      toast.error("Ungültiger Reset-Link");
      return;
    }

    setLoading(true);

    try {
      // Better Auth resetPassword nutzen
      await authClient.resetPassword({
        newPassword: password,
        token,
      });

      toast.success("Passwort erfolgreich zurückgesetzt!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      console.error("Fehler:", error);
      toast.error("Fehler beim Zurücksetzen des Passworts");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Ungültiger Link</h2>
            <p className="text-neutral-400 mb-6">
              Dieser Reset-Link ist ungültig oder abgelaufen.
            </p>
            <Link
              to="/forgot-password"
              className="block w-full bg-[#00FF9D] text-black font-semibold py-3 rounded-lg hover:bg-[#00e08a] transition-colors"
            >
              Neuen Link anfordern
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-[#00FF9D] mb-2 text-center">
            Neues Passwort
          </h2>
          <p className="text-neutral-400 text-center mb-6">
            Gib dein neues Passwort ein.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Neues Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mindestens 8 Zeichen"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Passwort wiederholen"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF9D] text-black font-semibold py-3 rounded-lg hover:bg-[#00e08a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Speichere..." : "Passwort ändern"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-neutral-400 hover:text-[#00FF9D] transition">
              ← Zurück zum Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}