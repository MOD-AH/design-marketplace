import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Design Marketplace",
    template: "%s | Design Marketplace",
  },
  description:
    "A curated marketplace for premium design assets, templates, and resources.",
  keywords: ["design", "marketplace", "templates", "assets", "UI", "graphics"],
  authors: [{ name: "Design Marketplace Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://design-marketplace.com",
    siteName: "Design Marketplace",
    title: "Design Marketplace",
    description: "A curated marketplace for premium design assets and resources.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Marketplace",
    description: "A curated marketplace for premium design assets and resources.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9",
};

import { Navbar } from "@/components/Navbar";
import { ToastProvider } from "@/components/ui/Toast";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0a0b0e] font-sans text-white">
        <AuthProvider>
          <Navbar />
          {children}
          <ToastProvider />
        </AuthProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
