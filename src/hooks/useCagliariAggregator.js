// src/hooks/useCagliariAggregator.js
import { useEffect, useState } from "react";
import { fetchXML, parseArticlesFromFeed } from "../utils/rss";

// FEED UNICO di L'Unione Sarda (tutto il sito)
const US_RSS_FEED = "https://www.unionesarda.it/sitemaps/rss";

// keyword in lower-case per match su titolo/descrizione/link
const CAGLIARI_KEYWORDS = [
  " cagliari ",        // con spazi per ridurre falsi positivi
  " cagliari calcio ",
  " casteddu ",
  " rossoblù ",
  " rossoblu ",
  " unipol domus ",
  // match semplici senza spazi (per sicurezza)
  "cagliari", "cagliari calcio", "casteddu", "rossoblù", "rossoblu", "unipol domus"
];

// util minimi
function lc(str) { return (str || "").toLowerCase(); }
function hasKeyword(hay) { return CAGLIARI_KEYWORDS.some(k => hay.includes(k)); }
function isFromUnioneSarda(href = "") {
  try { return new URL(href).hostname.endsWith("unionesarda.it"); } catch { return false; }
}
function pathname(href = "") {
  try { return new URL(href).pathname.toLowerCase(); } catch { return ""; }
}

// criterio: articoli US sul Cagliari
function matchesCagliariUS(a) {
  const t = lc(a.title);
  const d = lc(a.description);
  const l = lc(a.link);
  const p = pathname(a.link);
  const cats = (a.categories || []).map(lc);

  // se è su US e nel link appare "cagliari" in qualunque parte del path
  if (isFromUnioneSarda(a.link) && p.includes("cagliari")) return true;

  // se titolo/descrizione contengono keyword
  if (hasKeyword(`${t} ${d}`)) return true;

  // se categoria è "calcio" ma titolo contiene cagliari
  if (cats.some(c => c.includes("calcio")) && t.includes("cagliari")) return true;

  return false;
}

export function useCagliariAggregator(
  FEEDS,
  { includeUnioneSarda = true, limit = 30 } = {}
) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) FEED BASE (Calcio Casteddu, TuttoCagliari, CagliariNews24)
        const baseChunks = await Promise.allSettled(
          FEEDS.map(async (f) => {
            const xml = await fetchXML(f.url);
            return parseArticlesFromFeed(xml, f.name);
          })
        );
        const baseItems = baseChunks
          .filter(c => c.status === "fulfilled")
          .flatMap(c => c.value);

        // 2) L'UNIONE SARDA (feed unico)
        let usItems = [];
        if (includeUnioneSarda) {
          try {
            const usXml = await fetchXML(US_RSS_FEED);
            const usAll = parseArticlesFromFeed(usXml, "L'Unione Sarda");
            usItems = usAll.filter(matchesCagliariUS);
          } catch (e) {
            // se il feed US fallisce, continuiamo con i base
            console.warn("[US] RSS fetch/parse error:", e);
          }
        }

        // 3) MERGE + SORT + DEDUP
        const all = [...baseItems, ...usItems]
          .filter(a => a.title && a.link)
          .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        const seen = new Set();
        const dedup = all.filter(a => {
          const key = (a.link || a.title).trim();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        if (!alive) return;
        setArticles(dedup.slice(0, limit));
      } catch (e) {
        if (!alive) return;
        setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [JSON.stringify(FEEDS), includeUnioneSarda, limit]);

  return { articles, loading, error };
}
