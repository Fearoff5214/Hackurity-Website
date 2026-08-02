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
  title: "OPERATION // ZERO_DAY — Global Cybersecurity Hackathon",
  description: "Futuristic cybersecurity hackathon and Capture The Flag (CTF) infiltration interface.",
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
