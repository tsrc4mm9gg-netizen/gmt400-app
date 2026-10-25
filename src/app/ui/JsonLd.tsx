/** Dane strukturalne schema.org jako <script type="application/ld+json"> (znak „<” zakodowany, by nie zamknąć tagu). */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
