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
    products.push({ name: 'Filtr powietrza', search: 'air filter GMT400 Tahoe Suburban' });
  }
  if (t.includes('filtr paliwa') || t.includes('paliwa')) {
    products.push({ name: 'Filtr paliwa', search: 'fuel filter GMT400' });
  }

  // Skrzynia i ATF
  if (t.includes('atf') || t.includes('skrzyn') || t.includes('4l60') || t.includes('4l80') || t.includes('automat')) {
    products.push({ name: 'MANNOL Dexron III ATF', search: 'MANNOL Dexron III ATF' });
    products.push({ name: 'Filtr ATF 4L60-E', search: 'transmission filter 4L60E' });
    products.push({ name: 'Uszczelka miski ATF', search: 'transmission pan gasket 4L60E' });
  }

  // Chłodzenie
  if (t.includes('chłodz') || t.includes('termostat') || t.includes('pompa wody') || t.includes('przegrz')) {
    products.push({ name: 'Płyn chłodniczy', search: 'coolant antifreeze' });
    products.push({ name: 'Termostat', search: 'thermostat GMT400 Vortec' });
    products.push({ name: 'Pompa wody', search: 'water pump GMT400' });
  }

  // Hamulce
  if (t.includes('hamul') || t.includes('abs') || t.includes('klock') || t.includes('tarcz')) {
    products.push({ name: 'Płyn hamulcowy DOT3', search: 'brake fluid DOT3' });
    products.push({ name: 'Klocki hamulcowe', search: 'brake pads GMT400' });
    products.push({ name: 'Tarcze hamulcowe', search: 'brake rotors GMT400' });
  }

  // Zapłon
  if (t.includes('świec') || t.includes('zapłon') || t.includes('cewka') || t.includes('rozdzielacz')) {
    products.push({ name: 'Świece zapłonowe', search: 'spark plugs GMT400 Vortec' });
    products.push({ name: 'Przewody zapłonowe', search: 'spark plug wires GMT400' });
    products.push({ name: 'Cewka zapłonowa', search: 'ignition coil GMT400' });
  }

  // Paliwo
  if (t.includes('paliw') || t.includes('wtrysk') || t.includes('pompa paliwa') || t.includes('csfi') || t.includes('tbi')) {
    products.push({ name: 'Filtr paliwa', search: 'fuel filter GMT400' });
    products.push({ name: 'Pompa paliwa', search: 'fuel pump GMT400' });
  }

  // Zawieszenie
  if (t.includes('amortyz') || t.includes('zawiesz') || t.includes('wahacz') || t.includes('sprężyn')) {
    products.push({ name: 'Amortyzatory', search: 'shock absorbers GMT400' });
    products.push({ name: 'Wahacze', search: 'control arm GMT400' });
  }

  // Elektryka
  if (t.includes('akumulator') || t.includes('alternator') || t.includes('rozrusznik') || t.includes('elektryk')) {
    products.push({ name: 'Akumulator', search: 'car battery' });
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
