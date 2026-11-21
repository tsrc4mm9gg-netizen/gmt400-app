import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const svgDir = path.join(root, 'public/rozpoznawanie');
const svgs = ['przod-1988-93.svg', 'przod-1994-98.svg', 'deska-1988-94-i-1995-98.svg'];

const page = fs.readFileSync(path.join(root, 'src/app/podglad-rysunkow/page.tsx'), 'utf8');

describe('strona podglądu rysunków', () => {
  it('jest noindex i nofollow', () => {
    expect(page).toMatch(/robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  });

  it('pokazuje trzy rysunki i listę zastrzeżeń', () => {
    for (const svg of svgs) expect(page).toContain(`/rozpoznawanie/${svg}`);
    expect(page).toContain('Co rysunek NIE twierdzi');
  });
});

describe('pliki SVG', () => {
  for (const svg of svgs) {
    it(`${svg} jest samodzielny i bezpieczny`, () => {
      const content = fs.readFileSync(path.join(svgDir, svg), 'utf8');
      expect(content).toContain('<title');
      expect(content).toContain('<desc');
      expect(content).toContain('Schemat poglądowy, nie zdjęcie');
      expect(content).toContain('viewBox=');
      expect(content).not.toMatch(/<image\b/i);
      expect(content).not.toMatch(/<script\b/i);
      expect(content).not.toMatch(/https?:\/\//i);
      expect(content).not.toMatch(/xlink:href/i);
    });
  }
});
