import type { Crumb } from '../../ui/Breadcrumbs';

type StructuredDataProps = {
  title: string;
  description: string;
  url: string;
  edited?: string;
  breadcrumbs: Crumb[];
};

const SITE_URL = 'https://www.gmt400.pl';
const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

export default function StructuredData({ title, description, url, edited, breadcrumbs }: StructuredDataProps) {
  const canonicalUrl = absoluteUrl(url);
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: canonicalUrl,
    inLanguage: 'pl-PL',
    isPartOf: { '@type': 'WebSite', name: 'GMT400', url: SITE_URL },
  };
  if (edited) article.dateModified = edited;
  const breadcrumb: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: absoluteUrl(crumb.href) } : {}),
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
    </>
  );
}
