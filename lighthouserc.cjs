module.exports = {
  ci: {
    collect: {
      url: [
        'http://127.0.0.1:3100/',
        'http://127.0.0.1:3100/swiat-gmt400',
        'http://127.0.0.1:3100/swiat-gmt400/design-ktory-sie-nie-starzeje',
      ],
      numberOfRuns: 3,
      settings: {
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85, aggregationMethod: 'median' }],
        'categories:accessibility': ['warn', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:best-practices': ['warn', { minScore: 0.90, aggregationMethod: 'median' }],
        'categories:seo': ['warn', { minScore: 0.90, aggregationMethod: 'median' }],
      },
    },
    upload: { target: 'filesystem', outputDir: 'reports/lighthouse' },
  },
};
