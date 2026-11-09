type ArticleImage = {
  src: string;
  alt: string;
  caption?: string;
};

type AffiliateProduct = {
  name: string;
  url: string;
  compatibilityNote: string;
};

type ArticleExtrasProps = {
  image?: ArticleImage;
  affiliateProducts: AffiliateProduct[];
};

export default function ArticleExtras({
  image,
  affiliateProducts,
}: ArticleExtrasProps) {
  const hasImage = Boolean(image?.src && image.alt);
  const hasProducts = affiliateProducts.length > 0;

  if (!hasImage && !hasProducts) {
    return null;
  }

  return (
    <section aria-labelledby="article-extras-heading">
      <h2 id="article-extras-heading">Przydatne materiały</h2>

      {hasImage && image && (
        <figure>
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
          />
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      )}

      {hasProducts && (
        <>
          <p>
            Poniższe odnośniki są linkami afiliacyjnymi. Jeśli dokonasz
            zakupu, możemy otrzymać prowizję.
          </p>
          <ul>
            {affiliateProducts.map((product) => (
              <li key={product.url}>
                <a href={product.url}>{product.name}</a>
                <span> — {product.compatibilityNote}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
