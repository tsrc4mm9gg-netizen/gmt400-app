const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { analyze, selfTest } = require('./check-frontend-quality.cjs');
selfTest();
const names = { query: 'Szukaj w bieżącej sekcji', codeQuery: 'Szukaj kodu OBD', issueQuery: 'Szukaj usterki', issueModel: 'Model pojazdu — filtr usterek', issueYear: 'Rocznik pojazdu — filtr usterek', diyQuery: 'Szukaj porady DIY', schemaQuery: 'Szukaj schematu', vinInput: 'Numer VIN do dekodowania', selectedEngine: 'Silnik — specyfikacje', partsQuery: 'Szukaj części', tuningQuery: 'Szukaj modyfikacji', fuelKm: 'Przejechany dystans (km)', fuelLiters: 'Zużyte paliwo (litry)', fuelPrice: 'Cena paliwa (PLN za litr)', myVin: 'Numer VIN mojego auta', vin: 'Numer VIN pojazdu' };
const files = ['src/app/page.tsx', 'src/app/narzedzia/historia-vin/page.tsx'];
const outputs = [];
let fields = 0, actions = 0, schemas = 0;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  assert.equal(tree.parseDiagnostics.length, 0);
  const findings = analyze(source, file);
  const unlabeled = new Set(findings.filter(item => item.endsWith('form control without accessible label')).map(item => Number(item.split(':')[1])));
  const edits = [];
  const add = (start, end, text) => edits.push({ start, end, text });
  const attr = (node, name) => node.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(tree) === name);
  const expression = attribute => attribute?.initializer && ts.isJsxExpression(attribute.initializer) ? attribute.initializer.expression?.getText(tree) : null;
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(tree);
      const line = tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1;
      if (['input', 'select', 'textarea'].includes(tag) && unlabeled.has(line)) {
        const state = expression(attr(node, 'value'));
        assert(names[state], 'Unreviewed form field: ' + state);
        if (file.includes('historia-vin')) {
          assert(ts.isJsxSelfClosingElement(node));
          assert(!attr(node, 'id'));
          const input = source.slice(node.getStart(tree), node.end).replace('<input', '<input id="history-vin"');
          add(node.getStart(tree), node.end, '<div className="min-w-0 flex-1"><label htmlFor="history-vin" className="mb-2 block text-sm font-medium">Numer VIN pojazdu</label>' + input + '</div>');
        } else {
          assert(!attr(node, 'aria-label'));
          add(node.tagName.end, node.tagName.end, ' aria-label=' + JSON.stringify(names[state]));
        }
        fields++;
      }
      const click = attr(node, 'onClick');
      const handler = expression(click) || '';
      if (tag === 'div' && handler.includes('setLightbox(null)')) {
        assert(ts.isJsxElement(node.parent));
        add(node.parent.getStart(tree), node.parent.end, '<ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />');
        actions++;
      } else if (tag === 'div' && handler.includes("setSelectedModel('Wszystkie')") && handler.includes("setTab('modele')")) {
        const parent = node.parent;
        assert(ts.isJsxElement(parent));
        const logo = parent.children.find(child => ts.isJsxElement(child) && child.openingElement.tagName.getText(tree) === 'span');
        assert(logo);
        add(click.getStart(tree), click.end, '');
        add(logo.getStart(tree), logo.getStart(tree), '<button type="button" aria-label="GMT400 — strona główna" className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400" ' + click.getText(tree) + '>');
        add(logo.end, logo.end, '</button>');
        actions++;
      } else if (tag === 'span' && handler === "() => setTab('modele')") {
        assert(ts.isJsxElement(node.parent));
        add(node.tagName.getStart(tree), node.tagName.end, 'button type="button"');
        const closing = node.parent.closingElement.tagName;
        add(closing.getStart(tree), closing.end, 'button');
        actions++;
      }
      if (tag === 'img' && handler.includes('setLightbox(')) {
        assert(ts.isJsxSelfClosingElement(node));
        const image = source.slice(node.getStart(tree), click.getStart(tree)) + source.slice(click.end, node.end);
        add(node.getStart(tree), node.end, '<button type="button" aria-label="Powiększ ilustrację" className="block w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400" ' + click.getText(tree) + '>' + image + '</button>');
      }
      if (tag === 'button' && handler.includes('setShowSearch(!showSearch)') && !attr(node, 'aria-label')) add(node.tagName.end, node.tagName.end, ' aria-label="Otwórz wyszukiwarkę"');
      if (tag === 'button' && handler.includes('setDarkMode(!darkMode)') && !attr(node, 'aria-label')) add(node.tagName.end, node.tagName.end, ' aria-label="Przełącz motyw"');
      if (tag === 'script' && attr(node, 'dangerouslySetInnerHTML')) {
        const dangerous = attr(node, 'dangerouslySetInnerHTML').initializer.expression;
        assert(ts.isObjectLiteralExpression(dangerous) && dangerous.properties.length === 1);
        const call = dangerous.properties[0].initializer;
        assert(ts.isCallExpression(call) && call.expression.getText(tree) === 'JSON.stringify' && call.arguments.length === 1);
        const object = call.arguments[0];
        assert(ts.isObjectLiteralExpression(object));
        const data = {};
        for (const property of object.properties) {
          assert(ts.isPropertyAssignment(property) && ts.isStringLiteral(property.name) && ts.isStringLiteral(property.initializer));
          data[property.name.text] = property.initializer.text;
        }
        assert.equal(data['@type'], 'WebSite');
        assert.equal(data.url, 'https://gmt400.pl');
        const json = JSON.stringify(data).replace(/</g, '\\u003c');
        add(node.getStart(tree), node.end, '<script type="application/ld+json">{' + JSON.stringify(json) + '}</script>');
        schemas++;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  let text = source, boundary = source.length;
  for (const edit of edits.sort((a, b) => b.start - a.start || b.end - a.end)) {
    assert(edit.end <= boundary, 'Overlapping source edits');
    text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
    boundary = edit.start;
  }
  if (file === 'src/app/page.tsx') text = text.replace("'use client';", "'use client';\nimport ImageLightbox from './ImageLightbox';");
  assert.deepEqual(analyze(text, file), [], 'Remaining static findings in ' + file);
  outputs.push([file, text]);
}
assert.equal(fields, 16, 'Unexpected field count');
assert.equal(actions, 3, 'Unexpected interactive element count');
assert.equal(schemas, 1, 'Unexpected structured data count');
for (const [file, text] of outputs) fs.writeFileSync(file, text);
console.log(JSON.stringify({ fields, actions, schemas, files: outputs.map(([file]) => file) }));
