import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HyperGains Pro - Elite Bodybuilding App",
  description: "Transform your physique with personalized training, nutrition, and community support",
  keywords: ["bodybuilding", "fitness", "nutrition", "workout", "muscle building", "training"],
  authors: [{ name: "HyperGains Pro" }],
  creator: "HyperGains Pro",
  publisher: "HyperGains Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HyperGains Pro",
  },
  openGraph: {
    type: "website",
    siteName: "HyperGains Pro",
    title: "HyperGains Pro - Elite Bodybuilding App",
    description: "Transform your physique with personalized training, nutrition, and community support",
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperGains Pro - Elite Bodybuilding App",
    description: "Transform your physique with personalized training, nutrition, and community support",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#ff6b35",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
