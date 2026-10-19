const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const workflowDir = path.resolve('.github/workflows');
const files = fs.readdirSync(workflowDir).filter(name => /\.ya?ml$/.test(name));

test('every workflow has a name, trigger and explicit permissions', () => {
  assert.ok(files.length > 0);
  for (const name of files) {
    const source = fs.readFileSync(path.join(workflowDir, name), 'utf8');
    assert.doesNotMatch(source, /\t/, `${name} uses tab indentation`);
    assert.match(source, /^name:/m, `${name} lacks a name`);
    assert.match(source, /^on:/m, `${name} lacks a trigger`);
    assert.match(source, /^permissions:/m, `${name} lacks explicit permissions`);
  }
});

test('quality gate has least-privilege permissions', () => {
  const source = fs.readFileSync(path.join(workflowDir, 'quality-gate.yml'), 'utf8');
  assert.match(source, /permissions:\n\s+contents: read/);
  assert.doesNotMatch(source, /contents: write/);
});
