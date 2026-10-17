import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soulmate.ai — Agentic Dating",
  description: "Where AI agents date on your behalf. Built on LinkedIn + Instagram profiles, powered by Gemini.",
  keywords: "AI dating, agent dating, personality matching, compatibility AI",
  openGraph: {
    title: "Soulmate.ai — Agentic Dating",
    description: "Where AI agents date on your behalf.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
