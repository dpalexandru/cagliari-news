import { useEffect, useState } from "react";

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

          const parsedArticles = Array.from(items).map((item) => ({
            title: item.querySelector("title")?.textContent || "",
            link: item.querySelector("link")?.textContent || "",
            pubDate: item.querySelector("pubDate")?.textContent || "",
            description: item.querySelector("description")?.textContent || "",
            source: feed.name,
          }));

          allItems.push(...parsedArticles);
        }

        // Ordina per data (più recente prima)
        const sorted = allItems.sort(
          (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );

        setArticles(sorted);
      } catch (err) {
        console.error("Errore nel caricamento dei feed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllFeeds();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        ⚽ Ultime Notizie sul Cagliari
      </h1>

      {loading && <p>Caricamento notizie...</p>}
      {!loading && articles.length === 0 && <p>Nessuna notizia trovata.</p>}

      {articles.map((item, index) => (
        <div
          key={index}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "16px 0",
          }}
        >
          <h2 style={{ marginBottom: 8 }}>{item.title}</h2>
          <p style={{ color: "#777", fontSize: 14 }}>
            🗞️ {item.source} —{" "}
            {item.pubDate
              ? new Date(item.pubDate).toLocaleString("it-IT")
              : "Data sconosciuta"}
          </p>
          <p
            style={{ color: "#333", lineHeight: "1.5" }}
            dangerouslySetInnerHTML={{
              __html: item.description.slice(0, 250) + "...",
            }}
          />
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0056b3",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Leggi l’articolo originale →
          </a>
        </div>
      ))}
    </div>
  );
}
