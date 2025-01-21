import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Panels",
  description: "A lightweight Web App CBR/CBZ/CBT Reader",
  applicationName: "Panels",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "Panels",
    startupImage: "/favicon.ico",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Panels",
    description: "A Lightweight Web App CBR/CBZ/CBT Reader",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} antialiased font-[family-name:var(--font-geist-sans)]`}
      >
        <Toaster richColors swipeDirections={["left", "right"]} />
        {children}
      </body>
    </html>
  );
}
