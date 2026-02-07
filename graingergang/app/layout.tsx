import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ProjectProvider } from "./context/ProjectContext";
import Providers from "./providers"; // animation wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grainger Project Builder",
  description: "AI-powered industrial project planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProjectProvider>
          <Providers>
            {children}
          </Providers>
        </ProjectProvider>
      </body>
    </html>
  );
}
