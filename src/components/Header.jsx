export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Cagliari News Hub
        </h1>
        <span className="ml-auto text-xs sm:text-sm text-gray-500">
          Aggregatore RSS • link alle fonti originali
        </span>
      </div>
    </header>
  );
}
