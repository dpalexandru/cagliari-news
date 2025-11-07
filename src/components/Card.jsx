import React from "react";

const Card = ({ articles }) => {
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((item, index) => (
        <li
          key={index}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Immagine o fallback */}
          {item.image ? (
            <img
              src={item.image}
              alt={item.title || "Immagine articolo"}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}

          {/* Contenuto testo */}
          <div className="p-4">
            {/* Fonte + Data */}
            <div className="text-xs text-gray-500 mb-2">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                Fonte:
              </span>{" "}
              {item.source || "Cagliari News"} •{" "}
              {item.date
                ? new Date(item.date).toLocaleString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "Data sconosciuta"}
            </div>

            {/* Titolo */}
            <h2 className="font-semibold leading-snug mb-2 line-clamp-2">
              {item.title}
            </h2>

            {/* Estratto */}
            <p className="text-sm text-gray-700 line-clamp-3 mb-3">
              {item.excerpt
                ? item.excerpt.slice(0, 260) + (item.excerpt.length > 260 ? "…" : "")
                : "Nessuna anteprima disponibile."}
            </p>

            {/* Link originale */}
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-700 hover:underline font-medium"
            >
              Leggi l’articolo originale →
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Card;
