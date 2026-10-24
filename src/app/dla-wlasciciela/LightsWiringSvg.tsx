/** Poglądowy schemat zmiany świateł tylnych — wg relacji użytkownika (forum, C1500 '94). Bez AI. */
export default function LightsWiringSvg() {
  const box = 'fill-neutral-900 stroke-neutral-500';
  return (
    <figure className="my-4" data-testid="lights-wiring-svg">
      <svg viewBox="0 0 480 640" role="img" aria-labelledby="lw-title lw-desc" className="h-auto w-full rounded-xl border border-neutral-700 bg-neutral-950">
        <title id="lw-title">Schemat poglądowy: przeróbka tylnych świateł GMT400 na układ europejski</title>
        <desc id="lw-desc">Włącznik hamulca daje sygnał stopu na dawny przewód kierunkowskazu do czerwonej komory. Kierunkowskaz przeniesiono na przewód cofania do komory z pomarańczową żarówką. Dodano osobną lampę cofania i tylną lampę przeciwmgłową.</desc>
        <defs>
          <marker id="lw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#fca5a5" /></marker>
        </defs>
        <text x="240" y="28" textAnchor="middle" fontSize="19" fontWeight="700" fill="#fff">Tył C/K — układ europejski (poglądowo)</text>

        {/* źródła sygnału */}
        <rect x="14" y="56" width="190" height="64" rx="8" className={box} strokeWidth="2" />
        <text x="109" y="84" textAnchor="middle" fontSize="17" fill="#fff">Włącznik hamulca</text>
        <text x="109" y="106" textAnchor="middle" fontSize="15" fill="#d4d4d4">sygnał STOP</text>

        <rect x="276" y="56" width="190" height="64" rx="8" className={box} strokeWidth="2" />
        <text x="371" y="84" textAnchor="middle" fontSize="17" fill="#fff">Przełącznik kierunków</text>
        <text x="371" y="106" textAnchor="middle" fontSize="15" fill="#d4d4d4">wyjścia lewy / prawy</text>

        {/* przecięty biały przewód */}
        <line x1="204" y1="88" x2="276" y2="88" stroke="#e5e5e5" strokeWidth="4" strokeDasharray="10 8" />
        <path d="M228 74 L252 102 M252 74 L228 102" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
        <text x="240" y="140" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fca5a5">① PRZETNIJ biały przewód</text>
        <text x="240" y="160" textAnchor="middle" fontSize="14" fill="#d4d4d4">(hamulec → przełącznik kierunków)</text>

        {/* włącznik cofania */}
        <rect x="14" y="448" width="190" height="60" rx="8" className={box} strokeWidth="2" />
        <text x="109" y="474" textAnchor="middle" fontSize="17" fill="#fff">Włącznik cofania</text>
        <text x="109" y="496" textAnchor="middle" fontSize="15" fill="#d4d4d4">przewód jasnozielony</text>

        {/* lampa tylna */}
        <rect x="270" y="190" width="196" height="190" rx="12" className="fill-neutral-900 stroke-red-500" strokeWidth="3" />
        <text x="368" y="214" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">Lampa tylna LH</text>
        <rect x="284" y="226" width="168" height="62" rx="8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
        <text x="368" y="252" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">A · STOP + pozycja</text>
        <text x="368" y="274" textAnchor="middle" fontSize="14" fill="#fecaca">komora czerwona</text>
        <rect x="284" y="302" width="168" height="76" rx="8" fill="#262626" stroke="#d4d4d4" strokeWidth="2" strokeDasharray="7 5" />
        <text x="368" y="328" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">B · KIERUNEK</text>
        <text x="368" y="350" textAnchor="middle" fontSize="14" fill="#e5e5e5">dawna komora cofania,</text>
        <text x="368" y="364" textAnchor="middle" fontSize="14" fill="#e5e5e5">pomarańczowa żarówka</text>

        {/* przewody */}
        <path d="M109 120 V210 H270 V257 H284" fill="none" stroke="#d4d4d4" strokeWidth="4" strokeDasharray="12 7" markerEnd="url(#lw-arrow)" />
        <text x="20" y="232" fontSize="14" fill="#e5e5e5">② STOP → oryginalny przewód</text>
        <text x="20" y="251" fontSize="14" fill="#e5e5e5">żółty (LH) / ciemnozielony (RH)</text>
        <text x="20" y="270" fontSize="14" fill="#d4d4d4">linia przerywana = żółty</text>

        <path d="M371 120 V180 H258 V333 H284" fill="none" stroke="#86efac" strokeWidth="4" markerEnd="url(#lw-arrow)" />
        <text x="20" y="320" fontSize="14" fill="#e5e5e5">③ KIERUNEK → przewód cofania</text>
        <text x="20" y="339" fontSize="14" fill="#86efac">jasnozielony (dawne cofanie)</text>

        {/* nowa lampa cofania */}
        <path d="M109 508 V548 H270" fill="none" stroke="#86efac" strokeWidth="4" markerEnd="url(#lw-arrow)" />
        <rect x="270" y="520" width="196" height="56" rx="8" className={box} strokeWidth="2" />
        <text x="368" y="546" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">④ Nowa lampa cofania</text>
        <text x="368" y="566" textAnchor="middle" fontSize="14" fill="#d4d4d4">biała, np. w zderzaku</text>

        <rect x="14" y="590" width="452" height="38" rx="8" className={box} strokeWidth="1.5" />
        <text x="240" y="614" textAnchor="middle" fontSize="14" fill="#e5e5e5">⑤ Przeciwmgłowa tylna (czerwona, osobny włącznik + kontrolka)</text>
      </svg>
      <figcaption className="mt-2 text-sm leading-6 text-neutral-300">Schemat poglądowy, nie instrukcja montażu: na podstawie opisu użytkownika forum (C1500 ’94). Kolory przewodów i numery komór sprawdź multimetrem w swoim aucie i w manualu. Żółty przewód zaznaczono linią przerywaną.</figcaption>
    </figure>
  );
}
