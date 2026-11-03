import type { Metadata } from "next";
import "./globals.css";

const description =
  "AVRAI is building a more thoughtful way to discover places and make plans that fit your real-world context.";

export const metadata: Metadata = {
  applicationName: "AVRAI",
  title: {
    default: "AVRAI — Places and plans that fit the moment",
    template: "%s | AVRAI",
  },
  description,
  metadataBase: new URL("https://www.avrai.org"),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AVRAI — Places and plans that fit the moment",
    description,
    url: "https://www.avrai.org",
    siteName: "AVRAI",
    type: "website",
    images: [
      {
        url: "/avrai-logo.png",
        width: 1024,
        height: 1024,
        alt: "AVRAI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AVRAI — Places and plans that fit the moment",
    description,
    images: ["/avrai-logo.png"],
  },
};

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AVRAI",
  url: "https://www.avrai.org",
  email: "info@avrai.org",
  logo: "https://www.avrai.org/avrai-logo.png",
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
