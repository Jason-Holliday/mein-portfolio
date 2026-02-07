import { Github } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="w-full flex items-center justify-center bg-primary text-textPrimary py-24"
    >
      <div className="mx-auto max-w-screen-2xl px-8 py-6 grid grid-cols-1 md:grid-cols-2 items-center gap-16 md:gap-20 lg:gap-28">

        {/* Text */}
        <div className="space-y-6 md:space-y-8">
          <h1 className="flex flex-col text-xl font-semibold text-textSecondary">
            Hallo, ich bin
            <span className="font-mont text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
              Jason Holliday
            </span>
          </h1>

          <p className="leading-relaxed text-gray-300">
            Ich arbeite derzeit als Softwaretester und verfüge über zwei Jahre praktische Erfahrung, wobei mein Schwerpunkt auf Barrierefreiheit liegt. 
            Ich habe fundierte Kenntnisse in HTML5, CSS3, JavaScript sowie in den Frameworks Angular und React.
            Ich bin zielstrebig, lernbereit und teamorientiert und strebe danach, mich kontinuierlich fachlich und persönlich weiterzuentwickeln.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="https://github.com/Jason-Holliday?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/80 text-white transition-all duration-200 shadow-lg"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">GitHub</span>
            </Link>

            <button
              onClick={scrollToProjects}
              className="px-6 py-3 rounded-xl border-2 border-accent text-accent hover:bg-accent/10 transition-all duration-200"
            >
              Meine Projekte
            </button>
          </div>
        </div>

        {/* Bild */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/Bewerbungsfoto.jpeg"
            alt="Jason Holliday"
            className="w-72 md:w-80 lg:w-96 h-80 md:h-96 lg:h-[32rem] object-cover rounded-2xl shadow-xl ring-4 ring-accent"
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
