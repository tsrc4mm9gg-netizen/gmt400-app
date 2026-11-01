import type { CategoryIconName } from '../app/ui/CategoryIcon';

export type HomeProblem = { id: string; title: string; hint: string; icon: CategoryIconName; href: string };

export const HOME_PROBLEMS: HomeProblem[] = [
  { id: '4l60e', title: 'Skrzynia 4L60-E ślizga', hint: 'Sprawdź najpierw: poziom i stan ATF, kody błędów', icon: 'gear', href: '/diagnoza?objaw=skrzynia&typ=automat&rodzaj=slizga' },
  { id: 'diesel-6-5', title: '6.5 TD nie odpala', hint: 'Sprawdź najpierw: PMD, pompę, świece żarowe', icon: 'key', href: '/diagnoza?objaw=nie-odpala&silnik=diesel' },
  { id: 'vortec', title: 'Szarpie i gaśnie (benzyna)', hint: 'Sprawdź najpierw: CSFI, uszczelki kolektora, powietrze', icon: 'wave', href: '/diagnoza?objaw=szarpie-gasnie&silnik=benzyna' },
  { id: 'pompa-paliwa', title: 'Benzyna nie odpala', hint: 'Sprawdź najpierw: pompę paliwa, przekaźnik, zapłon', icon: 'drop', href: '/diagnoza?objaw=nie-odpala&silnik=benzyna' },
  { id: 'abs', title: 'Kontrolka ABS / hamulce', hint: 'Sprawdź najpierw: czujniki kół, moduł, przewody', icon: 'brake', href: '/diagnoza?objaw=hamulce&rodzaj=kontrolka' },
  { id: 'klima', title: 'Klima i ogrzewanie', hint: 'Sprawdź najpierw: sprężarkę, nagrzewnicę, dmuchawę', icon: 'snow', href: '/diagnoza?objaw=klima-ogrzewanie' },
  { id: 'stuki-hamulce', title: 'Stuka przy hamowaniu', hint: 'Sprawdź najpierw: klocki, tarcze, zaciski', icon: 'brake', href: '/diagnoza?objaw=hamulce&rodzaj=stuka' },
  { id: 'przegrzewanie', title: 'Przegrzewa się', hint: 'Sprawdź najpierw: chłodnicę, termostat, pompę wody', icon: 'thermo', href: '/diagnoza?objaw=przegrzewanie' },
  { id: 'wyciek-oleju', title: 'Wyciek oleju silnika', hint: 'Sprawdź najpierw: uszczelki miski, pokrywy zaworów', icon: 'drop', href: '/diagnoza?objaw=wyciek&rodzaj=olej' },
  { id: 'swiatla', title: 'Światła / elektryka', hint: 'Sprawdź najpierw: bezpieczniki, przekaźniki, masy', icon: 'lights', href: '/diagnoza?objaw=elektryka' },
];
