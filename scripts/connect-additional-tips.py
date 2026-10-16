from pathlib import Path
import re
p = Path('src/app/page.tsx')
s = p.read_text()
anchor = "import { useState, useEffect, useMemo } from 'react';"
assert s.count(anchor) == 1 and 'AdditionalTips' not in s, 'Unexpected imports'
start = s.index("{tab === 'tips' && (")
match = re.search(r'<h2[^>]*[^<]*>TIPS & TRICKS</h2>', s[start:])
assert match, 'Tips heading not found'
pos = start + match.end()
s = s[:pos] + '\n            <AdditionalTips />' + s[pos:]
s = s.replace(anchor, anchor + "\nimport AdditionalTips from './AdditionalTips';", 1)
p.write_text(s)
