import { additionalStories } from './gmt400-stories-batch2';
export const storyCategories = [
  { id: 'historia-design', title: 'Historia i projektowanie' },
  { id: 'wlasciciele', title: 'Historie właścicieli' },
  { id: 'wersje-niezwykle', title: 'Wersje niezwykłe' },
] as const;
export const stories = [
  {
    slug: 'design-ktory-sie-nie-starzeje', category: 'historia-design', title: 'GMT400: siła spokojnego projektu',
    description: 'Co w stylistyce tej rodziny dostrzega projektant samochodów Adrian Clarke?',
    sourceTitle: 'Why General Motors’ GMT400 Truck Design Remains Legendary 30 Years Later', sourceAuthor: 'Adrian Clarke', sourcePublisher: 'The Autopian', sourceDate: '2023-12-01',
    sourceUrl: 'https://www.theautopian.com/why-general-motors-gmt400-truck-design-remains-legendary-30-years-later/',
    sections: [
      { title: 'Samochód do pracy i codzienności', text: 'Adrian Clarke opisuje GMT400 jako odpowiedź na zmianę oczekiwań wobec pickupów: miały nadal pracować, ale również wygodnie służyć na co dzień. W jego interpretacji prostota nadwozia nie oznacza braku dopracowania. To właśnie spójność proporcji i detali buduje charakter tej rodziny.' },
      { title: 'Na co spojrzeć przy następnym spotkaniu?', text: 'Przyjrzyj się przebiegowi linii boku, poziomym podziałom przodu i sposobowi osadzenia szyb. Clarke zwraca uwagę na detale, które nie konkurują ze sobą o uwagę. Ocenę wyglądu traktujemy tutaj jako opinię projektanta, a nie obiektywny ranking samochodów.' },
      { title: 'Czytaj z kontekstem', text: 'To polskie omówienie eseju o stylistyce, nie dokumentacja techniczna. Źródło zawiera również przypuszczenia, między innymi dotyczące wczesnego wykorzystania CAD. Nie przedstawiamy ich jako potwierdzonych faktów. Oryginał pozwala poznać pełną argumentację autora i obejrzeć ilustracje udostępnione w jego publikacji.' },
    ],
  },
  {
    slug: 'milion-mil-franka-oresnika', category: 'wlasciciele', title: 'Milion mil i przywiązanie do jednego Chevroleta',
    description: 'Historia Franka Oresnika z reportażu NPR: praca, dokumentacja i samochód, którego nie chciał wymieniać.',
    sourceTitle: 'Wisconsin Man Drives Millionth Mile in ’91 Chevy', sourceAuthor: 'Robert Siegel — rozmowa z Frankiem Oresnikiem', sourcePublisher: 'NPR', sourceDate: '2008-02-08',
    sourceUrl: 'https://www.npr.org/2008/02/08/18826415/wisconsin-man-drives-millionth-mile-in-91-chevy',
    sections: [
      { title: 'Nie eksponat, lecz narzędzie pracy', text: 'W reportażu NPR z 8 lutego 2008 roku Frank Oresnik opowiadał o Chevrolecie Silverado z 1991 roku, którym przewoził żywność. Rozmowa towarzyszyła osiągnięciu miliona mil. Właściciel kupił używany samochód w 1996 roku, przy przebiegu około 41 tysięcy mil.' },
      { title: 'Za liczbą stoi historia obsługi', text: 'Oresnik mówił o szczegółowych zapisach przebiegu, wymianach oleju i rachunkach za części. Nie jest to opowieść o samochodzie, który nie wymagał żadnej pracy. W jego relacji ważne były regularna opieka i niechęć do ponownego finansowania zakupu auta.' },
      { title: 'Ciekawa historia, nie obietnica', text: 'To relacja konkretnego użytkownika przytoczona przez NPR. Nie stanowi gwarancji podobnego przebiegu innego egzemplarza ani dowodu, że każda część pozostała fabryczna. Oryginalny materiał i nagranie pozwalają usłyszeć emocje towarzyszące temu wydarzeniu.' },
    ],
  },
  ...additionalStories,
];
