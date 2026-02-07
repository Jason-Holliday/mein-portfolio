import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Menu, X } from "lucide-react";
import { API_URL } from "../lib/config";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // State für Kontaktformular
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | boolean>(null);
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  // Formular-Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      name: contactName.trim() === "" ? "Name ist erforderlich" : "",
      email:
        !contactEmail.includes("@") || contactEmail.trim() === ""
          ? "Gebe eine gültige E-Mail ein"
          : "",
      message:
        contactMessage.trim() === "" ? "Eine Nachricht ist erforderlich" : "",
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.message) {
      return;
    }

    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setContactName("");
        setContactEmail("");
        setContactMessage("");
        setErrors({ name: "", email: "", message: "" });
      } else {
        setSuccess(false);

        const data = await res.json();
        setErrors({
          ...newErrors,
          message: data.error || "Fehler beim Senden",
        });
      }
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setErrors({
        ...newErrors,
        message: "Netzwerkfehler - Bitte später versuchen",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-primary border-b border-secondary">
        <div className="mx-auto max-w-screen-2xl px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
            aria-label="Zur Startseite"
          >
            <img src="/Only Logo.png" alt="Logo" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-white font-mont tracking-tighter hover:text-accent/80 transition-colors">
              Jason Holliday
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-textSecondary absolute left-1/2 -translate-x-1/2">
            <a href="#home" className="hover:text-accent transition-colors">
              Startseite
            </a>
            <a href="#about" className="hover:text-accent transition-colors">
              Über mich
            </a>
            <a
              href="#technologies"
              className="hover:text-accent transition-colors"
            >
              Technologien
            </a>
            <a href="#projects" className="hover:text-accent transition-colors">
              Projekte
            </a>
          </nav>

          {/* Kontakt Button */}
          <button
            onClick={() => setShowContactModal(true)}
            className="hidden md:flex items-center gap-2 bg-accent text-white font-semibold px-5 py-2 rounded-lg hover:bg-accent/90 transition-colors shadow-md shadow-accent/30"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            <span>Kontakt</span>
          </button>

          {/* Hamburger Icon */}
          <button
            className="md:hidden flex items-center text-textSecondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-primary border-t border-secondary text-textPrimary flex flex-col items-center gap-4 py-4">
            <a
              href="#home"
              className="hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Startseite
            </a>
            <a
              href="#about"
              className="hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Über Mich
            </a>
            <a
              href="#technologies"
              className="hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Technologien
            </a>
            <a
              href="#projects"
              className="hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Projekte
            </a>

            <button
              className="flex items-center gap-2 bg-accent text-white font-semibold px-5 py-2 rounded-lg hover:bg-accent/90 transition-colors shadow-md shadow-accent/30"
              onClick={() => {
                setIsOpen(false);
                setShowContactModal(true);
              }}
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              <span>Kontakt</span>
            </button>
          </div>
        )}
      </header>

      {/* Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-[#101018] border border-[#2a2a3c] rounded-xl p-8 w-[90%] max-w-md relative shadow-xl text-white">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">Kontakt</h2>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="w-full bg-[#161622] border border-[#2a2a3c] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b7cf7]"
                />
                {errors.name && (
                  <p
                    id="name-error"
                    className="text-red-400 text-sm mt-1"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="E-Mail"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full bg-[#161622] border border-[#2a2a3c] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b7cf7]"
                />
                {errors.email && (
                  <p
                    id="name-error"
                    className="text-red-400 text-sm mt-1"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  placeholder="Nachricht"
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                  className="w-full bg-[#161622] border border-[#2a2a3c] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b7cf7]"
                />
                {errors.message && (
                  <p
                    id="name-error"
                    className="text-red-400 text-sm mt-1"
                    role="alert"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5b7cf7] font-semibold py-2 rounded-lg hover:bg-[#4a68d8] transition shadow-md"
              >
                {loading ? "Senden..." : "Senden"}
              </button>
            </form>

            {success === true && (
              <p className="mt-2 text-green-400 text-center">
                Nachricht gesendet!
              </p>
            )}
            {success === false && (
              <p className="mt-2 text-red-400 text-center">
                Fehler beim Senden.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
