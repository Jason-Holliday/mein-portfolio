import { useState, useEffect } from "react";
import { useSession, authClient } from "../lib/auth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Settings = () => {
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  if (isPending) return <div>Lädt...</div>;
  if (!session?.user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Name ändern
      await authClient.updateUser({ name });

      // Passwort ändern, nur wenn eingegeben
      if (newPassword) {
        await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        });
      }

      toast.success("Daten erfolgreich aktualisiert!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Fehler beim Aktualisieren");
    }
  };


  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Link
        to="/admin"
        className="block mb-6 text-center text-neutral-500 hover:text-neutral-300 text-sm"
      >
        ← Zurück zur Admin-Startseite
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dein Name"
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            E-Mail
          </label>
          <input
            type="email"
            name="email"
            value={email}
            readOnly
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-400 cursor-not-allowed"
          />
          <p className="text-xs text-neutral-500 mt-1">
            E-Mail kann aktuell nicht geändert werden.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Altes Passwort
          </label>
          <input
            type="password"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Altes Passwort"
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
          />

          <label className="block text-sm font-medium text-neutral-300 mb-2 mt-4">
            Neues Passwort
          </label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Neues Passwort"
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full px-4 py-3 bg-[#00FF9D] text-black font-semibold rounded-lg hover:bg-[#00e286] transition"
        >
          Speichern
        </button>
      </form>
    </div>
  );
};
export default Settings;
