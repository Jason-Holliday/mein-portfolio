import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { ArrowLeftIcon } from "lucide-react";
import { useSession } from "../lib/auth"; // ✅ Session Hook importieren

const technologiesList = [
  "React",
  "TypeScript",
  "Tailwind",
  "Node.js",
  "MongoDB",
  "Express",
  "Cloudinary",
  "nodemailer",
  "Angular",
  "Vue.js",
  "Next.js",
  "C#",
  "Python",
  "Django",
  "Laravel",
  "PHP",
  "PostgreSQL",
  "MySQL",
  "Firebase",
];

const CreateProject = () => {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gitHubUrl, setGitHubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    gitHubUrl: "",
    liveDemoUrl: "",
    techStack: "",
    file: "",
  });

  // ✅ Prüfe ob User eingeloggt ist
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Bitte melde dich an");
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  const handleCheckboxChange = (tech: string) => {
    setTechStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: title.trim() === "" ? "Titel ist erforderlich" : "",
      description:
        description.trim() === "" ? "Beschreibung ist erforderlich" : "",
      gitHubUrl:
        gitHubUrl.trim() === ""
          ? "GitHub URL ist erforderlich"
          : !gitHubUrl.includes("github.com")
            ? "Ungültige GitHub URL"
            : "",
      liveDemoUrl:
        liveDemoUrl.trim() === ""
          ? "Live Demo URL ist erforderlich"
          : !liveDemoUrl.startsWith("http")
            ? "URL muss mit http:// oder https:// beginnen"
            : "",
      techStack:
        techStack.length === 0
          ? "Mindestens eine Technologie erforderlich"
          : "",
      file: !file ? "Bitte ein Bild hochladen" : "",
    };

    setErrors(newErrors);

    if (
      newErrors.title ||
      newErrors.description ||
      newErrors.gitHubUrl ||
      newErrors.liveDemoUrl ||
      newErrors.techStack ||
      newErrors.file
    ) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("gitHubUrl", gitHubUrl);
      formData.append("liveDemoUrl", liveDemoUrl);
      techStack.forEach((tech) => formData.append("techStack[]", tech));
      if (file) formData.append("image", file);

      await api.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Projekt erfolgreich erstellt!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      toast.error("Projekt erstellen ist fehlgeschlagen!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Projekt-Management | Neues Projekt";

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ✅ Zeige Loading während Session lädt
  if (isPending) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-[#00FF9D]">Lädt...</div>
      </div>
    );
  }

  // ✅ Wenn nicht eingeloggt, nichts anzeigen (redirect läuft)
  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-10">
      <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 w-full max-w-4xl border border-neutral-800">
        <div>
          <Link
            to="/admin"
            className="flex items-center gap-2 text-[#00FF9D] hover:text-[#00FF9D]/80 transition-colors mb-6"
          >
            <ArrowLeftIcon className="size-5" />
            Zurück zur Admin-Startseite
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-white mb-6">
          Neues Projekt erstellen
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Titel */}
          <div>
            <label className="block text-neutral-300 text-sm font-semibold mb-2">
              Titel:*
            </label>
            <input
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: "" });
              }}
              className="shadow-sm border border-neutral-700 bg-neutral-800 rounded-lg w-full py-2 px-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
            />
            {errors.title && (
              <p
                id="name-error"
                className="text-red-400 text-sm mt-1"
                role="alert"
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Beschreibung */}
          <div>
            <label className="block text-neutral-300 text-sm font-semibold mb-2">
              Beschreibung:*
            </label>
            <textarea
              placeholder="Beschreibung"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: "" });
              }}
              className="shadow-sm border border-neutral-700 bg-neutral-800 rounded-lg w-full py-2 px-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
            />
            {errors.description && (
              <p
                id="name-error"
                className="text-red-400 text-sm mt-1"
                role="alert"
              >
                {errors.description}
              </p>
            )}
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-neutral-300 text-sm font-semibold mb-2">
              GitHub URL:*
            </label>
            <input
              type="text"
              placeholder="GitHub URL"
              value={gitHubUrl}
              onChange={(e) => {
                setGitHubUrl(e.target.value);
                setErrors({ ...errors, gitHubUrl: "" });
              }}
              className="shadow-sm border border-neutral-700 bg-neutral-800 rounded-lg w-full py-2 px-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
            />
            {errors.gitHubUrl && (
              <p
                id="name-error"
                className="text-red-400 text-sm mt-1"
                role="alert"
              >
                {errors.gitHubUrl}
              </p>
            )}
          </div>

          {/* Live Demo URL */}
          <div>
            <label className="block text-neutral-300 text-sm font-semibold mb-2">
              Live Demo URL:*
            </label>
            <input
              type="text"
              placeholder="Live Demo URL"
              value={liveDemoUrl}
              onChange={(e) => {
                setLiveDemoUrl(e.target.value);
                setErrors({ ...errors, liveDemoUrl: "" });
              }}
              className="shadow-sm border border-neutral-700 bg-neutral-800 rounded-lg w-full py-2 px-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
            />
            {errors.liveDemoUrl && (
              <p
                id="name-error"
                className="text-red-400 text-sm mt-1"
                role="alert"
              >
                {errors.liveDemoUrl}
              </p>
            )}
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-neutral-300 text-sm font-semibold mb-2">
              Tech Stack:*
            </label>
            <div className="grid grid-cols-4 gap-1">
              {technologiesList.map((tech) => (
                <div key={tech} className="flex items-center">
                  <input
                    id={`tech-${tech}`}
                    type="checkbox"
                    value={tech}
                    checked={techStack.includes(tech)}
                    onChange={(e) => {
                      handleCheckboxChange(e.target.value);
                      setErrors({ ...errors, techStack: "" });
                    }}
                    className="w-4 h-4 text-[#00FF9D] bg-neutral-800 border-neutral-600 rounded focus:ring-[#00FF9D]"
                  />
                  <label
                    htmlFor={`tech-${tech}`}
                    className="ms-2 text-sm font-medium text-neutral-300"
                  >
                    {tech}
                  </label>
                </div>
              ))}
            </div>
            {errors.techStack && (
              <p
                id="name-error"
                className="text-red-400 text-sm mt-1"
                role="alert"
              >
                {errors.techStack}
              </p>
            )}
          </div>

          {/* Bild-Feld mit Vorschau */}
          <div>
            <label className="block text-neutral-300 text-sm font-semibold mb-2">
              Bild:*
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleFileChange(e);
                setErrors({ ...errors, file: "" });
              }}
              className="block w-full text-neutral-300 border border-neutral-700 bg-neutral-800 rounded-lg p-2"
            />
            {preview && (
              <img
                src={preview}
                alt="Vorschau"
                className="mt-2 w-48 h-48 object-cover rounded-lg border border-neutral-700"
              />
            )}
            {errors.file && (
              <p
                id="name-error"
                className="text-red-400 text-sm mt-1"
                role="alert"
              >
                {errors.file}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF9D] text-black font-semibold py-2 rounded-lg hover:bg-[#00FF9D]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Erstellen..." : "Projekt erstellen"}
            </button>
            <button
              type="button"
              disabled={loading}
              className="w-full bg-neutral-800 text-neutral-300 py-2 rounded-lg hover:bg-neutral-700 transition disabled:opacity-50"
              onClick={() => navigate("/admin")}
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;