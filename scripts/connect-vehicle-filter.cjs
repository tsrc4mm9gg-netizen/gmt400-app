const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const path = 'src/app/page.tsx';
const b = fs.readFileSync(path);
assert.equal(crypto.createHash('sha1').update(Buffer.from('blob ' + b.length + '\0')).update(b).digest('hex'), 'c773653c53dca6a180c1d3c0e3905daa17cd91dc', 'Source changed; stop rather than overwrite');
let s = b.toString('utf8');
function replaceOnce(before, after) { assert.equal(s.split(before).length - 1, 1, 'Unexpected anchor: ' + before); s = s.replace(before, after); }
replaceOnce("import { useState, useEffect, useMemo } from 'react';", "import { useState, useEffect, useMemo } from 'react';\nimport { useVehicleMaterialFilter, VehicleMatchBadge } from './VehicleMaterialFilter';\nimport type { Applicability } from '../lib/vehicle-compatibility';");
replaceOnce('type Item = {', 'type Item = {\n  applicability?: Applicability;');
replaceOnce('  const [items, setItems] = useState<Item[]>([]);', '  const [items, setItems] = useState<Item[]>([]);\n  const { visibleItems, panel: vehicleFilterPanel } = useVehicleMaterialFilter(items);');
for (const [name, kind] of [['issues', 'Usterka'], ['codes', 'Kod błędu'], ['tips', 'Porada']]) {
  replaceOnce(`const ${name} = useMemo(() => items.filter(i => i.Typ === '${kind}'), [items]);`, `const ${name} = useMemo(() => visibleItems.filter(i => i.Typ === '${kind}'), [visibleItems]);`);
}
replaceOnce('<div id="content" className="max-w-7xl mx-auto px-4 py-8">', '<div id="content" className="max-w-7xl mx-auto px-4 py-8">\n        {[\'usterki\', \'kody\', \'diy\', \'schematy\'].includes(tab) && vehicleFilterPanel}');
for (const name of ['c', 'i', 't']) {
  const anchor = `{${name}.Nazwa}</h3>`;
  const expected = name === 't' ? 2 : 1;
  assert.equal(s.split(anchor).length - 1, expected);
  s = s.split(anchor).join(anchor + `\n                      <VehicleMatchBadge item={${name}} />`);
}
fs.writeFileSync(path, s);
const provider = 'src/app/VehicleProfileProvider.tsx';
let p = fs.readFileSync(provider, 'utf8');
const before = 'Etap 1: wspólny zapis konfiguracji. Filtrowanie artykułów nie jest jeszcze włączone. Zapisany profil nie potwierdza dopasowania części.';
assert.equal(p.split(before).length - 1, 1);
p = p.replace(before, 'Profil jest dostępny dla filtrów usterek, kodów OBD, poradników i schematów z Notion. Widok Wszystkie nie ogranicza materiałów. Katalog statycznych części i specyfikacje nie są jeszcze filtrowane.');
fs.writeFileSync(provider, p);
