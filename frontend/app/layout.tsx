import type { Metadata } from "next";
import "@/styles/globals.css";

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
    <html lang="en" className="dark">
      <body className="h-screen w-screen overflow-hidden bg-background text-slate-100 antialiased selection:bg-primary selection:text-white flex flex-col">
        {/* Ambient Glows */}
        <div className="ambient-glow-purple top-10 left-10 pointer-events-none" />
        <div className="ambient-glow-cyan top-40 right-20 pointer-events-none" />

        <main className="flex-1 w-full h-full overflow-hidden relative z-10 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
