import { createFileRoute, Link } from "@tanstack/react-router";
import BinaryFlowField from "@/components/club/BinaryFlowField";

export const Route = createFileRoute("/hackurity")({
  head: () => ({
    meta: [
      { title: "Hackurity 2026 — Cybersecurity Hackathon at REVA University" },
      {
        name: "description",
        content:
          "Hackurity 2026 is the cybersecurity hackathon hosted by the Cybersecurity Club at REVA University, Bangalore. Registration is open.",
      },
      { property: "og:title", content: "Hackurity 2026 — Cybersecurity Hackathon" },
      {
        property: "og:description",
        content: "Registration is open for Hackurity 2026, hosted by the Cybersecurity Club at REVA University.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HackurityPage,
});

/**
 * Placeholder host route for the existing Hackurity page.
 * In your own repo this is where the current /app/page.tsx content lives.
 */
function HackurityPage() {
  return (
    <div className="club-root relative min-h-screen">
      <BinaryFlowField />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-24">
        <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-cyber-tan">
          {"// EVENT_PAGE"}
        </span>
        <h1 className="mt-4 font-heading text-2xl leading-relaxed uppercase md:text-3xl">
          Hackurity 2026
        </h1>
        <p className="mt-5 font-mono text-[12px] leading-relaxed text-cyber-gray">
          This route hosts the Hackurity event page. Drop the existing Hackurity page content here
          and it will sit under the club site at <span className="text-cyber-tan">/hackurity</span>,
          with the club home page living at the root.
        </p>
        <Link
          to="/"
          className="mt-8 w-fit border border-cyber-tan/50 bg-cyber-tan/10 px-5 py-3 font-mono text-[11px] font-bold tracking-widest text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/20"
        >
          ← Back to club home
        </Link>
      </main>
    </div>
  );
}
