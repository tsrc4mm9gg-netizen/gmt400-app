import type { Metadata } from 'next';
import Breadcrumbs from '../ui/Breadcrumbs';
import FAQ from '../ui/FAQ';
import AccordionSection from '../ui/AccordionSection';

export const metadata: Metadata = {
  title: 'Kontakt — GMT400.pl',
  description: 'Skontaktuj się z GMT400.pl. Pytania, sugestie, współpraca.',
  alternates: { canonical: 'https://www.gmt400.pl/kontakt' },
};

const faqItems = [
  {
    question: 'Jak szybko otrzymam odpowiedź?',
    answer: 'Staramy się odpowiadać w ciągu 24–48 godzin. W przypadku złożonych pytań technicznych może to potrwać dłużej.',
  },
  {
    question: 'Czy mogę zgłosić błąd na stronie?',
    answer: 'Tak, użyj formularza kontaktowego. Opisz problem i podaj adres strony, na której wystąpił błąd.',
  },
  {
    question: 'Czy mogę zaproponować nową treść?',
    answer: 'Tak, chętnie przyjmiemy sugestie. Użyj formularza i opisz, czego brakuje lub co można poprawić.',
  },
];

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ label: 'Kontakt' }]} />
      <header className="mt-4">
        <h1 className="text-3xl font-bold text-silver-400">Kontakt</h1>
        <p className="mt-2 text-neutral-300">
          Masz pytanie, sugestię lub chcesz zgłosić błąd? Napisz do nas.
        </p>
      </header>

      <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300">Imię</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-white/20 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 focus:border-silver-500 focus:outline-none"
            placeholder="Twoje imię"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 w-full rounded-lg border border-white/20 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 focus:border-silver-500 focus:outline-none"
            placeholder="twoj@email.pl"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-neutral-300">Temat</label>
          <select
            id="subject"
            name="subject"
            className="mt-1 w-full rounded-lg border border-white/20 bg-neutral-900 px-4 py-3 text-white focus:border-silver-500 focus:outline-none"
          >
            <option value="pytanie">Pytanie</option>
            <option value="sugestia">Sugestia</option>
            <option value="blad">Zgłoszenie błędu</option>
            <option value="wspolpraca">Współpraca</option>
            <option value="inne">Inne</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-300">Wiadomość</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="mt-1 w-full rounded-lg border border-white/20 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 focus:border-silver-500 focus:outline-none"
            placeholder="Twoja wiadomość..."
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-silver-600 px-6 py-3 font-semibold text-neutral-950 hover:bg-silver-500 focus:outline-none focus:ring-2 focus:ring-silver-500"
        >
          Wyślij wiadomość
        </button>
      </form>

      <section className="mt-8 rounded-xl border border-white/10 bg-neutral-900 p-4">
        <h2 className="font-semibold text-silver-300">Email</h2>
        <p className="mt-2 text-sm text-neutral-300">
          <a href="mailto:kontakt@gmt400.pl" className="text-silver-400 hover:underline">kontakt@gmt400.pl</a>
        </p>
      </section>

      <div className="mt-6">
        <AccordionSection title="Częste pytania">
          <FAQ items={faqItems} />
        </AccordionSection>
      </div>
    </div>
  );
}
