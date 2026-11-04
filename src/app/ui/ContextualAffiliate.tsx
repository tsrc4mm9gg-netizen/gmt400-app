import AffiliateBox from './AffiliateBox';

type Props = {
  title: string;
  type: string;
};

function getRelevantProducts(title: string): { name: string; search: string }[] {
  const t = title.toLowerCase();
  const products: { name: string; search: string }[] = [];

  if (t.includes('olej') || t.includes('filtr')) {
    products.push({ name: 'ACDelco PF52 — filtr oleju', search: 'ACDelco PF52' });
    products.push({ name: 'Olej silnikowy 5W-30', search: '5W-30 engine oil' });
  }
  if (t.includes('atf') || t.includes('skrzyn') || t.includes('4l60') || t.includes('4l80')) {
    products.push({ name: 'MANNOL Dexron III ATF', search: 'MANNOL Dexron III ATF' });
    products.push({ name: 'Filtr ATF', search: 'transmission filter 4L60E' });
  }
  if (t.includes('chłodz') || t.includes('termostat') || t.includes('płyn')) {
    products.push({ name: 'Płyn chłodniczy', search: 'coolant antifreeze' });
    products.push({ name: 'Termostat', search: 'thermostat GMT400' });
  }
  if (t.includes('hamul') || t.includes('abs')) {
    products.push({ name: 'Płyn hamulcowy', search: 'brake fluid DOT3' });
    products.push({ name: 'Klocki hamulcowe', search: 'brake pads GMT400' });
  }
  if (t.includes('obd') || t.includes('kod') || t.includes('diagnost')) {
    products.push({ name: 'Skaner OBD2', search: 'OBD2 scanner' });
  }
  if (t.includes('świec') || t.includes('zapłon')) {
    products.push({ name: 'Świece zapłonowe', search: 'spark plugs GMT400 Vortec' });
  }

  if (products.length === 0) {
    products.push({ name: 'Skaner OBD2', search: 'OBD2 scanner' });
    products.push({ name: 'Multimetr', search: 'digital multimeter' });
  }

  return products.slice(0, 4);
}

export default function ContextualAffiliate({ title, type }: Props) {
  if (type !== 'Usterka' && type !== 'Porada') return null;
  const items = getRelevantProducts(title);
  return <AffiliateBox title="Przydatne przy tej naprawie" items={items} />;
}
