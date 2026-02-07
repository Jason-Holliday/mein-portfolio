import { Link } from "react-router-dom";

const ImpressumPage = () => {
    return (
        <section className="w-full min-h-screen bg-neutral-900 text-neutral-300">
            <div className="mx-auto max-w-screen-md px-8 py-16 space-y-8">
                <div>
                    <Link
                        to="/"
                        className="inline-block mt-6 px-4 py-2 bg-accent text-white font-semibold rounded hover:bg-accent/80 transition"
                    >
                        Zur Startseite
                    </Link>
                </div>
                <h1 className="text-4xl font-bold text-white">Impressum</h1>

                <div className="space-y-1 leading-relaxed">
                    <p className="font-semibold text-lg text-white">Angaben gemäß § 5 TMG</p>
                    <p>
                        Jason Holliday<br />
                        Mathildenstraße 38A<br />
                        90762 Fürth
                    </p>
                </div>

                <div className="space-y-1 leading-relaxed">
                    <h2 className="text-2xl font-semibold text-white">Kontakt</h2>
                    <p>
                        Telefon: +49 (0) 176 225 892 70<br />
                        E-Mail:{" "}
                        <a
                            href="mailto:jason@jasonholliday.de"
                            className="text-accent hover:underline"
                        >
                            jason@jasonholliday.de
                        </a>
                    </p>
                </div>

                <p className="text-sm">
                    Quelle:{" "}
                    <a
                        href="https://www.e-recht24.de/impressum-generator.html"
                        className="text-accent hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        e-recht24.de Impressum Generator
                    </a>
                </p>


            </div>
        </section>
    );
};

export default ImpressumPage;
