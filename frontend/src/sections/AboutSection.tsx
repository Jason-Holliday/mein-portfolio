import {
  Bug,
  GraduationCap,
  FolderCheck,
  Sparkles,
  MapPin,
} from "lucide-react";

const items = [
  {
    title: "2 Jahre Erfahrung",
    desc: "Digitale Barrierefreiheit und manuelles Testen",
    icon: Bug,
  },
  {
    title: "3½ Jahre abgeschlossene Ausbildung",
    desc: "Fachinformatiker für Anwendungsentwicklung",
    icon: GraduationCap,
  },
  {
    title: "2 erfolgreiche Projekte",
    desc: "Von Planung bis Umsetzung abgeschlossen",
    icon: FolderCheck,
  },
  {
    title: "1½+ Jahre selbstständig",
    desc: "Nebenberuflich als Zauberkünstler tätig",
    icon: Sparkles,
  },
];

const AboutSection = () => {
  return (
    <section
      id="about"
      className="w-full flex items-center justify-center bg-primary text-textPrimary py-20"
    >
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
          {/* Textbereich */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-4xl font-bold leading-normal lg:text-left text-center">
                Über mich
              </h2>

              <div className="flex items-center gap-3">
                <MapPin
                  className="
                    w-10 h-10 p-2
                    bg-accent text-white rounded-lg
                    transform transition-transform duration-300
                    group-hover:rotate-12
                  "
                />

                <p className="text-base">90762 Fürth, Mathildenstraße 38A</p>
              </div>
              <div className="text-textSecondary text-base leading-relaxed lg:text-left text-center">
                <p>
                  Ich bin Jason Holliday, 31 Jahre alt, und habe meine
                  Ausbildung zum Fachinformatiker für Anwendungsentwicklung bei
                  der imbus AG erfolgreich abgeschlossen. Seitdem bilde ich mich
                  kontinuierlich in der Webentwicklung weiter und habe bereits
                  mehrere eigene Projekte umgesetzt.
                </p>
                <p>
                  So habe ich unter anderem eine Landingpage für meinen
                  Nebenberuf als Zauberkünstler erstellt sowie ein
                  Projektverwaltungs-Tool entwickelt, mit dem ich meine Projekte
                  schneller und übersichtlicher in meinem Portfolio präsentieren
                  kann.
                </p>
              </div>
            </div>

            <div></div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
            {items.map(({ title, desc, icon: Icon }, idx) => (
              <div
                key={idx}
                className="
                    group
                    relative p-5 rounded-xl
                    bg-secondary border border-secondary/40
                    transition-all duration-300
                    hover:border-accent hover:scale-[1.03]
                  "
              >
                <Icon
                  className="
                      absolute -top-8 right-4 w-12 h-12 p-2
                      bg-accent text-white rounded-lg
                      transform transition-transform duration-300
                      group-hover:rotate-12
                    "
                />
                <div>
                  <h3 className="text-l font-bold text-white">{title}</h3>
                  <p className="text-textSecondary text-base mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
