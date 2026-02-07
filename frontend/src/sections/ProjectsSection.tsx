import { useEffect, useState } from "react";
import DisplayProjectCard from "../components/DisplayProjectCard";
import api from "../lib/axios";
import toast from "react-hot-toast";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  gitHubUrl: string;
  liveDemoUrl: string;
  imgUrl: string;
  createdAt: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage] = useState(1); // setCurrentPage entfernt
  const projectsPerPage = 6;

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get<Project[]>("/projects/public");
        setProjects(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Projekte konnten nicht geladen werden");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  return (
    <section
      id="projects"
      className="w-full flex flex-col justify-center mx-auto max-w-screen-2xl px-8 bg-primary text-textPrimary py-20"
    >
      <div className="w-full">
        <h1 className="text-center mb-8 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
          Meine Projekte
        </h1>

        {loading ? (
          <div className="text-center py-10 text-textSecondary">Lade Projekte...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-10 text-textSecondary">Keine Projekte gefunden.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <DisplayProjectCard key={project._id} project={project} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {/* Pagination */}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsPage;