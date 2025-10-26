export default function Loader({ label = "Caricamento…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10" role="status" aria-live="polite">
      {/* Loader semplice per ora */}
      <svg className="h-6 w-6 animate-spin text-gray-900" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0114.32-4.906l-1.664 1.11A6 6 0 006 12H4z" />
      </svg>

      <span className="text-sm font-medium text-gray-800">{label}</span>
    </div>
  );
}
