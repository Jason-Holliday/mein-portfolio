// pages/Register.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { authClient } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein");
      setLoading(false);
      return;
    }

    try {
      await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      console.log("✅ Registrierung erfolgreich");
      navigate("/admin");
    } catch (err) {
      console.error("❌ Registrierungsfehler:", err);
      
      if (err instanceof Error) {
        if (err.message?.includes("already exists")) {
          setError("Diese Email ist bereits registriert");
        } else {
          setError(err.message || "Registrierung fehlgeschlagen");
        }
      } else {
        setError("Registrierung fehlgeschlagen");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-[#00FF9D] mb-6 text-center">
            Registrieren
          </h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Dein Name"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="deine@email.de"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Passwort (min. 8 Zeichen)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Mindestens 8 Zeichen"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF9D] text-black font-semibold py-3 rounded-lg hover:bg-[#00e08a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Wird registriert..." : "Registrieren"}
            </button>
          </form>

          <p className="mt-6 text-center text-neutral-400">
            Bereits registriert?{" "}
            <Link to="/login" className="text-[#00FF9D] hover:underline">
              Zum Login
            </Link>
          </p>

          <Link
            to="/"
            className="block mt-4 text-center text-neutral-500 hover:text-neutral-300 text-sm"
          >
            ← Zurück zum Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}