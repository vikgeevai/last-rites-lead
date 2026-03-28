import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Last Rites Lead — Every Lead Has a Deadline.",
  description:
    "The precision CRM for service businesses that cannot afford to lose a single enquiry. Real-time capture, AI intelligence, and automated follow-up — built for those who close.",
  keywords: "CRM, lead management, booking, orders, client portal, analytics, service business",
  openGraph: {
    title: "Last Rites Lead — Every Lead Has a Deadline.",
    description: "The precision CRM for service businesses. Capture every lead. Close every deal.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
