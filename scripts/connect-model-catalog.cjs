// Structural check that the grouped model catalog is wired into the app.
// History: this script used to PATCH src/app/page.tsx once, guarded by a hard-coded
// git blob hash of that file. The integration landed on 16.10 (02cb13d); later page.tsx
// was split into Encyclopedia.tsx + routes (/modele, /modele/[id]), so the hash could
// never match again. It now only verifies structure and never writes files.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const read = file => fs.readFileSync(file, 'utf8');
const appDir = 'src/app';
const sources = fs.readdirSync(appDir).filter(name => /\.tsx$/.test(name)).map(name => path.join(appDir, name));

assert(fs.existsSync('src/app/ModelCatalog.tsx'), 'ModelCatalog component is missing');
assert.match(read('src/app/ModelCatalog.tsx'), /export default function ModelCatalog\b/, 'ModelCatalog default export is missing');
assert.match(read('src/lib/model-catalog.ts'), /export function groupModels\b/, 'groupModels() is missing');

const hosts = sources.filter(file => /import ModelCatalog from '\.\/ModelCatalog'/.test(read(file)) && /tab === 'modele' && <ModelCatalog\b/.test(read(file)));
assert(hosts.length >= 1, 'ModelCatalog is not rendered for the "modele" tab in any src/app component');

assert(fs.existsSync('src/app/modele/page.tsx'), '/modele route is missing');
assert.match(read('src/app/modele/page.tsx'), /initialTab="modele"/, '/modele route does not open the model catalog');
assert(fs.existsSync('src/app/modele/[id]/page.tsx'), '/modele/[id] route is missing');

console.log(`Model catalog wired in: ${hosts.join(', ')}; routes /modele and /modele/[id] present.`);
