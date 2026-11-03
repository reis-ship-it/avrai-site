import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  applicationName: "AVRAI",
  title: {
    default: "AVRAI",
    template: "%s | AVRAI",
  },
  description:
    "AVRAI is an intelligence layer for real life, helping people, businesses, communities, and agents understand context, choose better next steps, and improve through feedback.",
  metadataBase: new URL("https://avrai.org"),
  alternates: {
    canonical: "https://avrai.org",
  },
  keywords: [
    "AVRAI",
    "real-world intelligence",
    "community intelligence",
    "business context",
    "local discovery",
    "agent context",
    "feedback loops",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AVRAI",
    description:
      "An intelligence layer for real life: context, next steps, feedback, and clear control.",
    url: "https://avrai.org",
    siteName: "AVRAI",
    type: "website",
    images: [
      {
        url: "/avrai-logo.png",
        width: 1024,
        height: 1024,
        alt: "AVRAI logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AVRAI",
    description:
      "An intelligence layer for real life: context, next steps, feedback, and clear control.",
    images: [
      {
        url: "/avrai-logo.png",
        alt: "AVRAI logo",
      },
    ],
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AVRAI",
    url: "https://avrai.org",
    email: "info@avrai.org",
    logo: "https://avrai.org/avrai-logo.png",
    description:
      "AVRAI is an intelligence layer for real life, helping people, businesses, communities, and agents understand context, choose better next steps, and improve through feedback.",
    sameAs: ["https://avrai-demos.vercel.app", "https://business.avrai.org"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AVRAI",
    url: "https://avrai.org",
    description:
      "Canonical AVRAI product explanation, trust boundaries, demos, business portal access, and waitlist.",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script src="/intelligence-scroll.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
