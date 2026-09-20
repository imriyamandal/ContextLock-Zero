import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContextLock Zero | AI Decision Immune System",
  description: "Git tracks code. ContextLock Zero protects project decisions against hidden contradictions, churn, and architectural drift.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen w-full bg-[#070B14] text-[#F8FAFC] antialiased selection:bg-[#8B5CF6] selection:text-white flex flex-col relative overflow-x-hidden">
        {/* Ambient Glows */}
        <div className="ambient-glow-purple top-10 left-10 pointer-events-none fixed" />
        <div className="ambient-glow-cyan top-40 right-20 pointer-events-none fixed" />

        <main className="flex-1 w-full relative z-10 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
