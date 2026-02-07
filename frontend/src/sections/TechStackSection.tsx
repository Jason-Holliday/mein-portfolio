const techStack = [
    { name: "HTML5", icon: "/techstack/html-5.png" },
    { name: "CSS3", icon: "/techstack/css-3.png" },
    { name: "Javascript", icon: "/techstack/js.png" },
    { name: "TypeScript", icon: "/techstack/typescript.png" },
    { name: "React", icon: "/techstack/atom.png" },
    { name: "MongoDB", icon: "/techstack/Mongodb-svgrepo-com.svg" },
    { name: "GitHub", icon: "/techstack/github.png" },
    { name: "Node.js", icon: "/techstack/javascript-nodejs-logo-27.png" },
    { name: "Better Auth", icon: "/techstack/better-auth-logo-light.png" },
];

const TechStackSection = () => {
    return (
        <section id="technologies" className="w-full flex items-center justify-center bg-primary py-20">
            <div className="mx-auto max-w-screen-2xl px-8 text-center">

                <h3 className="mb-12 text-4xl font-extrabold tracking-tight text-white">
                    Tech Stack
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
                    {techStack.map((tech) => (
                        <div
                            key={tech.name}
                            className="
                                flex flex-col items-center justify-center gap-3
                                w-32 h-32
                                rounded-xl bg-secondary/60
                                border border-secondary/30
                                transition-all duration-300
                                hover:border-accent hover:bg-accent/10 hover:scale-[1.04]
                            "
                        >
                            <img
                                src={tech.icon}
                                alt={tech.name}
                                className="w-12 h-12 object-contain opacity-90"
                            />
                            <span className="text-textSecondary text-sm font-medium">{tech.name}</span>
                        </div>

                    ))}
                </div>

            </div>
        </section>
    );
};

export default TechStackSection;
