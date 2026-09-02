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
  metadataBase: new URL("https://revacyberclub.tech"),
  title:{
    default: "Hackurity 2026 — REVA University, Bengaluru",
    template: "%s — Cybersecurity Club, REVA University",
  },
  description:
    "Hackurity 2026, powered by IBM — a 24-hour cybersecurity hackathon at REVA University, Bengaluru, run by the student Cybersecurity Club. AI security, broad cybersecurity and IoT tracks.",
  openGraph: {
    type : "website",
    siteName: "Cybersecurity Club — REVA University, Bengaluru",
    title: "Hackurity 2026 — REVA University, Bengaluru",
    description:
      "A 24-hour cybersecurity hackathon on 14–15 October 2026, powered by IBM. Pick a track, build over the weekend, present to a panel.",
    url: "https://revacyberclub.tech",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
