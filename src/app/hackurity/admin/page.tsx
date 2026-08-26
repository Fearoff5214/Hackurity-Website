"use client";

import { useEffect, useState } from "react";
import type { RegistrationRecord } from "@/lib/registrations";

export default function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRegistrations = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/admin/registrations");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to load registrations.");
      setRegistrations(payload.registrations);
      setAuthenticated(true);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations().finally(() => setCheckingSession(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Login failed.");
      setPassword("");
      await loadRegistrations();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setRegistrations([]);
  };

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black font-mono text-sm text-cyber-gray">
        Loading...
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm border border-cyber-blue/20 bg-cyber-dark/60 p-6">
          <h1 className="font-heading text-lg uppercase text-white">Admin login</h1>
          <p className="mt-1 font-mono text-xs text-cyber-gray">Hackurity registrations</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="mt-5 w-full border border-cyber-tan/30 bg-cyber-dark px-3 py-2.5 font-mono text-sm text-white focus:border-cyber-tan focus:outline-none"
          />
          {loginError && <p className="mt-2 font-mono text-xs text-red-400">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn || !password}
            className="mt-4 w-full border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-2.5 font-mono text-xs font-bold tracking-widest text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loggingIn ? "Checking..." : "Log in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl uppercase text-white">Hackurity registrations</h1>
            <p className="mt-1 font-mono text-xs text-cyber-gray">{registrations.length} team{registrations.length === 1 ? "" : "s"} registered</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadRegistrations}
              disabled={loading}
              className="border border-cyber-blue/30 px-3 py-2 font-mono text-xs tracking-widest text-cyber-gray uppercase transition-colors hover:border-cyber-blue hover:text-white disabled:opacity-40"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <a
              href="/api/admin/registrations/export"
              className="border border-cyber-tan/50 bg-cyber-tan/10 px-3 py-2 font-mono text-xs font-bold tracking-widest text-cyber-tan uppercase transition-colors hover:bg-cyber-tan/20"
            >
              Export CSV
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-red-500/30 px-3 py-2 font-mono text-xs tracking-widest text-red-400 uppercase transition-colors hover:border-red-500 hover:bg-red-950/30"
            >
              Log out
            </button>
          </div>
        </div>

        {loadError && <p className="mt-4 font-mono text-xs text-red-400">{loadError}</p>}

        <div className="mt-6 overflow-x-auto border border-cyber-blue/15">
          <table className="w-full min-w-[900px] border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-cyber-blue/15 bg-cyber-dark/60 text-left text-cyber-tan">
                <th className="px-3 py-2">Submitted</th>
                <th className="px-3 py-2">Team</th>
                <th className="px-3 py-2">University</th>
                <th className="px-3 py-2">Track</th>
                <th className="px-3 py-2">Level</th>
                <th className="px-3 py-2">Members</th>
                <th className="px-3 py-2">Project idea</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-b border-cyber-blue/10 align-top text-cyber-gray">
                  <td className="whitespace-nowrap px-3 py-3">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</td>
                  <td className="px-3 py-3 text-white">{r.teamName}</td>
                  <td className="px-3 py-3">{r.university}</td>
                  <td className="px-3 py-3">{r.selectedDomain}</td>
                  <td className="px-3 py-3">{r.experienceLevel}</td>
                  <td className="px-3 py-3">
                    <ul className="space-y-1">
                      {r.members.map((m, i) => (
                        <li key={i}>
                          {m.name} <span className="text-cyber-gray/60">({m.role})</span> — {m.email}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="max-w-xs px-3 py-3">{r.projectIdea}</td>
                </tr>
              ))}
              {registrations.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-cyber-gray/60">
                    No registrations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
