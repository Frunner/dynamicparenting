export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portaal/', '/therapeut/', '/login', '/registreren'],
    },
    sitemap: 'https://dynamicparenting.nl/sitemap.xml',
  }
}
