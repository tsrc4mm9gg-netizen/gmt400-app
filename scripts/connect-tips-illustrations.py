from pathlib import Path
import re

p = Path('src/app/page.tsx')
s = p.read_text()
start = s.index("{tab === 'tips' && (")
wrapper = '<div className="bg-neutral-950 border border-white/10 p-4 mb-4">'
h3 = '3. SPRAWDŹ PRZEŁOŻENIE OSI BEZ ROZBIERANIA'
h4 = '4. UKRYTY KLUCZ POD ZDERZAKIEM'
assert s.count(h3) == 1 and s.count(h4) == 1, 'Unexpected tip headings'
a = s.rfind(wrapper, start, s.index(h3))
b = s.rfind(wrapper, start, s.index(h4))
assert start < a < b and 'Obróć oponę o 1 pełny obrót' in s[a:b], 'Unexpected axle tip; refusing to edit'
card = '''<div className="bg-neutral-950 border border-white/10 p-4 mb-4">
              <h3 className="font-semibold text-amber-400 mb-2">3. SPRAWDŹ PRZEŁOŻENIE OSI BEZ ROZBIERANIA</h3>
              <button type="button" onClick={() => setLightbox('/tip-axle-ratio-guide.svg')} aria-label="Powiększ schemat testu przełożenia" className="block w-full my-4"><img src="/tip-axle-ratio-guide.svg" alt="Otwarty mechanizm: jedno koło nieruchome, drugie dwa obroty; liczymy obroty wału" className="w-full h-auto" /></button>
              <p className="text-sm text-neutral-300 mb-2">Najpierw odczytaj RPO. Jeśli most był zmieniany, kod może nie odpowiadać obecnemu przełożeniu.</p>
              <p className="text-sm text-amber-200 mb-2">Próba wymaga rozpoznania mechanizmu i bezpiecznego podparcia auta. Równe, twarde podłoże, kliny pod kołami pozostającymi na ziemi i podpory o odpowiedniej nośności w punktach zalecanych przez producenta. Nie pracuj pod autem opartym wyłącznie na podnośniku. Silnik wyłączony; koła obracaj tylko ręcznie. Zabezpiecz auto przed przetoczeniem przed ustawieniem skrzyni w N i zwolnieniem hamulca postojowego. Jeśli nie potrafisz bezpiecznie przygotować auta, zleć próbę warsztatowi.</p>
              <ul className="text-sm text-neutral-300 space-y-2 list-disc list-inside">
                <li>Otwarty mechanizm, drugie koło nieruchome: oznacz oponę i wał, obróć swobodne koło o dwa pełne obroty i policz obroty wału.</li>
                <li>Gdy oba koła rzeczywiście obracają się razem w tę samą stronę: jeden pełny obrót obu kół odpowiada liczbie obrotów wału równej przełożeniu. Nie zakładaj automatycznie takiego zachowania przy każdym mechanizmie z blokadą.</li>
                <li>Przykładowo około 3,73 obrotu wału oznacza około 3,73:1. To oszacowanie, nie dokładny pomiar liczby zębów.</li>
              </ul>
              <p className="text-xs text-neutral-400 mt-3">Schemat poglądowy, bez wskazania punktów podparcia. <a href="https://differentials.com/technical-help-2/differential-faqs/" target="_blank" rel="noopener noreferrer" className="underline">Źródło: West Coast Differentials — What gear ratio do I have?</a></p>
            </div>

            '''
s = s[:a] + card + s[b:]
pattern = r'(<h3[^>]*>5\. KODY RPO W SCHOWKU</h3>)'
assert len(re.findall(pattern, s)) == 1, 'Unexpected RPO heading'
figure = '''
              <button type="button" onClick={() => setLightbox('/tip-rpo-guide.svg')} aria-label="Powiększ schemat naklejki RPO" className="block w-full my-4"><img src="/tip-rpo-guide.svg" alt="Schemat schowka pasażera i przykładowej naklejki: GT4 oznacza przełożenie 3,73" className="w-full h-auto" /></button>
              <p className="text-xs text-neutral-400 mb-3">Schemat lokalizacji jest poglądowy. Kody na ilustracji są przykładem, nie danymi Twojego auta. RPO opisuje wyposażenie fabryczne, nie późniejsze przeróbki. <a href="https://differentials.com/gm-axle-ratio-identification-codes/" target="_blank" rel="noopener noreferrer" className="underline">Źródło kodów przełożeń</a></p>'''
s = re.sub(pattern, lambda m: m.group(1) + figure, s, count=1)
assert s.count('/tip-rpo-guide.svg') == 2 and s.count('/tip-axle-ratio-guide.svg') == 2
p.write_text(s)
