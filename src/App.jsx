// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Loader from "./components/Loader";

// Adapter: converte un item dell'API backend nel formato atteso dalla Card
function adaptApiItem(it) {
  return {
    id: it.id,
    title: it.title,
    link: it.canonical_url,     // link all’articolo originale 
    image: it.image_url || null,
    excerpt: it.excerpt || "",
    date: it.published_at || it.created_at,
    // opzionale: source se in futuro aggiungi /sources o join lato API
    source: it.source || null,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState("recenti"); // "recenti" | "importanti"
  const [apiItems, setApiItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Per ora non usiamo gli "importanti"
  const important = [];

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
  const PAGE = 1;
  const LIMIT = 30;
  const QUERY = ""; // se vuoi filtrare: es. "Cagliari"

  useEffect(() => {
    const ctrl = new AbortController();

    async function fetchArticles() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(PAGE),
          limit: String(LIMIT),
          ...(QUERY ? { q: QUERY } : {}),
        });

        const res = await fetch(`${API_BASE}/api/articles?` + params.toString(), {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const adapted = Array.isArray(data.items) ? data.items.map(adaptApiItem) : [];
        setApiItems(adapted);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError("Errore nel caricamento delle notizie.");
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
    return () => ctrl.abort();
  }, [API_BASE]); // se cambi base URL, ricarica

  // Manteniamo il contatore a destra
  const counterLabel = useMemo(() => {
    if (activeTab === "recenti") return loading ? "Caricamento…" : `${apiItems.length} articoli`;
    return `${important.length} salvate`;
  }, [activeTab, loading, apiItems.length, important.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Barra tab */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-end gap-2 pt-3">

            {/* Recenti */}
            <button
              onClick={() => setActiveTab("recenti")}
              className={`flex-1 text-center px-4 py-2 font-semibold rounded-t-lg transition
                ${activeTab === "recenti"
                  ? "bg-white text-black border border-gray-300 border-b-0 shadow-sm"
                  : "text-gray-600 hover:text-black bg-gray-50"
                }`}
              aria-selected={activeTab === "recenti"}
              role="tab"
            >
              Recenti
            </button>

            {/* Importanti (disattivata per ora, ma lasciata per coerenza grafica) */}
            <button
              onClick={() => setActiveTab("importanti")}
              disabled
              title="In arrivo"
              className={`flex-1 text-center px-4 py-2 font-semibold rounded-t-lg transition cursor-not-allowed
                ${activeTab === "importanti"
                  ? "bg-white text-black border border-gray-300 border-b-0 shadow-sm"
                  : "text-gray-400 bg-gray-50"
                }`}
              aria-selected={activeTab === "importanti"}
              role="tab"
            >
              Importanti
            </button>

            {/* Contatore a destra */}
            <span className="hidden sm:block ml-auto text-xs sm:text-sm text-gray-500 pb-2">
              {counterLabel}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="rounded-b-lg rounded-t-lg border border-gray-300 shadow-sm">
            <div className="p-4 sm:p-6">
              {activeTab === "recenti" && (
                <section aria-labelledby="recenti-title">
                  <h2 id="recenti-title" className="sr-only">Recenti</h2>

                  {error && (
                    <p className="mb-3 text-sm text-red-600">
                      {error} Riprova più tardi.
                    </p>
                  )}

                  {loading ? (
                    <Loader label="Carico le notizie…" />
                  ) : apiItems.length === 0 ? (
                    <p className="text-center text-gray-600">Nessuna notizia trovata.</p>
                  ) : (
                    <Card articles={apiItems} />
                  )}
                </section>
              )}

              {activeTab === "importanti" && (
                <section aria-labelledby="importanti-title">
                  <h2 id="importanti-title" className="sr-only">Importanti</h2>
                  <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                    <p className="text-gray-600">Funzione in arrivo.</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Aggiungeremo il tasto “IMPORTANTE” per salvare le notizie qui.
                    </p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
