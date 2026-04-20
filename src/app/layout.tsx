import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ido — The Ultimate Creator Toolkit",
  description: "Convert, edit, and resize files for social media. The all-in-one toolkit for content creators.",
  keywords: "image converter, video to gif, social media resize, instagram grid, content creator tools",
  openGraph: {
    title: "ido — I do it for you",
    description: "Convert images, resize for social media, cut instagram grids. Free forever.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
