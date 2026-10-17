'use client';
import { useId, useState, type CSSProperties } from 'react';
import { calculateImportBudget, type ImportBudgetFields } from '../lib/import-budget';
const panel:CSSProperties = {background:'#171d25',color:'#ededed',padding:20,border:'1px solid #343a43',borderRadius:10,minWidth:0,marginBottom:24};
const control:CSSProperties = {display:'block',boxSizing:'border-box',width:'100%',minWidth:0,minHeight:44,padding:12,marginTop:6,background:'#101317',color:'#fafafa',border:'1px solid #596371',borderRadius:7,fontSize:16,colorScheme:'dark'};
const money = (value:number) => value.toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2})+' PLN';
export default function ImportCostCalculator() {
 const id = useId();
 const [fields,setFields] = useState<ImportBudgetFields>({price:'',shipping:'0',fees:'0',duty:'0',vat:'0',other:'0',exciseBase:'',manualRate:''});
 const [classification,setClassification] = useState('');
 const result = calculateImportBudget(fields,classification);
 const labels: [keyof ImportBudgetFields,string][] = [['price','Cena auta (PLN)'],['shipping','Łączny transport (PLN)'],['fees','Opłaty aukcyjne i pośrednika (PLN)'],['duty','Cło — ustalona kwota (PLN)'],['vat','VAT — ustalona kwota (PLN)'],['other','Inne koszty (PLN)'],['exciseBase','Ustalona podstawa akcyzy (PLN)']];
 return <section style={panel} aria-labelledby={id+'-title'} data-testid="import-budget">
  <h3 id={id+'-title'} style={{color:'#f2cf85',margin:'0 0 12px'}}>KALKULATOR IMPORTU</h3>
  <p style={{color:'#d0d5dc'}}>Budżet według Twoich założeń, nie wyliczenie odprawy celnej. Kwoty cła, VAT i podstawę akcyzy ustal osobno. Nie są automatycznie wyznaczane z ceny auta.</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,240px),1fr))',gap:14}}>
   {labels.map(([key,label]) => <label key={key} htmlFor={id+'-'+key}>{label}<input id={id+'-'+key} style={control} inputMode="decimal" value={fields[key]} onChange={event => setFields(previous => ({...previous,[key]:event.target.value}))}/></label>)}
   <label htmlFor={id+'-classification'}>Wariant akcyzy<select id={id+'-classification'} style={control} value={classification} onChange={event => setClassification(event.target.value)}><option value="">Wybierz potwierdzony wariant</option><option value="personal-over-2000">Osobowy spalinowy powyżej 2000 cm³ — 18,6%</option><option value="manual">Inna klasyfikacja lub zwolnienie — stawka ręczna</option></select></label>
   {classification === 'manual' && <label htmlFor={id+'-manualRate'}>Ustalona stawka akcyzy (%)<input id={id+'-manualRate'} style={control} inputMode="decimal" value={fields.manualRate} onChange={event => setFields(previous => ({...previous,manualRate:event.target.value}))}/></label>}
  </div>
  <p style={{color:'#f2cf85',marginTop:16}}>Silnik 4.3L V6 również przekracza 2000 cm³. Pickup nie oznacza automatycznie stawki 0%. Ten formularz nie ustala klasyfikacji podatkowej ani prawa do zwolnienia.</p>
  <div aria-live="polite">{result.valid ? <dl><dt>Koszty wpisane bez akcyzy</dt><dd>{money(result.subtotal)}</dd><dt>Akcyza według wybranego wariantu ({result.rate}%)</dt><dd data-testid="import-excise">{money(result.excise)}</dd><dt>Łączny budżet według założeń</dt><dd data-testid="import-total" style={{color:'#f2cf85',fontSize:22}}>{money(result.total)}</dd></dl> : <p role="status">{result.error}</p>}</div>
  <p style={{color:'#bdc6d2',fontSize:13}}>Zera w polach cła i VAT są wyłącznie wpisanymi założeniami — nie potwierdzają zwolnienia z podatku. Podstawa akcyzy nie jest drugi raz dodawana do sumy. Suma nie obejmuje kosztów, których nie wpiszesz.</p>
  <a href="https://www.podatki.gov.pl/akcyza/stawki-podatkowe" target="_blank" rel="noopener noreferrer" style={{color:'#f2cf85'}}>Ministerstwo Finansów — stawki akcyzy</a>
 </section>;
}
