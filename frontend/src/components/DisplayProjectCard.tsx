import { Github, Link as LinkIcon, ArrowRight } from "lucide-react";

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
}

const DisplayProjectCard = ({ project }: ProjectCardProps) => {

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

                <h3 className="text-l font-semibold mb-1 text-gray-900">Mein Tech Stack:</h3>
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
                <a
                    href={project.gitHubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                >
                    <Github size={18} />
                    GitHub
                    <ArrowRight size={18}  />
                </a>

                <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:scale-105 transition-all duration-200"
                >
                    <LinkIcon size={18} />
                    Live
                    <ArrowRight size={18} />
                </a>
            </div>

        </div>
    );
};

export default DisplayProjectCard;
