import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

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
      <body className="antialiased">
        <Toaster richColors swipeDirections={["left", "right"]} />
        <div className="flex justify-center items-center min-h-dvh">
          <main className="flex flex-col justify-center text-center w-full max-w-screen-xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
