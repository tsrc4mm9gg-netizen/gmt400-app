from pathlib import Path
import hashlib
p = Path('src/app/page.tsx')
b = p.read_bytes()
assert hashlib.sha1(b'blob ' + str(len(b)).encode() + b'\0' + b).hexdigest() == 'aba8005190d342d575525274e90e486c1c802188', 'Source changed; refusing to overwrite'
s = b.decode()
s = s.replace("import { useState, useEffect, useMemo } from 'react';", "import { useState, useEffect, useMemo } from 'react';\nimport VinHistorySummary from './VinHistorySummary';", 1)
a = s.index('// Check for warning conditions')
z = s.index('if (hasWarning) playGong();', a) + len('if (hasWarning) playGong();')
s = s[:a] + 'setVinWarning(false);' + s[z:]
a = s.index('                <div className="flex items-center justify-between mb-3">', s.index("{tab === 'vin'"))
z = s.index('                <h4 className="font-semibold text-amber-400 mb-2">POWIĄZANE INFORMACJE', a)
s = s[:a] + '''                <h3 className="font-semibold text-amber-400 mb-3">HISTORIA I ZDJĘCIA TEGO VIN</h3>
                <VinHistorySummary key={vinResult.VIN} vin={vinResult.VIN} />

''' + s[z:]
assert 'Lot #12345' not in s
assert 'Math.random() > 0.7' not in s
assert s.count('<VinHistorySummary') == 1
p.write_text(s)
