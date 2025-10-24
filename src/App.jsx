import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

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

            // tenta immagini base da enclosure/media:content
            const enclosure = item.querySelector("enclosure")?.getAttribute("url") || null;
            const media = item.querySelector("media\\:content")?.getAttribute("url") || null;
            const image = enclosure || media || null;

            return { title, link, pubDate, description, image, source: feed.name };
          });

          allItems.push(...parsedArticles);
        }

        // ordina per data decrescente
        let sorted = allItems
          .filter(a => a.title && a.link)
          .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        // dedup per link
        const seen = new Set();
        sorted = sorted.filter(a => {
          const key = (a.link || a.title).trim();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // limita a 30 articoli
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

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && articles.length === 0 && (
            <p className="text-center text-gray-600">Nessuna notizia trovata.</p>
          )}

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((item, index) => (
              <li
                key={index}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}

                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-2">
                    🗞️ {item.source} •{" "}
                    {item.pubDate
                      ? new Date(item.pubDate).toLocaleString("it-IT")
                      : "Data sconosciuta"}
                  </div>
                  <h2 className="font-semibold leading-snug mb-2 line-clamp-2">
                    {item.title}
                  </h2>
                  <p
                    className="text-sm text-gray-700 line-clamp-3 mb-3"
                    dangerouslySetInnerHTML={{
                      __html: (item.description || "").slice(0, 260) + "...",
                    }}
                  />
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-rossoblu-700 hover:underline font-medium"
                  >
                    Leggi l’articolo originale →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
