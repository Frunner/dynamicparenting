import { Playfair_Display, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://dynamicparenting.nl'),
  title: {
    default: 'Dynamic Parenting | Oudercoaching & Gezinsbegeleiding',
    template: '%s | Dynamic Parenting'
  },
  description: 'Professionele oudercoaching, systeemtherapie en gezinsbegeleiding in Nederland. Versterk je gezinsband en vind balans in het ouderschap.',
  keywords: ['oudercoaching', 'gezinstherapie', 'systeemtherapie', 'genogram', 'gezinsbegeleiding', 'opvoedondersteuning', 'co-ouderschap', 'Nederland'],
  authors: [{ name: 'Dynamic Parenting' }],
  creator: 'Dynamic Parenting',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://dynamicparenting.nl',
    siteName: 'Dynamic Parenting',
    title: 'Dynamic Parenting | Oudercoaching & Gezinsbegeleiding',
    description: 'Professionele oudercoaching, systeemtherapie en gezinsbegeleiding in Nederland.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dynamic Parenting | Oudercoaching & Gezinsbegeleiding',
    description: 'Professionele oudercoaching, systeemtherapie en gezinsbegeleiding in Nederland.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-code-hier',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M7G5KDLS9Y"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M7G5KDLS9Y');
          `}
        </Script>
        
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4840398444011708"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
