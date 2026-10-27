/** Zwarty nagłówek strony głównej tuż nad karuzelą modeli (jedyny H1 strony). */
export default function HomeIntro() {
  return (
    <section aria-labelledby="home-title" className="px-4 pt-3 pb-1">
      <h1 id="home-title" className="text-2xl font-bold leading-tight tracking-wide text-white" style={{ margin: 0, fontSize: '1.5rem' }}>
        GMT<span className="text-silver-600">400</span>
        <span className="mt-0.5 block text-sm font-medium tracking-normal text-neutral-300">Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer — usterki, DIY i poradniki po polsku</span>
      </h1>
    </section>
  );
}
