import type { CategoryIconName } from '../app/ui/CategoryIcon';

/**
 * „Najczęstsze problemy” na stronie głównej: skróty do GOTOWYCH wyników /diagnoza (adres = objaw + odpowiedzi na pytania).
 * Tematy z listy „Tematy z dużym popytem, które strona już pokrywa” w analizie podpowiedzi wyszukiwarek
 * (/workspace/gmt400/popyt-wyszukiwania.md): 4L60E, 6.5 TD (PMD/pompa), 5.7 Vortec (CSFI/kolektor), pompa paliwa, ABS, A/C.
 * To nie są statystyki awaryjności — tylko tematy, o które ludzie pytają i na które w bazie są wpisy.
 * Test tests/diagnoza-data.test.cjs sprawdza, że każdy adres wskazuje istniejący objaw, pytania i odpowiedzi.
 */
export type HomeProblem = { id: string; title: string; hint: string; icon: CategoryIconName; href: string };

export const HOME_PROBLEMS: HomeProblem[] = [
  { id: '4l60e', title: 'Skrzynia 4L60-E ślizga', hint: 'ATF, solenoidy, kody', icon: 'gear', href: '/diagnoza?objaw=skrzynia&typ=automat&rodzaj=slizga' },
  { id: 'diesel-6-5', title: '6.5 TD nie odpala', hint: 'pompa, PMD, świece', icon: 'key', href: '/diagnoza?objaw=nie-odpala&silnik=diesel' },
  { id: 'vortec', title: 'Szarpie i gaśnie (benzyna)', hint: 'CSFI, uszczelki, powietrze', icon: 'wave', href: '/diagnoza?objaw=szarpie-gasnie&silnik=benzyna' },
  { id: 'pompa-paliwa', title: 'Benzyna nie odpala', hint: 'pompa i przekaźnik, zapłon', icon: 'drop', href: '/diagnoza?objaw=nie-odpala&silnik=benzyna' },
  { id: 'abs', title: 'Kontrolka ABS / hamulce', hint: 'czujniki, moduł, przewody', icon: 'brake', href: '/diagnoza?objaw=hamulce&rodzaj=kontrolka' },
  { id: 'klima', title: 'Klima i ogrzewanie', hint: 'sprężarka, nagrzewnica, dmuchawa', icon: 'snow', href: '/diagnoza?objaw=klima-ogrzewanie' },
];
