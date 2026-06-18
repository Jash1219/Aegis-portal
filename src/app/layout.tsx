import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import GlobalNav from "@/components/layout/GlobalNav";
import Header from "@/components/layout/Header";
import GlobalFooter from "@/components/layout/GlobalFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AEGIS Developer Portal",
  description: "Deterministic Invoice Validation for NBFCs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-screen bg-background text-on-surface">
        <div className="fixed inset-0 pointer-events-none z-0 grid-overlay" />
        <GlobalNav />
        <div className="flex flex-col flex-1 ml-64 relative z-10">
          <Header />
          <main className="flex-1 pt-16">
            <div className="mx-auto max-w-container-max w-full px-gutter py-xl md:py-xxl">
              {children}
            </div>
          </main>
          <GlobalFooter />
        </div>
      </body>
    </html>
  );
}
