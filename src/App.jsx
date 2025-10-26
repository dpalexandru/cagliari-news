import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Loader from "./components/Loader";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [important, setImportant] = useState([]); // per adesso vuoto (futura richiesta al DB)
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recenti"); // "recenti" | "importanti"

  // tutte le mie fonti da rss pubbliche
  const FEEDS = [
    { name: "Calcio Casteddu", url: "https://www.calciocasteddu.it/feed/" },
    { name: "TuttoCagliari", url: "https://www.tuttocagliari.net/rss" },
    { name: "CagliariNews24", url: "https://www.cagliarinews24.com/feed/" },
  ];

  useEffect(() => {
    async function fetchAllFeeds() {
      try {
        const allItems = [];

        for (const feed of FEEDS) {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`;
          const res = await fetch(proxyUrl);
          const xmlText = await res.text();

          const parser = new DOMParser();
          const xml = parser.parseFromString(xmlText, "text/xml");
          const items = xml.querySelectorAll("item");

          const parsedArticles = Array.from(items).map((item) => {
            const title = item.querySelector("title")?.textContent || "";
            const link = item.querySelector("link")?.textContent || "";
            const pubDate = item.querySelector("pubDate")?.textContent || "";
            const description = item.querySelector("description")?.textContent || "";
            const enclosure = item.querySelector("enclosure")?.getAttribute("url") || null;
            const media = item.querySelector("media\\:content")?.getAttribute("url") || null;
            const image = enclosure || media || "/solocagliari.png";

            return { title, link, pubDate, description, image, source: feed.name };
          });

          allItems.push(...parsedArticles);
        }

        let sorted = allItems
          .filter((a) => a.title && a.link)
          .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        const seen = new Set();
        sorted = sorted.filter((a) => {
          const key = (a.link || a.title).trim();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setArticles(sorted.slice(0, 30));
      } catch (err) {
        console.error("Errore nel caricamento dei feed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllFeeds();
  }, []);

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

                  {/* Loader */}
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
