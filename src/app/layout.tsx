import type { Metadata } from "next";
import { Inter, Sacramento } from "next/font/google";
import "./globals.css";
import HeartCursor from "@/components/HeartCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sacramento = Sacramento({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-sacramento" 
});

export const metadata: Metadata = {
  title: "Our Sanctuary",
  description: "February 2026",
  openGraph: {
    title: "Our Sanctuary",
    description: "February 2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sacramento.variable} font-sans`}>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <HeartCursor />
        {children}
      </body>
    </html>
  );
}
