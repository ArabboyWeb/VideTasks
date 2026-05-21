import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vide Tasks AI",
  description: "Vide Tasks AI — a focused AI task workspace for capturing, organizing, and finishing important work.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" async></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
