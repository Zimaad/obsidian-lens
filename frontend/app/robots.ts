import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/settings',
        '/lab',
        '/api',
        '/analyze',
        '/analyze/*',
        '/gap-explorer',
        '/graph',
        '/library',
        '/admin'
      ],
    },
    sitemap: 'https://hiatus-three.vercel.app/sitemap.xml', 
  }
}
