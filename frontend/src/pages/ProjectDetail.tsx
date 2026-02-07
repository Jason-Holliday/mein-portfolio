import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";

interface Project {
  title: string;
  description: string;
  techStack: string[];
  gitHubUrl: string;
  liveDemoUrl: string;
  imgUrl: string;
}

const technologiesList = [
  "React", "TypeScript", "Tailwind", "Node.js", "MongoDB",
  "Angular", "Vue.js", "Next.js", "C#", "Express",
  "Python", "Django", "Laravel", "PHP", "PostgreSQL",
  "MySQL", "Firebase",
];

const ProjectDetail = () => {
  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
    techStack: [],
    gitHubUrl: "",
    liveDemoUrl: "",
    imgUrl: "",
  });

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [gitHubUrl, setGitHubUrl] = useState<string>("");
  const [liveDemoUrl, setLiveDemoUrl] = useState<string>("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleCheckboxChange = (tech: string) => {
    setTechStack(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    document.title = "Project-Management || Project-Details";

    const getProject = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get<Project>(`/projects/${id}`);
        setProject(res.data);

        // Setze die Inputs auf die geladenen Werte
        setTitle(res.data.title || "");
        setDescription(res.data.description || "");
        setGitHubUrl(res.data.gitHubUrl || "");
        setLiveDemoUrl(res.data.liveDemoUrl || "");
        setTechStack(res.data.techStack || []);
      } catch (error) {
        console.error("Error fetching project:", error);
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          toast.error("Zu viele Anfragen. Bitte später erneut versuchen.");
        } else {
          toast.error("Projekt konnte nicht geladen werden");
        }
      } finally {
        setLoading(false);
      }
    };

    getProject();

    // Cleanup preview URL
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Bist du sicher, dass du dieses Projekt löschen möchtest?")) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success("Projekt erfolgreich gelöscht.");
      navigate("/");
    } catch (error) {
      console.error("Löschen des Projekts fehlgeschlagen", error);
      toast.error("Projekt konnte nicht gelöscht werden");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !gitHubUrl || !liveDemoUrl || !techStack.length) {
      toast.error("Bitte alle Pflichtfelder ausfüllen!");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("gitHubUrl", gitHubUrl);
      formData.append("liveDemoUrl", liveDemoUrl);
      
      // TechStack als einzelne Werte mit [] anhängen (wie im Backend erwartet)
      techStack.forEach(tech => formData.append("techStack[]", tech));
    
      // Bild mit dem richtigen Feldnamen "image" (entspricht Multer: upload.single("image"))
      if (file) formData.append("image", file);

      await api.put(`/projects/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Projekt erfolgreich aktualisiert!");
      
      // Projekt-Daten neu laden, um aktualisierte imgUrl zu bekommen
      const res = await api.get<Project>(`/projects/${id}`);
      setProject(res.data);
      
      // File und Preview zurücksetzen
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Projekts:", error);
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        toast.error("Zu viele Anfragen. Bitte später erneut versuchen.");
      } else {
        toast.error("Projekt konnte nicht aktualisiert werden");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-screen-xl px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-[#00FF9D] hover:text-[#00e08a] transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" /> Zur Admin-Übersicht
            </Link>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors"
            >
              <Trash2Icon className="h-5 w-5" /> Projekt löschen
            </button>
          </div>

          {loading ? (
            <div className="bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800 p-8 text-center">
              <p className="text-gray-400">Lade Projekt...</p>
            </div>
          ) : (
            <div className="bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800">
              <div className="p-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Titel */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Titel:*</label>
                    <input
                      type="text"
                      placeholder="Titel"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="shadow-sm border border-gray-700 rounded-lg w-full py-2 px-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Beschreibung */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Beschreibung:*</label>
                    <textarea
                      placeholder="Beschreibung"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                      className="shadow-sm border border-gray-700 rounded-lg w-full py-2 px-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">GitHub URL:*</label>
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={gitHubUrl}
                      onChange={e => setGitHubUrl(e.target.value)}
                      className="shadow-sm border border-gray-700 rounded-lg w-full py-2 px-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Live Demo URL */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Live Demo URL:*</label>
                    <input
                      type="text"
                      placeholder="Live Demo URL"
                      value={liveDemoUrl}
                      onChange={e => setLiveDemoUrl(e.target.value)}
                      className="shadow-sm border border-gray-700 rounded-lg w-full py-2 px-3 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Tech Stack:*</label>
                    <div className="grid grid-cols-3 gap-2">
                      {technologiesList.map((tech) => (
                        <div key={tech} className="flex items-center">
                          <input
                            id={`tech-${tech}`}
                            type="checkbox"
                            value={tech}
                            checked={techStack.includes(tech)}
                            onChange={() => handleCheckboxChange(tech)}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`tech-${tech}`}
                            className="ms-2 text-sm font-medium text-white"
                          >
                            {tech}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aktuelles Bild anzeigen (nur wenn kein neues Preview vorhanden) */}
                  {project.imgUrl && !preview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Aktuelles Bild:</p>
                      <img
                        src={project.imgUrl}
                        alt={project.title}
                        className="w-full max-w-sm rounded-lg border border-gray-700 shadow-md"
                      />
                    </div>
                  )}

                  {/* Bild hochladen */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      {project.imgUrl ? "Neues Bild hochladen (optional):" : "Bild hochladen:*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-white border border-gray-700 rounded-lg p-2 bg-neutral-800"
                    />
                  </div>

                  {/* Vorschau des neuen Bilds */}
                  {preview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Neue Vorschau:</p>
                      <img
                        src={preview}
                        alt="Neue Vorschau"
                        className="w-full max-w-sm rounded-lg border border-gray-700 shadow-md"
                      />
                    </div>
                  )}

                  <div className="flex flex-col space-y-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 rounded-xl bg-[#00FF9D] text-black font-semibold hover:bg-[#00e08a] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {saving ? "Speichern..." : "Projekt aktualisieren"}
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-70"
                      onClick={() => navigate("/admin")}
                    >
                      Abbrechen
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;