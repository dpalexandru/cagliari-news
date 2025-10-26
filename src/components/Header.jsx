export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-red-700 to-blue-900 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center">
        <div className="text-center leading-tight">
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-blue-500 to-red-500 text-transparent bg-clip-text drop-shadow-md">
            Solo Cagliari
          </h1>
          <p className="text-white text-lg sm:text-xl font-semibold tracking-wide mt-1 drop-shadow">
            Ultime notizie sul Cagliari Calcio
          </p>
        </div>
      </div>
    </header>
  );
}
