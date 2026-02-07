// components/AdminNavbar.tsx
import { PlusIcon, LogOutIcon, UserIcon, SettingsIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authClient, useSession } from "../lib/auth";

const AdminNavbar = () => {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout Fehler:", error);
    }
  };

  return (
    <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
      <div className="mx-auto max-w-screen-2xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Titel */}
          <Link
            to="/admin"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9D] rounded-lg"
            aria-label="Zur Startseite"
          >
            <img
              src="/project-managment-icon.png"
              alt="Zur Startseite Projekt-Managment"
              className="w-12 h-12"
            />
            <h1 className="text-3xl font-bold text-[#00FF9D] font-mono tracking-tighter hover:text-[#00e08a] transition-colors">
              Projekt-Management
            </h1>
          </Link>

          {/* Navigation */}
          <nav>
            <div className="flex items-center gap-4">
              <Link
                to="/create"
                className="flex items-center gap-2 bg-[#00FF9D] text-black px-4 py-2 rounded-xl font-medium hover:bg-[#00e08a] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9D]"
                aria-label="Neues Projekt erstellen"
              >
                <PlusIcon className="size-5" aria-hidden="true" />
                <span>Neues Projekt</span>
              </Link>

              {!isPending && (
                <>
                  {session?.user ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 border border-[#00FF9D]/40 px-3 py-2 rounded-xl">
                        <UserIcon className="size-5 text-[#00FF9D]" />
                        <span className="text-[#00FF9D] font-medium">
                          {session.user.name}
                        </span>
                      </div>

                      {/* 🔴 Neuer roter Logout-Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 border border-red-500/50 text-red-500 px-4 py-2 rounded-xl font-medium hover:bg-red-500/10 hover:border-red-500 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        aria-label="Ausloggen"
                      >
                        <LogOutIcon className="size-5" />
                        Logout
                      </button>

                      <Link
                        to="/settings"
                        className="flex items-center justify-center p-2 rounded-xl hover:bg-[#00FF9D]/10 transition"
                        aria-label="Einstellungen"
                      >
                        <SettingsIcon className="text-[#00FF9D] size-5" />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="border border-[#00FF9D]/40 text-[#00FF9D] px-4 py-2 rounded-xl font-medium hover:bg-[#00FF9D]/10 hover:border-[#00FF9D] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9D]"
                    >
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
