import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/AdminNavbar";
import RateLimitedUI from "../components/RateLimitedUI";
import { useSession } from "../lib/auth";
import api from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import ProjectCard from "../components/ProjectCard";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  gitHubUrl: string;
  liveDemoUrl: string;
  imgUrl: string;
  userId: string; 
  createdAt: string;
}

const Home = () => {
  const { data: session, isPending } = useSession(); 
  const navigate = useNavigate();
  const [isRateLimited, setRateLimited] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  // Prüfe ob User eingeloggt ist
  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    document.title = "Project-Management | Startseite";

    // Warte bis Session geladen ist
    if (isPending) return;

    const fetchProjects = async () => {
      try {
        const res = await api.get<Project[]>("/projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Fehler beim Laden der Projekte:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 429) {
            setRateLimited(true);
          } else if (error.response?.status === 401) {
            // Wenn nicht authentifiziert
            toast.error("Bitte melde dich an");
            navigate("/login");
          } else {
            toast.error("Projekte konnten nicht geladen werden");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isPending, navigate]);

  // Zeige Loading während Session lädt
  if (isPending) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center text-[#00FF9D]">Lädt...</div>
      </div>
    );
  }

  // Wenn nicht eingeloggt, nichts anzeigen 
  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-screen-2xl p-4 mt-6 min-h-[60vh]">
        {loading ? (
          <div className="text-center text-[#00FF9D] py-10">Lade Projekte...</div>
        ) : isRateLimited ? (
          <RateLimitedUI />
        ) : projects.length === 0 ? (
          <div className="text-center text-neutral-400 py-10">
            Keine Projekte gefunden.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={(id) =>
                  setProjects((prev) => prev.filter((p) => p._id !== id))
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Pagination */}
      {projects.length > projectsPerPage && (
        <nav
          className="flex items-center justify-center gap-x-2 mt-8 mb-8"
          aria-label="Pagination"
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-10 min-w-[40px] px-3 rounded-lg text-sm text-neutral-300 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1"
          >
            <svg
              className="shrink-0 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Zurück
          </button>

          {/* Seitenzahlen */}
          {Array.from({ length: Math.ceil(projects.length / projectsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`h-10 min-w-[40px] px-3 text-sm rounded-lg flex items-center justify-center ${
                currentPage === i + 1
                  ? "bg-[#00FF9D] text-black font-semibold"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(projects.length / projectsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(projects.length / projectsPerPage)}
            className="h-10 min-w-[40px] px-3 rounded-lg text-sm text-neutral-300 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 flex items-center justify-center gap-1"
          >
            Weiter
            <svg
              className="shrink-0 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
};

export default Home;