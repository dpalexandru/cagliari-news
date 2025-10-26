// src/utils/rss.js

// AllOrigins per CORS: sostituisci se usi un tuo proxy
export const proxify = (url) =>
  `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

export async function fetchXML(url) {
  const res = await fetch(proxify(url));
  if (!res.ok) throw new Error(`Fetch fallita: ${url} (${res.status})`);
  const text = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");
  // opzionale: basic error check
  const parserError = xml.querySelector("parsererror");
  if (parserError) {
    throw new Error(`XML malformato da: ${url}`);
  }
  return xml;
}

/**
 * Parsifica RSS (item) o Atom (entry) in un array uniforme
 * Raccoglie anche le categorie e applica fallback immagine se assente.
 */
export function parseArticlesFromFeed(xml, sourceName, fallbackImage = "/solocagliari.png") {
  const items = xml.querySelectorAll("item");
  if (items.length === 0) {
    // Atom
    const entries = xml.querySelectorAll("entry");
    return Array.from(entries).map((entry) => {
      const title = entry.querySelector("title")?.textContent?.trim() || "";
      const link = entry.querySelector("link")?.getAttribute("href") || "";
      const pubDate =
        entry.querySelector("updated")?.textContent?.trim() ||
        entry.querySelector("published")?.textContent?.trim() ||
        "";
      const summary =
        entry.querySelector("summary")?.textContent?.trim() ||
        entry.querySelector("content")?.textContent?.trim() ||
        "";

      // immagini in Atom
      const media = entry.querySelector("media\\:content")?.getAttribute("url") || null;
      const enclosure = entry.querySelector("link[rel='enclosure']")?.getAttribute("href") || null;
      const image = enclosure || media || fallbackImage;

      // categories (Atom: <category term="...">)
      const categories = Array.from(entry.querySelectorAll("category"))
        .map((c) => c.getAttribute("term")?.trim())
        .filter(Boolean);

      return { title, link, pubDate, description: summary, image, source: sourceName, categories };
    });
  }

  // RSS classico
  return Array.from(items).map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() || "";
    const link = item.querySelector("link")?.textContent?.trim() || "";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() || "";
    const description = item.querySelector("description")?.textContent?.trim() || "";

    // immagini in RSS
    const enclosure = item.querySelector("enclosure")?.getAttribute("url") || null;
    const media = item.querySelector("media\\:content")?.getAttribute("url") || null;
    const image = enclosure || media || fallbackImage;

    // categories (RSS: <category>Testo</category>)
    const categories = Array.from(item.querySelectorAll("category"))
      .map((c) => c.textContent?.trim())
      .filter(Boolean);

    return { title, link, pubDate, description, image, source: sourceName, categories };
  });
}
