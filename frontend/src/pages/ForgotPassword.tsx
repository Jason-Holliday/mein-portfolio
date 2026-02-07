import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direkter API-Aufruf zu better-auth forget-password endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/reset-password`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Fehler beim Versenden der E-Mail");
      }
      
      setSent(true);
      toast.success("E-Mail wurde versendet! Überprüfe dein Postfach.");
    } catch (error: any) {
      console.error("Fehler:", error);
      toast.error(error.message || "Fehler beim Versenden der E-Mail");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#00FF9D]/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-[#00FF9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">E-Mail versendet!</h2>
            <p className="text-neutral-400 mb-6">
              Überprüfe dein E-Mail Postfach für den Reset-Link.
            </p>
            <Link
              to="/login"
              className="block w-full bg-[#00FF9D] text-black font-semibold py-3 rounded-lg hover:bg-[#00e08a] transition-colors"
            >
              Zurück zum Login
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
            Passwort vergessen?
          </h2>
          <p className="text-neutral-400 text-center mb-6">
            Gib deine E-Mail-Adresse ein und wir senden dir einen Reset-Link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="deine@email.de"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF9D] text-black font-semibold py-3 rounded-lg hover:bg-[#00e08a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sende..." : "Reset-Link senden"}
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