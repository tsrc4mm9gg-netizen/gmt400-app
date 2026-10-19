const fs = require('node:fs');
const assert = require('node:assert/strict');
const counts = { 'knowledge-verification': 1, 'legacy-costs': 2, lighthouse: 1, 'maintenance-regression': 1, 'material-images': 2, 'material-outline': 2, 'material-text': 2, 'mobile-webkit': 1, 'model-catalog': 1, 'navigation-context': 1, 'navigation-layout': 1, 'notion-content': 1, 'parts-regression': 1, 'production-tools-browser': 1, 'restore-diy': 1, 'search-pagination': 1, 'search-semantics': 1, 'search-session': 1, 'tools-audit': 1, 'tools-regression': 1, 'vehicle-filter-browser-tests': 1, 'viewport-accessibility': 1 };
const updates = new Map();
let total = 0;
for (const [name, expected] of Object.entries(counts)) {
  const file = '.github/workflows/' + name + '.yml';
  const source = fs.readFileSync(file, 'utf8');
  assert(!source.includes('gmt_loop_attempt'), 'Unexpected existing counter in ' + file);
  let actual = 0;
  const text = source.replace(/^( *)for i in (\$\(seq 1 \d+\)|1 2 3 4); do\n([\s\S]*?)^\1done$/gm, (match, indent, range, body) => {
    assert(!body.includes('$i') && !body.includes('${i'), 'Counter is used; manual review required in ' + file);
    actual++;
    return indent + 'for gmt_loop_attempt in ' + range + '; do\n' + indent + '  printf \'Attempt %s\\n\' "$gmt_loop_attempt"\n' + body + indent + 'done';
  });
  assert.equal(actual, expected, 'Unexpected loop count in ' + file);
  total += actual;
  updates.set(file, text);
}
assert.equal(total, 26);
for (const name of ['editorial-links', 'workflow-lint']) {
  const file = '.github/workflows/' + name + '.yml';
  const source = fs.readFileSync(file, 'utf8');
  const before = "echo 'Commit: `${{ github.sha }}`'";
  assert.equal(source.split(before).length, 2, 'Missing summary anchor in ' + file);
  updates.set(file, source.replace(before, "printf 'Commit: %s\\n' \"$GITHUB_SHA\""));
}
const tools = '.github/workflows/tools-regression.yml';
const before = [
  "          echo '### Tools and navigation verification' >> \"$GITHUB_STEP_SUMMARY\"",
  "          echo 'Commit: ${{ github.sha }}' >> \"$GITHUB_STEP_SUMMARY\"",
  "          echo 'Job status: ${{ job.status }}' >> \"$GITHUB_STEP_SUMMARY\"",
  "          echo 'Local production build, mocked Notion for launcher test; not a live deployment check. Logs are attached as artifacts.' >> \"$GITHUB_STEP_SUMMARY\""
].join('\n');
assert.equal(updates.get(tools).split(before).length, 2, 'Missing tools summary anchor');
const after = [
  '          {',
  "            echo '### Tools and navigation verification'",
  "            echo 'Commit: ${{ github.sha }}'",
  "            echo 'Job status: ${{ job.status }}'",
  "            echo 'Local production build, mocked Notion for launcher test; not a live deployment check. Logs are attached as artifacts.'",
  '          } >> "$GITHUB_STEP_SUMMARY"'
].join('\n');
updates.set(tools, updates.get(tools).replace(before, after));
for (const [file, text] of updates) fs.writeFileSync(file, text);
console.log(JSON.stringify({ loops: total, quoteFixes: 2, redirectFixes: 1, files: [...updates.keys()] }, null, 2));
