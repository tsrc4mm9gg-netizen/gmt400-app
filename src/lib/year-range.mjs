const UNIVERSAL = new Set(['wszystkie', 'wszystkie modele', 'ogolne', 'all']);
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/gi, 'l').trim().toLowerCase();
const validYear = value => Number.isInteger(value) && value >= 1000 && value <= 9999;

export function parseYearRule(value) {
  if (typeof value !== 'string') return null;
  const text = normalize(value);
  if (UNIVERSAL.has(text)) return { from: 1000, to: 9999 };
  let match = text.match(/^(\d{4})$/);
  if (match) return { from: Number(match[1]), to: Number(match[1]) };
  match = text.match(/^(\d{4})\s*[-–—]\s*(\d{4})$/);
  if (match) {
    const from = Number(match[1]), to = Number(match[2]);
    return from <= to ? { from, to } : null;
  }
  match = text.match(/^(\d{4})\s*\+$/);
  return match ? { from: Number(match[1]), to: 9999 } : null;
}

export function matchesYearRule(year, rule) {
  const value = typeof year === 'string' && /^\d{4}$/.test(year.trim()) ? Number(year.trim()) : year;
  if (!validYear(value)) return null;
  const parsed = parseYearRule(rule);
  return parsed ? value >= parsed.from && value <= parsed.to : null;
}

export function matchesYearRules(year, rules) {
  if (!Array.isArray(rules) || !rules.length) return null;
  const results = rules.map(rule => matchesYearRule(year, rule));
  if (results.includes(true)) return true;
  return results.includes(null) ? null : false;
}

export function matchesNumericYears(year, years) {
  if (!Array.isArray(years) || !years.length) return null;
  const value = typeof year === 'string' && /^\d{4}$/.test(year.trim()) ? Number(year.trim()) : year;
  if (!validYear(value) || !years.every(validYear)) return null;
  if (years.length === 2) {
    const [from, to] = years;
    return from <= to ? value >= from && value <= to : null;
  }
  return years.includes(value);
}
