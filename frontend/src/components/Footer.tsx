const Footer = () => {
  return (
    <footer className="w-full bg-primary border-t border-secondary/50">
      <div className="mx-auto max-w-screen-2xl px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-textSecondary text-sm">

        {/* Links: Copyright */}
        <p className="mb-3 sm:mb-0">
          &copy; {new Date().getFullYear()} Jason Holliday. Alle Rechte vorbehalten.
        </p>

        {/* Mitte: Impressum / Datenschutz */}
        <div className="flex space-x-6 mb-3 sm:mb-0">
          <a
            href="/impressum"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            Impressum
          </a>

          <a
            href="/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            Datenschutz
          </a>
        </div>


        {/* Rechts: Social Links */}
        <div className="flex space-x-6">
          <a
            href="https://www.linkedin.com/feed/?trk=guest_homepage-basic_nav-header-signin"
            className="hover:text-accent transition-colors"
            aria-label="LinkedIn"
            target="_blank"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Jason-Holliday?tab=repositories"
            className="hover:text-accent transition-colors"
            aria-label="GitHub"
            target="_blank"
          >
            GitHub
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
