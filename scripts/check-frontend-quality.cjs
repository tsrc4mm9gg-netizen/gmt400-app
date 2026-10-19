#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
function analyze(source, file) {
  const kind = /\.tsx$/.test(file) ? ts.ScriptKind.TSX : /\.jsx$/.test(file) ? ts.ScriptKind.JSX : /\.ts$/.test(file) ? ts.ScriptKind.TS : ts.ScriptKind.JS;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  const findings = [], elements = [], declarations = [];
  const owner = node => {
    for (let parent = node.parent; parent; parent = parent.parent) if (ts.isFunctionLike(parent)) return parent;
    return tree;
  };
  const report = (node, message) => findings.push(`${file}:${tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1}: ${message}`);
  for (const diagnostic of tree.parseDiagnostics) findings.push(`${file}:${tree.getLineAndCharacterOfPosition(diagnostic.start || 0).line + 1}: syntax error: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) elements.push(node);
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) declarations.push(node);
    ts.forEachChild(node, visit);
  }
  visit(tree);
  const attr = (node, name) => node.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(tree) === name);
  const unwrap = node => { while (node && ts.isParenthesizedExpression(node)) node = node.expression; return node; };
  const valueOf = attribute => {
    const value = attribute?.initializer;
    return value && ts.isJsxExpression(value) ? unwrap(value.expression) : value;
  };
  function literal(attribute) {
    const value = valueOf(attribute);
    return value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) ? value.text : null;
  }
  function nonempty(attribute) {
    const value = valueOf(attribute);
    if (!value || value.kind === ts.SyntaxKind.NullKeyword || value.kind === ts.SyntaxKind.FalseKeyword || value.kind === ts.SyntaxKind.TrueKeyword || ts.isVoidExpression(value)) return false;
    if (ts.isIdentifier(value) && value.text === 'undefined') return false;
    const text = literal(attribute);
    return text === null || text.trim().length > 0;
  }
  function expressionKey(expression, element) {
    const node = unwrap(expression);
    if (!node) return null;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return JSON.stringify(['text', node.text]);
    if (ts.isIdentifier(node)) {
      const candidates = declarations.filter(declaration => owner(declaration) === owner(element) && declaration.name.text === node.text);
      if (candidates.length !== 1) return null;
      const declaration = candidates[0];
      if (!ts.isVariableDeclarationList(declaration.parent) || !(declaration.parent.flags & ts.NodeFlags.Const) || !declaration.initializer || declaration.getStart(tree) >= element.getStart(tree)) return null;
      const scope = declaration.parent.parent.parent;
      let contained = false;
      for (let parent = element.parent; parent; parent = parent.parent) if (parent === scope) contained = true;
      return contained ? JSON.stringify(['const', declaration.getStart(tree)]) : null;
    }
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const left = expressionKey(node.left, element), right = expressionKey(node.right, element);
      return left !== null && right !== null ? JSON.stringify(['concat', left, right]) : null;
    }
    return null;
  }
  const idKey = (element, name) => expressionKey(valueOf(attr(element, name)), element);
  const tag = node => node.tagName.getText(tree);
  const labels = elements.filter(node => tag(node) === 'label');
  const previousHeadings = new Map();
  for (const node of elements) {
    const name = tag(node);
    if (name === 'img' && !attr(node, 'alt')) report(node, '<img> without alt');
    if (['div', 'span'].includes(name) && attr(node, 'onClick') && !attr(node, 'role')) report(node, `clickable ${name} without role`);
    if (['input', 'select', 'textarea'].includes(name) && literal(attr(node, 'type')) !== 'hidden') {
      const id = idKey(node, 'id');
      const linked = id !== null && literal(attr(node, 'id')) !== '' && labels.some(label => owner(label) === owner(node) && idKey(label, 'htmlFor') === id);
      let wrapped = false;
      for (let parent = node.parent; parent && parent !== owner(node); parent = parent.parent) if (ts.isJsxElement(parent) && parent.openingElement.tagName.getText(tree) === 'label') wrapped = true;
      if (!nonempty(attr(node, 'aria-label')) && !nonempty(attr(node, 'aria-labelledby')) && !linked && !wrapped) report(node, 'form control without accessible label');
    }
    if (attr(node, 'dangerouslySetInnerHTML')) report(node, 'dangerouslySetInnerHTML requires explicit review');
    if (/^h[1-6]$/.test(name)) {
      const level = Number(name[1]), scope = owner(node), previous = previousHeadings.get(scope);
      if (previous && level - previous > 1) report(node, `heading level jumps from h${previous} to h${level}`);
      previousHeadings.set(scope, level);
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
  check('function A(){ const id = useId(); return <><label htmlFor={id + "-q"}>Szukaj</label><textarea id={id + "-q"} /></>; }', 0);
  check('function A(){ const id = useId(); return <><label htmlFor={id + "-a"}>Szukaj</label><input id={id + "-b"} /></>; }', 1);
  check('function A(){ const id = useId(); return <><label htmlFor={id}>Szukaj</label><input id={id} /></>; }', 0);
  check('function A(){ return <><label htmlFor={makeId()}>Szukaj</label><input id={makeId()} /></>; }', 1);
  check('const A = () => <h1>A</h1>; const B = () => <h3>B</h3>;', 0);
  for (const value of ['undefined', 'null', 'false', 'true', 'void 0', '"   "']) check(`const x = <input aria-label={${value}} />;`, 1);
  check('const x = <><label htmlFor="">Szukaj</label><input id="" /></>;', 1);
  check('function A(){ { const id = useId(); const label = <label htmlFor={id}>Szukaj</label>; } return <input id={id} />; }', 1);
  check('const x = <input', 2);
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
