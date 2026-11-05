const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file) {
  const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const module = { exports: {} };
  new Function('exports', 'module', 'require', js)(module.exports, module, require);
  return module.exports;
}

const { vehicleIdFromProfile } = load('src/lib/vehicle-id.ts');
const profile = {
  brand: 'Chevrolet',
  platform: 'C/K',
  model: 'K1500',
  year: '1996',
  engine: 'L31',
  drive: '4WD',
  transmission: '4L60E',
  rpoCodes: ['G80', 'Z71'],
};

test('tworzy stabilny identyfikator dla tej samej konfiguracji', () => {
  assert.equal(vehicleIdFromProfile(profile), vehicleIdFromProfile({ ...profile }));
});

test('odróżnia auta po konfiguracji', () => {
  const other = { ...profile, year: '1997' };
  assert.notEqual(vehicleIdFromProfile(profile), vehicleIdFromProfile(other));
});

test('uwzględnia VIN, jeśli został podany', () => {
  const withVin = { ...profile, vin: '1GCEK14Z8TZ123456' };
  assert.notEqual(vehicleIdFromProfile(profile), vehicleIdFromProfile(withVin));
});
