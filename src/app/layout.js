import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "BattleBit Community Servers",
  description: "Resources and tools to help you run your own BattleBit community servers.",
  metadataBase: new URL("https://battlebit.community"), // Set your actual base URL here
  openGraph: {
    title: "BattleBit Community Servers",
    type: "website",
    url: "https://battlebit.community",
    siteName: "BattleBit Community Servers",
    description: "Join the BattleBit Community Servers and access resources and tools to host and run your own community servers.",
    images: [
      {
        url: "/BBCS_White_Large.svg", // Path to your SVG logo
        width: 1200,
        height: 630,
        alt: "BattleBit Community Servers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@battlebitcommunity", // Update with your actual Twitter handle if available
    creator: "@battlebitcommunity", // Update with your actual Twitter handle if applicable
    title: "BattleBit Community Servers",
    description: "Resources and tools to help you run your own BattleBit community servers.",
    images: [
      {
        url: "/BBCS_White_Large.svg", // Path to your SVG logo for Twitter
        width: 1200,
        height: 630,
        alt: "BattleBit Community Servers",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
        <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:creator" content={metadata.twitter.creator} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0].url} />
        <meta name="twitter:image:width" content={metadata.twitter.images[0].width} />
        <meta name="twitter:image:height" content={metadata.twitter.images[0].height} />
        <meta name="twitter:image:alt" content={metadata.twitter.images[0].alt} />

        {/* Favicon (SVG with PNG fallback) */}
        <link rel="icon" type="image/svg+xml" href="/BBCS_White_Large.svg" />
        <link rel="alternate icon" href="/favicon.png" /> {/* PNG fallback for older browsers */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
