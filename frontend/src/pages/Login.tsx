// src/pages/Login.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { authClient } from "../lib/auth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        fetchOptions: {
          credentials: 'include', 
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Login fehlgeschlagen");
      }

      console.log("✅ Login erfolgreich");
      toast.success("Willkommen zurück!");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload, um Session zu laden
      window.location.href = "/admin";
    } catch (err: any) {
      console.error("❌ Login Fehler:", err);
      toast.error(err.message || "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-[#00FF9D] mb-6 text-center">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                E-Mail
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
                Passwort
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Dein Passwort"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
              />

              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-neutral-400 hover:text-[#00FF9D] transition"
                >
                  Passwort vergessen?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF9D] text-black font-semibold py-3 rounded-lg hover:bg-[#00e08a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Lädt..." : "Einloggen"}
            </button>
          </form>

          <p className="mt-6 text-center text-neutral-400">
            Noch kein Account?{" "}
            <Link to="/register" className="text-[#00FF9D] hover:underline">
              Registrieren
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