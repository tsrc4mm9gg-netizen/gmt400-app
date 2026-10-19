#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
function analyze(source, file) {
  const kind = /\.tsx$/.test(file) ? ts.ScriptKind.TSX : /\.jsx$/.test(file) ? ts.ScriptKind.JSX : /\.ts$/.test(file) ? ts.ScriptKind.TS : ts.ScriptKind.JS;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  const findings = [];
  const elements = [];
  const report = (node, message) => findings.push(`${file}:${tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1}: ${message}`);
  for (const diagnostic of tree.parseDiagnostics) {
    const line = tree.getLineAndCharacterOfPosition(diagnostic.start || 0).line + 1;
    findings.push(`${file}:${line}: syntax error: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
  }
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) elements.push(node);
    ts.forEachChild(node, visit);
  }
  visit(tree);
  const attr = (node, name) => node.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(tree) === name);
  function literal(attribute) {
    if (!attribute?.initializer) return null;
    const value = attribute.initializer;
    if (ts.isStringLiteral(value)) return value.text;
    if (ts.isJsxExpression(value) && value.expression && (ts.isStringLiteral(value.expression) || ts.isNoSubstitutionTemplateLiteral(value.expression))) return value.expression.text;
    return null;
  }
  const nonempty = attribute => Boolean(attribute?.initializer) && (literal(attribute) === null || literal(attribute).trim().length > 0);
  const tag = node => node.tagName.getText(tree);
  const owner = node => {
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (ts.isFunctionLike(parent)) return parent;
    }
    return tree;
  };
  const labels = elements.filter(node => tag(node) === 'label');
  let previousHeading = 0;
  for (const node of elements) {
    const name = tag(node);
    if (name === 'img' && !attr(node, 'alt')) report(node, '<img> without alt');
    if (['div', 'span'].includes(name) && attr(node, 'onClick') && !attr(node, 'role')) report(node, `clickable ${name} without role`);
    if (['input', 'select', 'textarea'].includes(name) && literal(attr(node, 'type')) !== 'hidden') {
      const id = literal(attr(node, 'id'));
      const linked = id && labels.some(label => owner(label) === owner(node) && literal(attr(label, 'htmlFor')) === id);
      let wrapped = false;
      for (let parent = node.parent; parent && parent !== owner(node); parent = parent.parent) {
        if (ts.isJsxElement(parent) && parent.openingElement.tagName.getText(tree) === 'label') wrapped = true;
      }
      if (!nonempty(attr(node, 'aria-label')) && !nonempty(attr(node, 'aria-labelledby')) && !linked && !wrapped) report(node, 'form control without accessible label');
    }
    if (attr(node, 'dangerouslySetInnerHTML')) report(node, 'dangerouslySetInnerHTML requires explicit review');
    if (/^h[1-6]$/.test(name)) {
      const level = Number(name[1]);
      if (previousHeading && level - previousHeading > 1) report(node, `heading level jumps from h${previousHeading} to h${level}`);
      previousHeading = level;
    }
  }
  return findings;
}
function selfTest() {
  const check = (source, expected, file = 'fixture.tsx') => assert.equal(analyze(source, file).length, expected, source);
  check('const x = <><label htmlFor="q">Szukaj</label>\n<input id="q" /></>;', 0);
  check('const x = <input\n aria-label="Szukaj"\n />;', 0);
  check('const x = <label>Szukaj<input /></label>;', 0);
  check('const x = <input placeholder="Szukaj" />;', 1);
  check('const x = <input aria-label="" />;', 1);
  check('const x = <input type="hidden" />;', 0);
  check('const x = <img\n src="/x.jpg"\n alt="Ilustracja" />;', 0);
  check('const x = <img src="/x.jpg" />;', 1);
  check('const imageRegex = /<img[^>]+src="([^"]+)"/gi;', 0, 'route.ts');
  check('const x = <div onClick={() => {}}>Akcja</div>;', 1);
  check('const x = <button onClick={() => {}}>Akcja</button>;', 0);
  check('const x = <script dangerouslySetInnerHTML={{ __html: "{}" }} />;', 1);
  check('const x = <><h1>Tytuł</h1><h3>Sekcja</h3></>;', 1);
  check('const A = () => <label htmlFor="q">Szukaj</label>; const B = () => <input id="q" />;', 1);
}
function main() {
  selfTest();
  const root = path.resolve('src');
  if (!fs.existsSync(root)) throw new Error('Missing src directory; refusing an empty quality check.');
  const findings = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) findings.push(...analyze(fs.readFileSync(full, 'utf8'), path.relative(process.cwd(), full)));
    }
  }
  walk(root);
  if (findings.length) {
    console.error(`Found ${findings.length} frontend quality issue(s):`);
    for (const finding of findings) console.error(`- ${finding}`);
    process.exitCode = 1;
  } else console.log('Frontend quality checks passed. Static checks do not certify WCAG compliance.');
}
if (require.main === module) main();
module.exports = { analyze, selfTest };
