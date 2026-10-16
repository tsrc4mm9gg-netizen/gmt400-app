const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const hash = bytes => crypto.createHash('sha1').update(Buffer.from('blob ' + bytes.length + '\0')).update(bytes).digest('hex');
const pagePath = 'src/app/page.tsx';
const pageBytes = fs.readFileSync(pagePath);
let page = pageBytes.toString('utf8');
if (!page.includes('const [tab, setTab] = useSectionNavigation(')) {
  assert.equal(hash(pageBytes), '771518584ce23c4f61f72a4e2e430ee2f7d7c767', 'Unexpected page version; refusing overwrite');
  const anchor = "import GroupedNavigation from './GroupedNavigation';";
  assert.equal(page.split(anchor).length - 1, 1);
  page = page.replace(anchor, anchor + "\nimport useSectionNavigation from './useSectionNavigation';");
  const state = /  const \[tab, setTab\] = useState\(\(\) => \{[\s\S]*?\n  \}\);/;
  assert.equal((page.match(new RegExp(state.source, 'g')) || []).length, 1);
  page = page.replace(state, '  const [tab, setTab] = useSectionNavigation(CATEGORIES.map(category => category.id));');
  const persistence = "  useEffect(() => {\n    localStorage.setItem('gmt400_tab', tab);\n  }, [tab]);";
  assert.equal(page.split(persistence).length - 1, 1);
  page = page.replace(persistence, '');
  fs.writeFileSync(pagePath, page);
}
const filterPath = 'src/app/VehicleMaterialFilter.tsx';
const filterBytes = fs.readFileSync(filterPath);
let filter = filterBytes.toString('utf8');
if (!filter.includes('const panel = <CompactVehicleFilterPanel ')) {
  assert.equal(hash(filterBytes), '60a74017958d30dce0954498aa5225e3bec9e17c', 'Unexpected filter version; refusing overwrite');
  const anchor = "import { useVehicleProfile } from './VehicleProfileProvider';";
  assert.equal(filter.split(anchor).length - 1, 1);
  filter = filter.replace(anchor, anchor + "\nimport CompactVehicleFilterPanel from './CompactVehicleFilterPanel';");
  const start = filter.indexOf('  const panel = <section');
  const end = filter.indexOf('  return { visibleItems, panel };', start);
  assert(start >= 0 && end > start);
  assert(filter.slice(start,end).includes('vehicle-profile-launcher'));
  filter = filter.slice(0,start) + '  const panel = <CompactVehicleFilterPanel profile={profile} active={active} mode={mode} counts={counts} onModeChange={setMode} />;\n' + filter.slice(end);
  fs.writeFileSync(filterPath, filter);
}
const vehicleTest = 'tests/vehicle-filters.spec.cjs';
let vehicle = fs.readFileSync(vehicleTest,'utf8');
const panel = "  const panel = page.getByRole('region', { name: 'Filtrowanie według profilu auta' });";
const expand = "\n  await panel.getByRole('button', { name: 'Filtry zaawansowane', exact: true }).click();";
if (!vehicle.includes(expand.trim())) { assert.equal(vehicle.split(panel).length - 1,1); vehicle = vehicle.replace(panel,panel + expand); fs.writeFileSync(vehicleTest,vehicle); }
const categoryTest = 'tests/knowledge-categories.spec.cjs';
let category = fs.readFileSync(categoryTest,'utf8');
const assertion = "  await expect(panel.getByRole('button', { name: 'Zgodne z zakresem (0)', exact: true })).toBeVisible();";
if (!category.includes(expand.trim())) { assert.equal(category.split(assertion).length - 1,1); category = category.replace(assertion,expand.trimStart() + '\n' + assertion); fs.writeFileSync(categoryTest,category); }
