export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Testo sinistra */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-800">
            Solo Cagliari
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Ultime notizie, risultati e aggiornamenti dal mondo rossoblù.
          </p>
        </div>

        {/* Link centrali o social */}
        <div className="flex gap-5 text-gray-500">
          <a
            href="#"
            className="hover:text-gray-800 transition-colors duration-200"
            aria-label="Instagram"
          >
            <i className="fa-brands fa-instagram text-xl"></i>
          </a>
          <a
            href="#"
            className="hover:text-gray-800 transition-colors duration-200"
            aria-label="Facebook"
          >
            <i className="fa-brands fa-facebook text-xl"></i>
          </a>
          <a
            href="#"
            className="hover:text-gray-800 transition-colors duration-200"
            aria-label="Twitter"
          >
            <i className="fa-brands fa-x-twitter text-xl"></i>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400 text-center sm:text-right">
          © {new Date().getFullYear()} Solo Cagliari — progetto indipendente
        </p>
      </div>
    </footer>
  );
}
