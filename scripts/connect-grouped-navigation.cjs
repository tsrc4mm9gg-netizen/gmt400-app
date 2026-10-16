const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const path = 'src/app/page.tsx';
const bytes = fs.readFileSync(path);
assert.equal(crypto.createHash('sha1').update(Buffer.from('blob ' + bytes.length + '\0')).update(bytes).digest('hex'), '9e9314c34ad14c66a046fb0c3eae3bfc54b3194a', 'Unexpected page version; refusing overwrite');
let text = bytes.toString('utf8');
const anchor = "import { useState, useEffect, useMemo } from 'react';";
assert.equal(text.split(anchor).length - 1, 1);
text = text.replace(anchor, anchor + "\nimport GroupedNavigation from './GroupedNavigation';");
const pattern = /\{CATEGORIES\.map\(\(cat\) => \([\s\S]*?<\/button>\s*\)\)\}/g;
assert.equal((text.match(pattern) || []).length, 2, 'Expected both navigation lists');
let index = 0;
text = text.replace(pattern, () => ++index === 1
  ? '<GroupedNavigation categories={CATEGORIES} active={tab} instance="menu" onSelect={(id) => { setTab(id); setMenuOpen(false); }} />'
  : '<GroupedNavigation categories={CATEGORIES} active={tab} instance="sections" onSelect={setTab} />');
const button = '<button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>';
assert.equal(text.split(button).length - 1, 1);
text = text.replace(button, '<button className="text-white" aria-label={menuOpen ? \'Zamknij menu\' : \'Otwórz menu\'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>');
assert.equal((text.match(/<GroupedNavigation /g) || []).length, 2);
fs.writeFileSync(path, text);
