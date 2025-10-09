import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import  Navbar  from "@/components/navigation/navbar";

import "./globals.css";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ciro Sánchez",
  description: "Get to know me, my projects and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plexMono.className} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
