const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const compile=path=>ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React}}).outputText;
const load=(path,dependencies={})=>{const loaded={exports:{}};const localRequire=name=>Object.hasOwn(dependencies,name)?dependencies[name]:require(name);new Function('exports','require','module','React',compile(path))(loaded.exports,localRequire,loaded,React);return loaded.exports;};
const button=load('src/app/SavedMaterialButton.tsx',{ '../lib/saved-materials': { DEFAULT_COLLECTION_ID:'do-sprawdzenia', SAVED_EVENT:'gmt400-saved-materials-change', readSaved:()=>({items:[],collections:[]}), removeSaved:()=>{}, saveMaterial:()=>{} } }).default;
const page=load('src/app/moje-kolekcje/page.tsx',{ '../../lib/saved-materials': { DEFAULT_COLLECTION_ID:'do-sprawdzenia', SAVED_EVENT:'gmt400-saved-materials-change', readSaved:()=>({items:[],collections:[]}), clearCollection:()=>{}, createCollection:()=>null, removeCollection:()=>{}, removeSaved:()=>{}, changeCollection:()=>{} } }).default;

test('saved button renders accessible label',()=>{const html=renderToStaticMarkup(React.createElement(button,{id:'a',title:'Pompa',href:'/baza/pompa',type:'Porada'}));assert.match(html,/Zapisz/);assert.match(html,/aria-pressed="false"/);assert.match(html,/role="status"/);});
test('collections page renders local storage notice before hydration',()=>{const html=renderToStaticMarkup(React.createElement(page));assert.match(html,/Moje kolekcje/);assert.match(html,/Zapisane materiały są przechowywane lokalnie/);assert.match(html,/aria-label="Zapisane materiały"/);});
test('collections page contains collection creation controls',()=>{const html=renderToStaticMarkup(React.createElement(page));assert.match(html,/Nowa kolekcja/);assert.match(html,/Utwórz/);});
