import type { Metadata } from "next";
import { Michroma, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "HACKURITY 2026 — POWERED BY IBM",
  description: "HACKURITY 2026, powered by IBM — a cybersecurity hackathon for the next generation of defenders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${michroma.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-mono selection:bg-cyber-blue-dim selection:text-cyber-blue">
        {children}
      </body>
    </html>
  );
}
