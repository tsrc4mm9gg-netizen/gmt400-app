from pathlib import Path
import re

p = Path('src/app/page.tsx')
s = p.read_text()
start = "{tab === 'kalkulator' && ("
end = "{tab === 'porownaj' && ("
assert s.count(start) == 1 and s.count(end) == 1, 'Unexpected section markers; refusing to edit'
a, b = s.index(start), s.index(end)
old = s[a:b]
assert b > a and 'KALKULATOR KOSZTÓW NAPRAWY' in old and 'value={repairType}' in old, 'Unexpected calculator; refusing to edit'
assert re.search(r'\)\}\s*$', old), 'Unexpected section ending'
replacement = "{tab === 'kalkulator' && (<div><button onClick={() => shareSection('kalkulator')} className=\"text-sm text-neutral-400 mb-4\">Udostępnij</button><RepairCostCalculator /></div>)}\n\n        "
s = s[:a] + replacement + s[b:]
anchor = "import { useState, useEffect, useMemo } from 'react';"
assert s.count(anchor) == 1, 'Unexpected import anchor'
s = s.replace(anchor, anchor + "\nimport RepairCostCalculator from './RepairCostCalculator';", 1)
s = s.replace("  const [repairType, setRepairType] = useState('uszczelka');\n", '', 1)
assert 'setRepairType' not in s and 'repairType' not in s, 'Unexpected references remain'
p.write_text(s)
