import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'Trinity 3D | Brief Corporativo',
  description: 'Brief corporativo de Trinity 3D. Transformamos ideas en experiencias digitales mediante 3D, Inteligencia Artificial y Realidad Extendida.',
  keywords: ['3D', 'Realidad Virtual', 'Realidad Aumentada', 'IA', 'Transformacion Digital', 'Gemelos Digitales', 'XR', 'Brief'],
  authors: [{ name: 'Trinity 3D' }],
  generator: 'Trinity 3D',
  metadataBase: new URL('https://trinity3d.online'),
  openGraph: {
    title: 'Trinity 3D | Brief Corporativo',
    description: 'Ecosistema tecnologico que fusiona 3D, IA y Realidad Extendida para transformar industrias.',
    url: 'https://trinity3d.online',
    siteName: 'Trinity 3D',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
