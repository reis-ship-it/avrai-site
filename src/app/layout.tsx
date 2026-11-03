import type { Metadata, Viewport } from "next";
import "./globals.css";

const description =
  "AVRAI is building a more thoughtful way to find places and plans that fit the moment.";

export const metadata: Metadata = {
  applicationName: "AVRAI",
  title: {
    default: "AVRAI — Real life has context",
    template: "%s | AVRAI",
  },
  description,
  metadataBase: new URL("https://www.avrai.org"),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AVRAI — Real life has context",
    description,
    url: "https://www.avrai.org",
    siteName: "AVRAI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AVRAI — Real life has context",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
};

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AVRAI",
  url: "https://www.avrai.org",
  email: "info@avrai.org",
  description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
      </body>
    </html>
  );
}
