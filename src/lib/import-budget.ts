export type ImportBudgetFields = Record<'price' | 'shipping' | 'fees' | 'duty' | 'vat' | 'other' | 'exciseBase' | 'manualRate', string>;
export function calculateImportBudget(fields:ImportBudgetFields, classification:string) {
 const parse = (text:string) => /^\d+(?:[.,]\d{1,2})?$/.test(text.trim()) ? Number(text.trim().replace(',', '.')) : NaN;
 const keys = ['price','shipping','fees','duty','vat','other','exciseBase'] as const;
 const values = keys.map(key => parse(fields[key]));
 const rate = classification === 'personal-over-2000' ? 18.6 : classification === 'manual' ? parse(fields.manualRate) : NaN;
 if (!values.every(value => Number.isFinite(value) && value >= 0 && Number.isSafeInteger(Math.round(value * 100))) || !Number.isFinite(rate) || rate < 0 || rate > 100) return {valid:false as const,error:'Wpisz nieujemne kwoty z najwyżej dwoma miejscami po przecinku i ustal wariant akcyzy. Puste pola nie oznaczają zera.'};
 const cents = values.map(value => Math.round(value * 100));
 const subtotal = cents.slice(0,6).reduce((a,b) => a+b,0);
 const excise = Math.round(cents[6] * rate / 100);
 const total = subtotal + excise;
 if (![subtotal,excise,total].every(Number.isSafeInteger)) return {valid:false as const,error:'Kwoty przekraczają bezpieczny zakres obliczeń.'};
 return {valid:true as const,rate,subtotal:subtotal/100,excise:excise/100,total:total/100};
}
