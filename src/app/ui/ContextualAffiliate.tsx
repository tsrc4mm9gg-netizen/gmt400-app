import AffiliateBox from './AffiliateBox';

type Props = {
  title: string;
  type: string;
};

function getRelevantProducts(title: string): { name: string; search: string }[] {
  const t = title.toLowerCase();
  const products: { name: string; search: string }[] = [];

  // Oleje i filtry
  if (t.includes('olej') || t.includes('filtr oleju') || t.includes('wymiana oleju')) {
    products.push({ name: 'ACDelco PF52 — filtr oleju', search: 'ACDelco PF52' });
    products.push({ name: 'Olej silnikowy 5W-30', search: '5W-30 engine oil' });
  }
  if (t.includes('filtr powietrza') || t.includes('powietrza')) {
    products.push({ name: 'Filtr powietrza ACDelco A1300C', search: 'ACDelco A1300C' });
  }
  if (t.includes('filtr paliwa') || t.includes('paliwa')) {
    products.push({ name: 'Filtr paliwa ACDelco GF626', search: 'ACDelco GF626' });
  }

  // Skrzynia i ATF
  if (t.includes('atf') || t.includes('skrzyn') || t.includes('4l60') || t.includes('4l80') || t.includes('automat')) {
    products.push({ name: 'MANNOL Dexron III ATF', search: 'MANNOL Dexron III ATF' });
    products.push({ name: 'Filtr ATF 4L60-E ACDelco TF289', search: 'ACDelco TF289' });
    products.push({ name: 'Uszczelka miski ATF Fel-Pro TOS18663', search: 'Fel-Pro TOS18663' });
  }

  // Chłodzenie
  if (
    t.includes('chłodz') ||
    t.includes('chłodnic') ||
    t.includes('termostat') ||
    t.includes('pompa wody') ||
    t.includes('przegrz') ||
    t.includes('wentylator') ||
    t.includes('wyciek płynu') ||
    t.includes('płyn chłodn')
  ) {
    products.push({ name: 'Płyn chłodniczy DEX-COOL', search: 'DEX-COOL coolant' });
    products.push({ name: 'Termostat ACDelco 131-113', search: 'ACDelco 131-113' });
    products.push({ name: 'Pompa wody ACDelco 252-711', search: 'ACDelco 252-711' });
  }

  // Hamulce
  if (t.includes('hamul') || t.includes('abs') || t.includes('klock') || t.includes('tarcz')) {
    products.push({ name: 'Płyn hamulcowy DOT3', search: 'brake fluid DOT3' });
    products.push({ name: 'Klocki hamulcowe ACDelco 17D369MH', search: 'ACDelco 17D369MH' });
    products.push({ name: 'Tarcze hamulcowe', search: 'brake rotors Chevy Tahoe' });
  }

  // Zapłon
  if (t.includes('świec') || t.includes('zapłon') || t.includes('cewka') || t.includes('rozdzielacz')) {
    products.push({ name: 'Świece ACDelco 41-932', search: 'ACDelco 41-932' });
    products.push({ name: 'Przewody zapłonowe', search: 'spark plug wires Chevy Tahoe' });
    products.push({ name: 'Cewka zapłonowa ACDelco D577', search: 'ACDelco D577' });
  }

  // Paliwo
  if (t.includes('paliw') || t.includes('wtrysk') || t.includes('pompa paliwa') || t.includes('csfi') || t.includes('tbi')) {
    products.push({ name: 'Filtr paliwa ACDelco GF626', search: 'ACDelco GF626' });
    products.push({ name: 'Pompa paliwa ACDelco EP381', search: 'ACDelco EP381' });
  }

  // Zawieszenie
  if (t.includes('amortyz') || t.includes('zawiesz') || t.includes('wahacz') || t.includes('sprężyn')) {
    products.push({ name: 'Amortyzatory', search: 'shock absorbers Chevy Tahoe' });
    products.push({ name: 'Wahacze', search: 'control arm Chevy Tahoe' });
  }

  // Elektryka
  if (t.includes('akumulator') || t.includes('alternator') || t.includes('rozrusznik') || t.includes('elektryk')) {
    products.push({ name: 'Akumulator samochodowy', search: 'car battery' });
    products.push({ name: 'Multimetr', search: 'digital multimeter' });
  }

  // Diagnostyka
  if (t.includes('obd') || t.includes('kod') || t.includes('diagnost') || t.includes('check engine')) {
    products.push({ name: 'Skaner OBD2 Bluetooth', search: 'OBD2 scanner Bluetooth' });
    products.push({ name: 'Multimetr', search: 'digital multimeter' });
  }

  // Narzędzia ogólne (jeśli nic nie pasuje)
  if (products.length === 0) {
    products.push({ name: 'Skaner OBD2', search: 'OBD2 scanner' });
    products.push({ name: 'Klucz dynamometryczny', search: 'torque wrench' });
    products.push({ name: 'Zestaw kluczy', search: 'socket set metric' });
  }

  return products.slice(0, 4);
}

export default function ContextualAffiliate({ title, type }: Props) {
  if (type !== 'Usterka' && type !== 'Porada') return null;
  const items = getRelevantProducts(title);
  return <AffiliateBox title="Przydatne przy tej naprawie" items={items} />;
}
