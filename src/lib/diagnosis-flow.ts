/**
 * Mechanizm ścieżek diagnostycznych (etap 1): model danych, walidator i czysta logika przejść.
 * Bez Reacta i bez dostępu do przeglądarki, żeby dało się go testować przez node:test.
 *
 * Zasady:
 *  • Wynik diagnostyczny (co wynika z odpowiedzi i pomiarów) jest osobną osią od źródła (skąd pochodzi treść
 *    i czy ustalono jego stosowalność do wersji auta). Oryginał producenta nie potwierdza przyczyny w konkretnym aucie.
 *  • Źródło jest wymagane dla twierdzeń i procedur diagnostycznych oraz ich stosowalności, nie dla neutralnych etykiet interfejsu.
 *  • Nieznana dana o aucie nigdy nie daje dopasowania. Deklaracja doświadczenia niczego nie odblokowuje.
 *  • Pole `parts` jest w tym etapie zawsze puste (moduł części dojdzie osobno, ze zweryfikowanymi źródłami).
 */
import type { VehicleProfile } from './vehicle-profile';

export const DIAGNOSTIC_OUTCOMES = ['obserwacja', 'nieprawidłowy-wynik-testu', 'wskazanie-przyczyny', 'konieczny-kolejny-test', 'nierozstrzygnięte'] as const;
export type DiagnosticOutcome = (typeof DIAGNOSTIC_OUTCOMES)[number];

export const SOURCE_KINDS = ['oryginał producenta', 'kopia dokumentu', 'podręcznik', 'wpis serwisu'] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

export type FlowSource = {
  label: string;
  url: string;
  kind: SourceKind;
  /** Czy stosowalność źródła do wersji auta z zakresu ścieżki została ustalona. */
  applicability: 'ustalona' | 'nieustalona';
  applicabilityNote: string;
  scope: string;
  /** Zakres wersji aut, dla których stosowalność źródła ustalono (do sprawdzenia maszynowego). Wymagany przy stosowalności „ustalona”. */
  vehicleScope?: VehicleScope[];
};

export type CheckLevel = 'każdy' | 'z narzędziami' | 'warsztat';

/** Dana o aucie potrzebna do wyświetlenia sprawdzenia. Wartość pochodzi z profilu (jeśli pasuje do opcji) lub z pytania. */
export type FlowRequirement = {
  key: string;
  label: string;
  options: { id: string; label: string }[];
  /** Pole profilu auta, z którego można wstępnie wypełnić wartość (porównanie z opcjami bez względu na wielkość liter). */
  profileField?: 'engine' | 'transmission' | 'drive' | 'year' | 'model';
};

export type FlowSafety = {
  text: string;
  form: 'parafraza źródła' | 'propozycja do akceptacji';
};

type NodeBase = {
  id: string;
  title: string;
  text: string;
  sources: FlowSource[];
  /** Zawsze pusta w etapie 1. */
  parts: unknown[];
  safety?: FlowSafety;
  /** Krótkie szczegóły i uwagi o źródle, pokazywane w rozwijanej sekcji (nie w głównej treści kroku). */
  details?: string;
  /** Komunikat zatrzymania (stop), pokazywany po odpowiedzi z `stop: true`. Wymaga źródła. */
  stop?: FlowSafety;
};
export type FlowAnswer = {
  id: string;
  label: string;
  /** Następny węzeł. Dla odpowiedzi zatrzymującej (stop) pusty. */
  next: string;
  /** Odpowiedź kończy ścieżkę komunikatem zatrzymania z pola `stop` węzła (wymaga źródła). */
  stop?: boolean;
  /** Co ta odpowiedź wyklucza (twierdzenie diagnostyczne: wymaga źródła w węźle). */
  excludes?: string[];
};
export type QuestionNode = NodeBase & { kind: 'question'; neutral?: boolean; /** Jawnie niezależne od wersji auta (tylko neutralne pytanie bez wniosków). Domyślnie każdy krok wymaga potwierdzonej wersji. */ versionIndependent?: boolean; answers: FlowAnswer[]; requires?: FlowRequirement[] };
export type CheckNode = NodeBase & { kind: 'check'; level: CheckLevel; answers: FlowAnswer[]; requires?: FlowRequirement[] };
export type ResultNode = NodeBase & { kind: 'result'; outcome: DiagnosticOutcome; excluded: string[]; notChecked: string[] };
export type FlowNode = QuestionNode | CheckNode | ResultNode;

export type VehicleScope = {
  models?: string[];
  yearFrom?: number;
  yearTo?: number;
  engines?: string[];
  drives?: string[];
  transmissions?: string[];
};

export type Flow = {
  id: string;
  symptomId: string;
  title: string;
  scope: VehicleScope[];
  start: string;
  nodes: Record<string, FlowNode>;
};

export type VehicleMatch = { status: 'pasuje' | 'częściowo' | 'brak'; missing: string[] };

const norm = (v: string | undefined | null) => (v ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

function matchScope(profile: VehicleProfile | null, scope: VehicleScope): VehicleMatch {
  if (!profile) return { status: 'częściowo', missing: ['auto'] };
  const missing: string[] = [];
  let mismatch = false;
  const test = (field: string, value: string, allowed: string[] | undefined) => {
    if (!allowed || allowed.length === 0) return;
    if (!norm(value)) { missing.push(field); return; }
    if (!allowed.some(a => norm(a) === norm(value))) mismatch = true;
  };
  test('model', profile.model, scope.models);
  test('silnik', profile.engine, scope.engines);
  test('napęd', profile.drive, scope.drives);
  test('skrzynia', profile.transmission, scope.transmissions);
  if (scope.yearFrom !== undefined || scope.yearTo !== undefined) {
    const year = Number(profile.year);
    if (!profile.year || !Number.isInteger(year)) missing.push('rok');
    else if ((scope.yearFrom !== undefined && year < scope.yearFrom) || (scope.yearTo !== undefined && year > scope.yearTo)) mismatch = true;
  }
  if (mismatch) return { status: 'brak', missing: [] };
  return missing.length ? { status: 'częściowo', missing } : { status: 'pasuje', missing: [] };
}

/** Status pokrycia ścieżki dla auta: najlepszy wynik spośród zakresów. Nieznana dana nigdy nie daje „pasuje”. */
export function matchVehicle(profile: VehicleProfile | null, flow: Pick<Flow, 'scope'>): VehicleMatch {
  const results = flow.scope.map(scope => matchScope(profile, scope));
  const exact = results.find(r => r.status === 'pasuje');
  if (exact) return exact;
  const partial = results.find(r => r.status === 'częściowo');
  if (partial) return partial;
  return { status: 'brak', missing: [] };
}

export type Facts = Record<string, string | undefined>;

/** Wartość wymaganej danej: najpierw odpowiedź użytkownika, potem profil (tylko gdy dokładnie pasuje do jednej z opcji). */
export function resolveFact(req: FlowRequirement, profile: VehicleProfile | null, facts: Facts): string | undefined {
  const given = facts[req.key];
  if (given && req.options.some(o => o.id === given)) return given;
  if (profile && req.profileField) {
    const raw = norm(String(profile[req.profileField] ?? ''));
    if (raw) {
      const hit = req.options.find(o => norm(o.id) === raw || norm(o.label) === raw);
      if (hit) return hit.id;
    }
  }
  return undefined;
}

export type NodeAvailability =
  | { available: true }
  | {
      available: false;
      reason: 'brak-wersji' | 'brak-pasującego-źródła' | 'brak-danych-wersji' | 'źródło-bez-ustalonej-stosowalności' | 'źródło-dla-innej-wersji' | 'brak-danych';
      missing: FlowRequirement[];
      missingVersion: string[];
    };

/** Czy krok jest jawnie niezależny od wersji auta. Tylko neutralne pytanie z flagą; nic poza tym. */
export function isVersionIndependent(node: FlowNode): boolean {
  return node.kind === 'question' && node.neutral === true && node.versionIndependent === true;
}

export function flowHasVersionIndependent(flow: Pick<Flow, 'nodes'>): boolean {
  return Object.values(flow.nodes).some(isVersionIndependent);
}

/** Źródło liczy się dla auta tylko, gdy stosowalność jest „ustalona” ORAZ jego zakres wersji pasuje do auta (nieznana dana nie pasuje). */
export function sourceCoversVehicle(source: FlowSource, profile: VehicleProfile | null): boolean {
  return source.applicability === 'ustalona' && Array.isArray(source.vehicleScope) && source.vehicleScope.length > 0 && matchVehicle(profile, { scope: source.vehicleScope }).status === 'pasuje';
}

/** Krok z twierdzeniem diagnostycznym wymaga źródła o ustalonej stosowalności i zakresie obejmującym bieżące auto. */
export function hasEstablishedSource(node: FlowNode, profile: VehicleProfile | null): boolean {
  if (!needsSource(node)) return true;
  return (node.sources ?? []).some(s => sourceCoversVehicle(s, profile));
}

/**
 * Czy węzeł można pokazać. Bramki w kolejności: wersja auta znana i potwierdzona, ścieżka pasuje do wersji (brak
 * danych wersji blokuje), źródło o ustalonej stosowalności, dane wymagane przez krok. Wyjątek: krok jawnie
 * niezależny od wersji. Parametr `declaredExperience` jest celowo ignorowany: deklaracja „mam doświadczenie”
 * niczego nie odblokowuje.
 */
export function nodeAvailability(node: FlowNode, profile: VehicleProfile | null, facts: Facts, flow: Pick<Flow, 'scope'>, _declaredExperience?: boolean): NodeAvailability {
  void _declaredExperience;
  if (isVersionIndependent(node)) return { available: true };
  const blocked = (reason: Exclude<NodeAvailability, { available: true }>['reason'], missing: FlowRequirement[] = [], missingVersion: string[] = []): NodeAvailability => ({ available: false, reason, missing, missingVersion });
  if (!profile) return blocked('brak-wersji');
  const match = matchVehicle(profile, flow);
  if (match.status === 'brak') return blocked('brak-pasującego-źródła');
  if (match.status === 'częściowo') return blocked('brak-danych-wersji', [], match.missing);
  if (!hasEstablishedSource(node, profile)) return blocked((node.sources ?? []).some(src => src.applicability === 'ustalona') ? 'źródło-dla-innej-wersji' : 'źródło-bez-ustalonej-stosowalności');
  if (node.kind !== 'result' && node.requires?.length) {
    const missing = node.requires.filter(req => !resolveFact(req, profile, facts));
    if (missing.length) return blocked('brak-danych', missing);
  }
  return { available: true };
}

export type PathStep = { nodeId: string; answerId: string };
export type Replay = { path: PathStep[]; currentId: string; stopped: boolean };

/**
 * Odtwarza ścieżkę z listy odpowiedzi (np. z adresu URL lub stanu). Zatrzymuje się na pierwszym kroku, który
 * jest niedostępny dla bieżącej wersji i danych, na nieznanej odpowiedzi albo na odpowiedzi zatrzymującej.
 * Dzięki temu zmiana wersji auta unieważnia zależne odpowiedzi i nie zostawia wniosków z innej wersji.
 */
export function replayPath(flow: Flow, profile: VehicleProfile | null, facts: Facts, answerIds: string[]): Replay {
  const path: PathStep[] = [];
  let currentId = flow.start;
  let stopped = false;
  for (const answerId of answerIds) {
    const node = flow.nodes[currentId];
    if (!node || node.kind === 'result') break;
    if (!nodeAvailability(node, profile, facts, flow).available) break;
    const answer = node.answers.find(a => a.id === answerId);
    if (!answer) break;
    path.push({ nodeId: currentId, answerId });
    if (answer.stop) { stopped = true; break; }
    if (!flow.nodes[answer.next]) break;
    currentId = answer.next;
  }
  return { path, currentId, stopped };
}

/** Wykluczenia zebrane z odpowiedzi na dotychczasowej ścieżce. */
export function collectExclusions(flow: Flow, path: PathStep[]): string[] {
  const out: string[] = [];
  for (const step of path) {
    const node = flow.nodes[step.nodeId];
    if (!node || node.kind === 'result') continue;
    for (const item of node.answers.find(a => a.id === step.answerId)?.excludes ?? []) if (!out.includes(item)) out.push(item);
  }
  return out;
}

/** Komunikaty bezpieczeństwa widoczne dla użytkownika: tylko parafrazy źródła, nigdy propozycje. */
export function visibleSafety(node: FlowNode): string | null {
  return node.safety && node.safety.form === 'parafraza źródła' ? node.safety.text : null;
}

export function visibleStop(node: FlowNode): string | null {
  return node.stop && node.stop.form === 'parafraza źródła' ? node.stop.text : null;
}

export function nextNodeId(node: FlowNode, answerId: string): string | null {
  if (node.kind === 'result') return null;
  return node.answers.find(a => a.id === answerId)?.next ?? null;
}

const needsSource = (node: FlowNode): boolean => {
  if (node.kind === 'check') return true;
  if (node.kind === 'result') return node.outcome !== 'nierozstrzygnięte';
  return !node.neutral;
};

/** Zwraca listę błędów; pusta lista = ścieżka poprawna. */
export function validateFlow(flow: Flow): string[] {
  const errors: string[] = [];
  const nodes = flow.nodes ?? {};
  const ids = Object.keys(nodes);
  const err = (msg: string) => errors.push(`${flow.id}: ${msg}`);
  if (!flow.id || !flow.symptomId || !flow.title) err('brak id, symptomId lub tytułu');
  if (!Array.isArray(flow.scope) || flow.scope.length === 0) err('brak zakresu wersji auta');
  if (!nodes[flow.start]) err(`węzeł startowy ${flow.start} nie istnieje`);

  for (const id of ids) {
    const node = nodes[id];
    const at = `węzeł ${id}`;
    if (node.id !== id) err(`${at}: id niezgodne z kluczem`);
    if (!node.title || !node.text) err(`${at}: brak tytułu lub treści`);
    if (!Array.isArray(node.parts) || node.parts.length > 0) err(`${at}: pole parts musi być puste w tym etapie`);
    if (!['question', 'check', 'result'].includes(node.kind)) { err(`${at}: nieznany rodzaj`); continue; }
    if (needsSource(node) && (!Array.isArray(node.sources) || node.sources.length === 0)) err(`${at}: twierdzenie diagnostyczne bez źródła`);
    for (const s of node.sources ?? []) {
      if (!s.label || !/^https?:\/\//.test(s.url)) err(`${at}: źródło bez etykiety lub poprawnego adresu`);
      if (!(SOURCE_KINDS as readonly string[]).includes(s.kind)) err(`${at}: nieznany rodzaj źródła ${s.kind}`);
      if (s.applicability !== 'ustalona' && s.applicability !== 'nieustalona') err(`${at}: brak statusu stosowalności źródła`);
      if (!s.applicabilityNote || !s.scope) err(`${at}: brak uzasadnienia stosowalności lub zakresu źródła`);
      if (s.applicability === 'ustalona' && !(Array.isArray(s.vehicleScope) && s.vehicleScope.length > 0)) err(`${at}: źródło o ustalonej stosowalności bez zakresu wersji aut (vehicleScope)`);
      if (Object.keys(s).some(k => !['label', 'url', 'kind', 'applicability', 'applicabilityNote', 'scope', 'vehicleScope'].includes(k))) err(`${at}: źródło ma nieznane pole (wynik diagnostyczny nie należy do źródła)`);
    }
    if (node.safety) {
      if (!node.safety.text) err(`${at}: pusty komunikat bezpieczeństwa`);
      if (!['parafraza źródła', 'propozycja do akceptacji'].includes(node.safety.form)) err(`${at}: nieznana forma komunikatu bezpieczeństwa`);
      if (!node.sources?.length) err(`${at}: komunikat bezpieczeństwa bez źródła`);
    }
    if (node.stop) {
      if (!node.stop.text) err(`${at}: pusty komunikat stop`);
      if (!['parafraza źródła', 'propozycja do akceptacji'].includes(node.stop.form)) err(`${at}: nieznana forma komunikatu stop`);
      if (!node.sources?.length) err(`${at}: komunikat stop bez źródła`);
    }
    if (node.kind !== 'question' && (node as { versionIndependent?: boolean }).versionIndependent) err(`${at}: tylko pytanie może być niezależne od wersji`);
    if (node.kind === 'question' && node.versionIndependent && (!node.neutral || node.requires?.length || node.safety || node.stop || node.answers?.some(a => a.stop || a.excludes?.length))) err(`${at}: niezależne od wersji może być tylko neutralne pytanie bez wymagań, bezpieczeństwa, stopu i wykluczeń`);
    if (node.kind === 'result') {
      if (!(DIAGNOSTIC_OUTCOMES as readonly string[]).includes(node.outcome)) err(`${at}: nieznany wynik diagnostyczny ${String(node.outcome)}`);
    } else {
      if (!Array.isArray(node.answers) || node.answers.length === 0) err(`${at}: brak odpowiedzi`);
      for (const a of node.answers ?? []) {
        if (a.stop) {
          if (!node.stop?.text) err(`${at}: odpowiedź ${a.id} zatrzymuje ścieżkę, ale węzeł nie ma komunikatu stop`);
        } else if (!nodes[a.next]) err(`${at}: odpowiedź ${a.id} prowadzi do nieistniejącego węzła ${a.next}`);
        if (a.excludes?.length && !node.sources?.length) err(`${at}: wykluczenie bez źródła`);
      }
      if (node.kind === 'check' && !['każdy', 'z narzędziami', 'warsztat'].includes(node.level)) err(`${at}: nieznany poziom sprawdzenia`);
    }
  }

  // Osiągalność z węzła startowego, cykle i zakończenia.
  if (nodes[flow.start]) {
    const state = new Map<string, 'visiting' | 'done'>();
    let cyclic = false;
    const visit = (id: string) => {
      const mark = state.get(id);
      if (mark === 'visiting') { cyclic = true; return; }
      if (mark === 'done' || !nodes[id]) return;
      state.set(id, 'visiting');
      const n = nodes[id];
      if (n.kind !== 'result') for (const a of n.answers ?? []) if (!a.stop) visit(a.next);
      state.set(id, 'done');
    };
    visit(flow.start);
    if (cyclic) err('ścieżka zawiera pętlę');
    for (const id of ids) if (!state.has(id)) err(`węzeł ${id} jest nieosiągalny`);
  }
  return errors;
}
