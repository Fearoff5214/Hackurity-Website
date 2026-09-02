import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The student-run Cybersecurity Club at REVA University, Bengaluru. Founded in 2024. See our current event, our members and our faculty in charge.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About the Cybersecurity Club — REVA University, Bengaluru",
    description:
      "Weekly hands-on security sessions, competitions and our annual hackathon. Meet the team behind the club.",
    url: "https://revacyberclub.tech/about-us",
  },
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
