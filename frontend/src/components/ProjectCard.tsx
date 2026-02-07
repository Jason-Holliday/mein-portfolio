import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

interface Project {
    _id?: string;
    title: string;
    description: string;
    techStack: string[];
    gitHubUrl: string;
    liveDemoUrl: string;
    imgUrl: string;
    publicId?: string;
    createdAt?: string;
}

interface ProjectCardProps {
    project: Project;
    onDelete?: (id: string) => void;
}

const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
    const navigate = useNavigate();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!project._id) return;

        const confirmDelete = window.confirm(
            "Bist du sicher, dass du dieses Projekt löschen möchtest?"
        );
        if (!confirmDelete) return;

        try {
            await api.delete(`/projects/${project._id}`);
            toast.success("Projekt erfolgreich gelöscht!");
            if (onDelete) onDelete(project._id);
            navigate("/admin");
        } catch (error) {
            console.error("Fehler beim Löschen des Projekts:", error);
            toast.error("Projekt konnte nicht gelöscht werden");
        }
    };

    return (
        <div className="w-160 flex-none border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all bg-white">

            {project.imgUrl ? (
                <img
                    src={project.imgUrl}
                    alt={project.title}
                    className="w-full h-48 md:h-64 lg:h-72 object-cover"
                    loading="lazy"
                />

            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    Kein Bild
                </div>
            )}

            <div className="p-4">
                <h2 className="text-xl font-semibold mb-1 text-gray-900">
                    {project.title || "Ohne Titel"}
                </h2>
                <p className="text-gray-600 mb-3 line-clamp-2">
                    {project.description || "Keine Beschreibung vorhanden."}
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                    {project.techStack && project.techStack.length > 0 ? (
                        project.techStack.map((tech, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                            >
                                {tech}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400">Keine Techs</span>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
                <Link
                    to={`/project/${project._id}`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                    <PenSquareIcon size={18} />
                    Bearbeiten
                </Link>

                <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800"
                >
                    <Trash2Icon size={18} />
                    Löschen
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
