'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  COMPATIBILITY_RULES,
  SOURCE_ENTRIES,
  getCompatibilityStats,
  verdictHeadline,
  verdictBadgeLabel,
  type CompatibilityRule,
  type Verdict,
  type SourceStatus,
} from '../../../lib/czy-pasuje-dane';

const STATS = getCompatibilityStats();
const pasujeWgRelacjiCount = COMPATIBILITY_RULES.filter(
  (r) =>
    r.verdict === 'PASUJE' &&
    (r.sourceStatus === 'Opinia (forum)' || r.sourceStatus === 'Opinia (jedno źródło)')
).length;

const CATEGORIES = [
  'Wszystkie kategorie',
  'Nadwozie i blacharka',
  'Skrzynia biegów (4L60-E)',
  'Skrzynia rozdzielcza i osie',
  'Identyfikacja platformy (1999-2000)',
] as const;

// Szybkie testowe scenariusze
interface QuickScenario {
  label: string;
  ruleId: string;
  expectedVerdict: Verdict;
}

const QUICK_SCENARIOS: QuickScenario[] = [
  {
    label: 'Maska: Escalade 1999 → Tahoe GMT400',
    ruleId: 'maska_escalade_denali',
    expectedVerdict: 'NIE PASUJE',
  },
  {
    label: 'Maska: GMT400 1995 → C1500 1997',
    ruleId: 'maska_ten_sam_okres',
    expectedVerdict: 'PASUJE',
  },
  {
    label: 'Przednie drzwi: 1992 → 1996 (mieszane generacje)',
    ruleId: 'drzwi_przod_mieszany_okres',
    expectedVerdict: 'WARUNKOWO',
  },
  {
    label: 'Zderzaki (wprost oznaczona luka w źródłach)',
    ruleId: 'zderzaki_luka',
    expectedVerdict: 'BRAK DANYCH',
  },
  {
    label: 'Skrzynia 4L60E: rocznik 1995 → 1994',
    ruleId: 'skrzynia_4l60e_95_mieszana',
    expectedVerdict: 'WARUNKOWO',
  },
  {
    label: 'Reduktor: NP241 (32 wypusty z 4L80E) → 4L60E (27 wypustów)',
    ruleId: 'np241_32_spline_do_4l60e',
    expectedVerdict: 'NIE PASUJE',
  },
];

export default function CzyTaCzescPasujePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie kategorie');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('');
  const [filterVerdict, setFilterVerdict] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCatalog, setShowCatalog] = useState<boolean>(true);

  // Formularz dopasowania
  const [recipientModel, setRecipientModel] = useState<string>('');
  const [recipientYear, setRecipientYear] = useState<string>('');
  const [donorModel, setDonorModel] = useState<string>('');
  const [donorYear, setDonorYear] = useState<string>('');
  const [evaluated, setEvaluated] = useState<boolean>(false);

  // Wybrana reguła
  const activeRule = useMemo(() => {
    return COMPATIBILITY_RULES.find((r) => r.id === selectedRuleId) ?? null;
  }, [selectedRuleId]);

  // Lista reguł do dropdownu zależna od wybranej kategorii
  const availablePartsForCategory = useMemo(() => {
    if (selectedCategory === 'Wszystkie kategorie') {
      return COMPATIBILITY_RULES;
    }
    return COMPATIBILITY_RULES.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  // Filtrowana lista do dolnego katalogu
  const filteredRules = useMemo(() => {
    return COMPATIBILITY_RULES.filter((r) => {
      if (selectedCategory !== 'Wszystkie kategorie' && r.category !== selectedCategory) {
        return false;
      }
      if (filterVerdict !== 'ALL' && r.verdict !== filterVerdict) {
        return false;
      }
      if (filterStatus !== 'ALL' && r.sourceStatus !== filterStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inPart = r.part.toLowerCase().includes(query);
        const inJust = r.justification.toLowerCase().includes(query);
        const inDonor = r.donorConditions.toLowerCase().includes(query);
        const inRec = r.recipientConditions.toLowerCase().includes(query);
        if (!inPart && !inJust && !inDonor && !inRec) return false;
      }
      return true;
    });
  }, [selectedCategory, filterVerdict, filterStatus, searchQuery]);

  const handleApplyScenario = (scenario: QuickScenario) => {
    const rule = COMPATIBILITY_RULES.find((r) => r.id === scenario.ruleId);
    if (!rule) return;
    setSelectedCategory(rule.category);
    setSelectedRuleId(rule.id);
    setRecipientModel('GMT400');
    setRecipientYear('1996');
    setDonorModel('Dawca');
    setDonorYear('1996');
    setEvaluated(true);
  };

  const handleSelectRule = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    const rule = COMPATIBILITY_RULES.find((r) => r.id === ruleId);
    if (rule) {
      if (rule.category !== selectedCategory && selectedCategory !== 'Wszystkie kategorie') {
        setSelectedCategory(rule.category);
      }
      // Jeśli to luka, od razu oceniamy
      if (rule.isGap || rule.verdict === 'BRAK DANYCH') {
        setEvaluated(true);
      }
    }
  };

  const handleCheckCompatibility = (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluated(true);
  };

  const handleReset = () => {
    setSelectedRuleId('');
    setRecipientModel('');
    setRecipientYear('');
    setDonorModel('');
    setDonorYear('');
    setEvaluated(false);
  };

  // Obliczenie werdyktu końcowego
  const computedResult = useMemo(() => {
    if (!evaluated && !activeRule) {
      return null;
    }

    if (!activeRule) {
      return {
        verdict: 'BRAK DANYCH' as Verdict,
        sourceStatus: 'NIE POTWIERDZONO' as SourceStatus,
        title: 'Brak wybranej części lub kombinacji',
        justification:
          'Wybierz część z opublikowanych tabel paczki 5, aby sprawdzić dopasowanie. W razie braku danych lub nieustalenia kombinacji w źródłach obowiązuje zasada bezpieczeństwa.',
        sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
        sourceTitle: SOURCE_ENTRIES.faq_luki.title,
        sourceHref: SOURCE_ENTRIES.faq_luki.href,
        isGap: true,
      };
    }

    // Jeśli reguła jest jawną luką w źródłach
    if (activeRule.isGap || activeRule.verdict === 'BRAK DANYCH') {
      return {
        verdict: 'BRAK DANYCH' as Verdict,
        sourceStatus: activeRule.sourceStatus,
        title: activeRule.part,
        justification: activeRule.justification,
        sourceSlug: activeRule.sourceSlug,
        sourceTitle: activeRule.sourceTitle,
        sourceHref: `/baza/${activeRule.sourceSlug}`,
        isGap: true,
      };
    }

    // Zasada: PASUJE tylko gdy obie strony są określone
    const hasRecipient = Boolean(recipientModel.trim() || recipientYear.trim());
    const hasDonor = Boolean(donorModel.trim() || donorYear.trim());

    if (!hasRecipient || !hasDonor) {
      return {
        verdict: 'BRAK DANYCH' as Verdict,
        sourceStatus: 'NIE POTWIERDZONO' as SourceStatus,
        title: activeRule.part,
        justification:
          'ZASADA WERDYKTU: PASUJE wolno wydać wyłącznie, gdy reguła ze źródeł jawnie obejmuje podaną kombinację obu stron. Uzupełnij dane o aucie odbiorcy i pochodzeniu części.',
        sourceSlug: SOURCE_ENTRIES.faq_luki.slug,
        sourceTitle: SOURCE_ENTRIES.faq_luki.title,
        sourceHref: SOURCE_ENTRIES.faq_luki.href,
        isGap: false,
      };
    }

    return {
      verdict: activeRule.verdict,
      sourceStatus: activeRule.sourceStatus,
      title: activeRule.part,
      justification: activeRule.justification,
      sourceSlug: activeRule.sourceSlug,
      sourceTitle: activeRule.sourceTitle,
      sourceHref: `/baza/${activeRule.sourceSlug}`,
      isGap: Boolean(activeRule.isGap),
    };
  }, [evaluated, activeRule, recipientModel, recipientYear, donorModel, donorYear]);

  return (
    <div className="min-h-screen bg-black text-[#ededed] pb-24">
      {/* Pasek nawigacji górnej */}
      <div className="border-b border-white/10 bg-neutral-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/narzedzia"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-400 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Wszystkie narzędzia
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 text-amber-300 font-mono">
            Paczka 5 • Zamienność części
          </span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Nagłówek narzędzia */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Kreator tabel zamienności
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Czy ta część pasuje?
          </h1>
          <p className="text-neutral-300 max-w-3xl text-base sm:text-lg leading-relaxed">
            Interaktywne sprawdzanie zamienności elementów GMT400 na podstawie opublikowanych tabel
            Paczki 5 Encyklopedii (wpisy 01–05). Każda odpowiedź zachowuje status źródła i wskazuje
            wpis w bazie wiedzy.
          </p>

          {/* Zasady bezpieczeństwa danych */}
          <div className="mt-4 p-4 rounded-xl border border-white/10 bg-neutral-900/60 text-xs sm:text-sm text-neutral-300 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-start gap-2.5">
              <svg
                className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <strong className="text-white block font-medium">Twarde zasady werdyktów:</strong>
                Werdykt <span className="text-emerald-400 font-semibold">PASUJE</span> wydawany jest
                wyłącznie przy pełnym potwierdzeniu kombinacji w źródłach. W razie braków lub
                niepotwierdzenia otrzymasz{' '}
                <span className="text-neutral-400 font-semibold">BRAK DANYCH</span> lub{' '}
                <span className="text-amber-400 font-semibold">WARUNKOWO</span>.
              </div>
            </div>
          </div>
        </header>

        {/* Pasek szybkich scenariuszy testowych */}
        <section aria-labelledby="quick-test-heading" className="mb-8">
          <h2 id="quick-test-heading" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Szybkie sprawdzenie typowych przypadków ze źródeł:
          </h2>
          <div className="flex flex-wrap gap-2">
            {QUICK_SCENARIOS.map((scenario) => {
              const rule = COMPATIBILITY_RULES.find((r) => r.id === scenario.ruleId);
              const badgeColor =
                scenario.expectedVerdict === 'PASUJE'
                  ? 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40'
                  : scenario.expectedVerdict === 'WARUNKOWO'
                  ? 'border-amber-500/40 text-amber-300 hover:bg-amber-950/40'
                  : scenario.expectedVerdict === 'NIE PASUJE'
                  ? 'border-rose-500/40 text-rose-300 hover:bg-rose-950/40'
                  : 'border-neutral-500/40 text-neutral-300 hover:bg-neutral-800/40';

              const badgeText = rule
                ? verdictBadgeLabel(scenario.expectedVerdict, rule.sourceStatus)
                : scenario.expectedVerdict;

              return (
                <button
                  key={scenario.ruleId}
                  type="button"
                  onClick={() => handleApplyScenario(scenario)}
                  className={`px-3 py-1.5 rounded-lg border bg-neutral-900/90 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${badgeColor}`}
                >
                  <span className="font-bold">[{badgeText}]</span>
                  <span>{scenario.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Główny formularz weryfikacji */}
        <section
          aria-labelledby="form-heading"
          className="rounded-2xl border border-white/15 bg-neutral-900/80 p-5 sm:p-7 shadow-xl mb-8"
        >
          <h2 id="form-heading" className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Wybierz część i parametry obu stron
          </h2>

          <form onSubmit={handleCheckCompatibility} className="space-y-6">
            {/* Wybór kategorii i części ze źródeł */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="select-category" className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                  1. Kategoria podzespołu
                </label>
                <select
                  id="select-category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedRuleId('');
                    setEvaluated(false);
                  }}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/20 bg-neutral-950 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-part-rule" className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                  2. Część / Badana reguła ze źródeł ({availablePartsForCategory.length})
                </label>
                <select
                  id="select-part-rule"
                  value={selectedRuleId}
                  onChange={(e) => handleSelectRule(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/20 bg-neutral-950 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">-- Wybierz sprawdzaną część --</option>
                  {availablePartsForCategory.map((rule) => (
                    <option key={rule.id} value={rule.id}>
                      {rule.part} {rule.isGap ? '[LUKA / BRAK DANYCH]' : `[${rule.verdict}]`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dwie kolumny parametrów: Odbiorca i Dawca */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Kolumna A: Auto odbiorcy */}
              <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/70 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Strona A: Twoje auto (odbiorca)
                  </h3>
                  <span className="text-xs text-neutral-400">Pojazd docelowy</span>
                </div>

                <div>
                  <label htmlFor="recipient-model" className="block text-xs text-neutral-300 mb-1">
                    Model / Wersja nadwozia:
                  </label>
                  <input
                    id="recipient-model"
                    type="text"
                    placeholder="np. Tahoe, C1500, K2500, Suburban, Crew Cab"
                    value={recipientModel}
                    onChange={(e) => setRecipientModel(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-white/15 bg-neutral-900 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="recipient-year" className="block text-xs text-neutral-300 mb-1">
                    Rocznik / Okres produkcji:
                  </label>
                  <select
                    id="recipient-year"
                    value={recipientYear}
                    onChange={(e) => setRecipientYear(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-white/15 bg-neutral-900 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Wybierz rocznik...</option>
                    <option value="1988-1993">1988–1993 (stary przód, TBI)</option>
                    <option value="1994">1994 (nowa atrapa, TBI)</option>
                    <option value="1995">1995 (przejściowy: PWM, nowe wnętrze)</option>
                    <option value="1996-1997">1996–1997 (Vortec, MLPS, wbudowany dzwon)</option>
                    <option value="1998">1998 (AutoTrac NP8, odejmowany dzwon)</option>
                    <option value="1999-2000">1999–2000 (SUV GMT400 / Classic HD)</option>
                  </select>
                </div>

                {activeRule && (
                  <div className="pt-2 text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-300 block mb-0.5">
                      Warunki odbiorcy w źródłach:
                    </span>
                    {activeRule.recipientConditions}
                  </div>
                )}
              </div>

              {/* Kolumna B: Część dawcy */}
              <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/70 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Strona B: Część / Dawca
                  </h3>
                  <span className="text-xs text-neutral-400">Pochodzenie części</span>
                </div>

                <div>
                  <label htmlFor="donor-model" className="block text-xs text-neutral-300 mb-1">
                    Dawca / Źródło części:
                  </label>
                  <input
                    id="donor-model"
                    type="text"
                    placeholder="np. C1500, Escalade 1999, Silverado GMT800, NP241"
                    value={donorModel}
                    onChange={(e) => setDonorModel(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-white/15 bg-neutral-900 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="donor-year" className="block text-xs text-neutral-300 mb-1">
                    Rocznik dawcy / Typ podzespołu:
                  </label>
                  <select
                    id="donor-year"
                    value={donorYear}
                    onChange={(e) => setDonorYear(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-white/15 bg-neutral-900 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Wybierz rocznik lub specyfikację...</option>
                    <option value="1988-1993">1988–1993</option>
                    <option value="1994">1994</option>
                    <option value="1995">1995</option>
                    <option value="1996-1997">1996–1997</option>
                    <option value="1998-2000">1998–2000</option>
                    <option value="GMT800">1999–2000 GMT800 (Silverado/Sierra)</option>
                    <option value="2004+">2004+ (np. nowy typ MLPS)</option>
                  </select>
                </div>

                {activeRule && (
                  <div className="pt-2 text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-300 block mb-0.5">
                      Warunki dawcy w źródłach:
                    </span>
                    {activeRule.donorConditions}
                  </div>
                )}
              </div>
            </div>

            {/* Przyciski akcji */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm tracking-wide transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Sprawdź dopasowanie
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 rounded-xl border border-white/20 hover:bg-neutral-800 text-neutral-300 text-sm font-medium transition cursor-pointer"
              >
                Wyczyść pola
              </button>
            </div>
          </form>
        </section>

        {/* KARTA WYNIKU */}
        {computedResult && (
          <section
            aria-labelledby="result-heading"
            className="rounded-2xl border border-white/20 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl mb-10 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                  Werdykt dopasowania
                </span>
                <h2 id="result-heading" className="text-2xl font-bold text-white">
                  {computedResult.title}
                </h2>
              </div>

              {/* Status źródła */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Status źródła:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    computedResult.sourceStatus === 'Potwierdzone (2+ źródła)'
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                      : computedResult.sourceStatus === 'Opinia (forum)'
                      ? 'bg-purple-950/70 border-purple-500/50 text-purple-300'
                      : computedResult.sourceStatus === 'Opinia (jedno źródło)'
                      ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                      : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                  }`}
                >
                  {computedResult.sourceStatus}
                </span>
              </div>
            </div>

            {/* Duży baner werdyktu */}
            <div
              className={`p-5 rounded-xl border flex items-start gap-4 mb-6 ${
                computedResult.verdict === 'PASUJE'
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100'
                  : computedResult.verdict === 'WARUNKOWO'
                  ? 'border-amber-500/40 bg-amber-950/30 text-amber-100'
                  : computedResult.verdict === 'NIE PASUJE'
                  ? 'border-rose-500/40 bg-rose-950/30 text-rose-100'
                  : 'border-neutral-500/40 bg-neutral-950/40 text-neutral-200'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg ${
                  computedResult.verdict === 'PASUJE'
                    ? 'bg-emerald-500 text-black'
                    : computedResult.verdict === 'WARUNKOWO'
                    ? 'bg-amber-500 text-black'
                    : computedResult.verdict === 'NIE PASUJE'
                    ? 'bg-rose-500 text-white'
                    : 'bg-neutral-700 text-white'
                }`}
              >
                {computedResult.verdict === 'PASUJE' && '✓'}
                {computedResult.verdict === 'WARUNKOWO' && '⚠'}
                {computedResult.verdict === 'NIE PASUJE' && '✕'}
                {computedResult.verdict === 'BRAK DANYCH' && '?'}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-xl font-extrabold tracking-wide ${
                      computedResult.verdict === 'PASUJE'
                        ? 'text-emerald-400'
                        : computedResult.verdict === 'WARUNKOWO'
                        ? 'text-amber-400'
                        : computedResult.verdict === 'NIE PASUJE'
                        ? 'text-rose-400'
                        : 'text-neutral-300'
                    }`}
                  >
                    {verdictHeadline(computedResult.verdict, computedResult.sourceStatus)}
                  </span>
                  {computedResult.isGap && (
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                      Zidentyfikowana luka
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-neutral-300">
                  {computedResult.justification}
                </p>
              </div>
            </div>

            {/* Odsyłacz do źródła */}
            <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-300">
                <svg
                  className="w-4 h-4 text-amber-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>
                  Wpis źródłowy w Encyklopedii: <strong className="text-white">{computedResult.sourceTitle}</strong>
                </span>
              </div>
              <Link
                href={computedResult.sourceHref}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition"
              >
                Otwórz wpis źródłowy ↗
              </Link>
            </div>
          </section>
        )}

        {/* Sekcja statystyk i pełnego katalogu reguł ze źródeł */}
        <section aria-labelledby="catalog-heading" className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 id="catalog-heading" className="text-2xl font-bold text-white">
                Baza reguł Paczki 5 ({STATS.total} pozycji)
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Wszystkie reguły, warunki rozstrzygające i zidentyfikowane luki z opublikowanych
                materiałów.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCatalog(!showCatalog)}
              className="px-3.5 py-1.5 rounded-lg border border-white/20 bg-neutral-900 text-xs text-neutral-300 hover:text-white transition cursor-pointer"
            >
              {showCatalog ? 'Zwiń tabelę' : 'Rozwiń tabelę'}
            </button>
          </div>

          {/* Podsumowanie statystyczne reguł */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
              <span className="text-xs text-emerald-400 block font-medium">PASUJE</span>
              <span className="text-2xl font-extrabold text-white">{STATS.byVerdict['PASUJE']}</span>
              <span className="text-xs text-neutral-400 block mt-0.5">
                Zgodności wskazane w źródłach (w tym {pasujeWgRelacjiCount} wg relacji właścicieli)
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20">
              <span className="text-xs text-amber-400 block font-medium">WARUNKOWO</span>
              <span className="text-2xl font-extrabold text-white">{STATS.byVerdict['WARUNKOWO']}</span>
              <span className="text-xs text-neutral-400 block mt-0.5">Wymaga swapu/części</span>
            </div>
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20">
              <span className="text-xs text-rose-400 block font-medium">NIE PASUJE</span>
              <span className="text-2xl font-extrabold text-white">{STATS.byVerdict['NIE PASUJE']}</span>
              <span className="text-xs text-neutral-400 block mt-0.5">Niezgodne wersje</span>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-500/30 bg-neutral-950/40">
              <span className="text-xs text-neutral-400 block font-medium">BRAK DANYCH</span>
              <span className="text-2xl font-extrabold text-white">{STATS.byVerdict['BRAK DANYCH']}</span>
              <span className="text-xs text-neutral-400 block mt-0.5">Luki w źródłach ({STATS.gapsCount})</span>
            </div>
          </div>

          {showCatalog && (
            <div className="space-y-4">
              {/* Filtry wyszukiwania katalogu */}
              <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/70 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="filter-search" className="block text-xs text-neutral-400 mb-1">
                    Szukaj po nazwie części lub warunku:
                  </label>
                  <input
                    id="filter-search"
                    type="text"
                    placeholder="np. drzwi, MLPS, reduktor, zderzak..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-h-[38px] px-3 py-1.5 rounded-lg border border-white/15 bg-neutral-900 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="filter-verdict" className="block text-xs text-neutral-400 mb-1">
                    Filtr werdyktu:
                  </label>
                  <select
                    id="filter-verdict"
                    value={filterVerdict}
                    onChange={(e) => setFilterVerdict(e.target.value)}
                    className="w-full min-h-[38px] px-3 py-1.5 rounded-lg border border-white/15 bg-neutral-900 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">Wszystkie werdykty</option>
                    <option value="PASUJE">Tylko PASUJE</option>
                    <option value="WARUNKOWO">Tylko WARUNKOWO</option>
                    <option value="NIE PASUJE">Tylko NIE PASUJE</option>
                    <option value="BRAK DANYCH">Tylko BRAK DANYCH (luki)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-status" className="block text-xs text-neutral-400 mb-1">
                    Filtr statusu źródła:
                  </label>
                  <select
                    id="filter-status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full min-h-[38px] px-3 py-1.5 rounded-lg border border-white/15 bg-neutral-900 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">Wszystkie statusy</option>
                    <option value="Potwierdzone (2+ źródła)">Potwierdzone (2+ źródła)</option>
                    <option value="Opinia (forum)">Opinia (forum)</option>
                    <option value="Opinia (jedno źródło)">Opinia (jedno źródło)</option>
                    <option value="NIE POTWIERDZONO">NIE POTWIERDZONO</option>
                  </select>
                </div>
              </div>

              {/* Lista reguł w kartach */}
              <div className="space-y-3">
                {filteredRules.map((rule) => {
                  const badgeColor =
                    rule.verdict === 'PASUJE'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : rule.verdict === 'WARUNKOWO'
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      : rule.verdict === 'NIE PASUJE'
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                      : 'bg-neutral-800/60 border-neutral-600/40 text-neutral-300';

                  return (
                    <article
                      key={rule.id}
                      className="p-4 rounded-xl border border-white/10 bg-neutral-900/60 hover:bg-neutral-900 transition flex flex-col md:flex-row items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${badgeColor}`}>
                            {verdictBadgeLabel(rule.verdict, rule.sourceStatus)}
                          </span>
                          <h3 className="text-base font-bold text-white">{rule.part}</h3>
                          <span className="text-xs text-neutral-400">({rule.category})</span>
                          {rule.isGap && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              Luka
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                          {rule.justification}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400 pt-1">
                          <div>
                            <strong className="text-neutral-300">Dawca:</strong> {rule.donorConditions}
                          </div>
                          <div>
                            <strong className="text-neutral-300">Odbiorca:</strong> {rule.recipientConditions}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-2 shrink-0 self-stretch md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-white/10">
                        <span className="text-xs text-neutral-400">
                          Status: <span className="text-neutral-200 font-medium">{rule.sourceStatus}</span>
                        </span>
                        <Link
                          href={`/baza/${rule.sourceSlug}`}
                          className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                        >
                          Zobacz wpis paczki 5 →
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(rule.category);
                            setSelectedRuleId(rule.id);
                            setRecipientModel('Pojazd GMT400');
                            setRecipientYear('1996');
                            setDonorModel('Dawca');
                            setDonorYear('1996');
                            setEvaluated(true);
                            window.scrollTo({ top: 150, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition cursor-pointer"
                        >
                          Sprawdź w kreatorze ↑
                        </button>
                      </div>
                    </article>
                  );
                })}

                {filteredRules.length === 0 && (
                  <p className="p-6 text-center text-sm text-neutral-400 bg-neutral-900/40 rounded-xl border border-white/10">
                    Brak reguł spełniających wybrane kryteria wyszukiwania.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
