export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-gray-600 space-y-3">
        <p>
          Le notizie provengono da feed RSS pubblici di
          {' '}<a className="underline hover:text-gray-900" href="https://www.calciocasteddu.it" target="_blank" rel="noreferrer">CalcioCasteddu.it</a>,
          {' '}<a className="underline hover:text-gray-900" href="https://www.tuttocagliari.net" target="_blank" rel="noreferrer">TuttoCagliari.net</a>
          {' '}e{' '}
          <a className="underline hover:text-gray-900" href="https://www.cagliarinews24.com" target="_blank" rel="noreferrer">CagliariNews24.com</a>.
          I contenuti completi restano di proprietà dei rispettivi autori.
        </p>
        <p className="text-xs text-gray-500">
          © 2025 Cagliari News Hub — Sito indipendente di aggregazione notizie. Non affiliato al Cagliari Calcio.
        </p>
      </div>
    </footer>
  );
}
