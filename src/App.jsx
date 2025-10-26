import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Loader from "./components/Loader";
import { useCagliariAggregator } from "./hooks/useCagliariAggregator";

export default function App() {
  const [important, setImportant] = useState([]); // per adesso vuoto (futura richiesta al DB)
  const [activeTab, setActiveTab] = useState("recenti"); // "recenti" | "importanti"

  // tutte le mie fonti da rss pubbliche
  const FEEDS = [
    { name: "Calcio Casteddu", url: "https://www.calciocasteddu.it/feed/" },
    { name: "TuttoCagliari", url: "https://www.tuttocagliari.net/rss" },
    { name: "CagliariNews24", url: "https://www.cagliarinews24.com/feed/" },
  ];

  // Hook aggregatore (Strada A)
  const { articles, loading, error } = useCagliariAggregator(FEEDS, {
    includeUnioneSarda: true, // attiva/disattiva L'Unione Sarda
    maxUSFeeds: 30,           // quanti feed dall’indice US analizzare
    limit: 30,                // quanti articoli finali mostrare
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Barra tab minimal bianco/nero (orizzontale anche su mobile) */}
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

            {/* Importanti */}
            <button
              onClick={() => setActiveTab("importanti")}
              className={`flex-1 text-center px-4 py-2 font-semibold rounded-t-lg transition
                ${activeTab === "importanti"
                  ? "bg-white text-black border border-gray-300 border-b-0 shadow-sm"
                  : "text-gray-600 hover:text-black bg-gray-50"
                }`}
              aria-selected={activeTab === "importanti"}
              role="tab"
            >
              Importanti
            </button>

            {/* Contatore a destra */}
            <span className="hidden sm:block ml-auto text-xs sm:text-sm text-gray-500 pb-2">
              {activeTab === "recenti"
                ? (loading ? "Caricamento…" : `${articles.length} articoli`)
                : `${important.length} salvate`}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Box contenuti “attaccato” alla linguetta attiva */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="rounded-b-lg rounded-t-lg border border-gray-300 shadow-sm">
            <div className="p-4 sm:p-6">
              {activeTab === "recenti" && (
                <section aria-labelledby="recenti-title">
                  <h2 id="recenti-title" className="sr-only">Recenti</h2>

                  {/* Error state (facoltativo) */}
                  {error && (
                    <p className="mb-3 text-sm text-red-600">
                      Errore nel caricamento delle notizie. Riprova più tardi.
                    </p>
                  )}

                  {/* Loader / Empty / List */}
                  {loading ? (
                    <Loader label="Carico le notizie…" />
                  ) : articles.length === 0 ? (
                    <p className="text-center text-gray-600">Nessuna notizia trovata.</p>
                  ) : (
                    <Card articles={articles} />
                  )}
                </section>
              )}

              {activeTab === "importanti" && (
                <section aria-labelledby="importanti-title">
                  <h2 id="importanti-title" className="sr-only">Importanti</h2>

                  {important.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                      <p className="text-gray-600">Nessuna notizia importante ancora.</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Più avanti aggiungeremo il tasto IMPORTANTE per salvare le notizie qui.
                      </p>
                    </div>
                  ) : (
                    <Card articles={important} />
                  )}
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
