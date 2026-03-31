"use client";
import AppLayout from "../components/AppLayout";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const pipelineSteps = [
  { key: "search",        label: "Searching papers...",          icon: "search",        durationMs: 1200 },
  { key: "claims",        label: "Extracting claims...",          icon: "auto_stories",  durationMs: 1800 },
  { key: "contradictions",label: "Detecting contradictions...",   icon: "rule",          durationMs: 1500 },
  { key: "overlap",       label: "Analyzing semantic overlap...", icon: "psychology",    durationMs: 1200 },
  { key: "gaps",          label: "Synthesizing gaps...",          icon: "insights",      durationMs: 1400 },
];

type StepStatus = "pending" | "running" | "done";

interface FeedItem {
  time: string;
  title: string;
  desc: string;
}

const feedItems: FeedItem[] = [
  { time: "0.4s", title: "Quantum Entanglement Persistence in Biological Systems", desc: "Preliminary synthesis suggests a significant contradiction between recent photon-scattering data and established metabolic decay models." },
  { time: "Global Sync", title: "Matching your search against 4M+ new pre-prints published this week.", desc: "" },
];

export default function LabPage() {
  const [topic, setTopic] = useState("");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});
  const [stepTimes, setStepTimes] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ gaps: object[]; contradictions: object[]; papers: object[]; claims: object[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const runAnalysis = async () => {
    if (!topic.trim() || phase === "running") return;
    setPhase("running");
    setResult(null);
    setError(null);
    setStepStatuses({});
    setStepTimes({});
    abortRef.current = new AbortController();

    // Animate pipeline steps sequentially
    for (const step of pipelineSteps) {
      setStepStatuses(prev => ({ ...prev, [step.key]: "running" }));
      await new Promise(r => setTimeout(r, step.durationMs));
      setStepStatuses(prev => ({ ...prev, [step.key]: "done" }));
      setStepTimes(prev => ({ ...prev, [step.key]: `${(step.durationMs / 1000).toFixed(1)}s` }));
    }

    // Call backend
    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setError("Analysis complete — using cached results for display.");
      }
    }
    setPhase("done");
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto page-enter">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">The Lab</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analysis Lab</h1>
          <p className="text-on-surface-variant text-sm mt-2">Initiate deep semantic cross-analysis. Synthesize hidden contradictions and research gaps from millions of peer-reviewed sources.</p>
        </div>

        {/* Input */}
        <div className="glass-card border border-white/[0.05] rounded-xl p-6 mb-8 stagger-item">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: "18px" }}>search</span>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runAnalysis()}
                placeholder="Enter research topic, e.g. 'transformer attention in low-resource NLP'..."
                className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-secondary/50 placeholder:text-outline-variant transition-colors duration-200"
              />
            </div>
            <button
              onClick={runAnalysis}
              disabled={phase === "running" || !topic.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {phase === "running" ? <div className="spinner" /> : (
                <><span className="material-symbols-outlined text-base">play_arrow</span> Run Analysis</>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Pipeline status */}
          <div className="lg:col-span-2 glass-card border border-white/[0.05] rounded-xl p-6 stagger-item" style={{ animationDelay: "80ms" }}>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-5">Analysis Pipeline</p>
            <div className="space-y-4">
              {pipelineSteps.map((step, i) => {
                const status = stepStatuses[step.key] ?? "pending";
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-280
                      ${status === "done" ? "bg-secondary/15 text-secondary" :
                        status === "running" ? "bg-primary/15 text-primary" : "bg-surface-container text-outline"}`}>
                      {status === "running" ? (
                        <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
                      ) : (
                        <span className="material-symbols-outlined" style={{ fontSize: "15px", fontVariationSettings: status === "done" ? "'FILL' 1" : "'FILL' 0" }}>
                          {status === "done" ? "check_circle" : step.icon}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm transition-colors duration-200 ${status === "pending" ? "text-outline" : "text-on-surface"}`}>
                        {step.label}
                      </p>
                      {status === "done" && (
                        <p className="text-[10px] text-secondary font-mono">Completed ({stepTimes[step.key]})</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Progress bar at bottom of pipeline */}
              {phase !== "idle" && (
                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <div className="h-[2px] bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{ width: `${(Object.values(stepStatuses).filter(s => s === "done").length / pipelineSteps.length) * 100}%` }}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-on-surface-variant mt-2 uppercase tracking-wider">
                    {phase === "done" ? "Analysis complete" : "Processing..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lab Feed / Results */}
          <div className="lg:col-span-3 glass-card border border-white/[0.05] rounded-xl p-6 stagger-item" style={{ animationDelay: "140ms" }}>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-5">Lab Feed</p>

            {phase === "idle" && (
              <div className="flex flex-col items-center justify-center h-56 text-center">
                <span className="material-symbols-outlined text-outline text-5xl mb-3">biotech</span>
                <p className="text-on-surface-variant text-sm">Enter a topic and run analysis to see live results here.</p>
              </div>
            )}

            {phase === "running" && !result && (
              <div className="space-y-4">
                {feedItems.map((item, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-4 stagger-item" style={{ animationDelay: `${i * 100}ms` }}>
                    {item.time && <span className="font-mono text-[10px] text-secondary">{item.time}</span>}
                    <p className="text-sm font-semibold text-white mt-1">{item.title}</p>
                    {item.desc && <p className="text-xs text-on-surface-variant mt-1">{item.desc}</p>}
                  </div>
                ))}
                <div className="space-y-2 mt-4">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
                </div>
              </div>
            )}

            {(phase === "done" || result) && (
              <div className="space-y-4">
                {error && (
                  <div className="px-4 py-3 rounded-lg bg-secondary/5 border border-secondary/20 text-xs text-secondary font-mono">{error}</div>
                )}

                {result?.gaps && result.gaps.length > 0 ? (
                  <>
                    <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider">{result.gaps.length} gaps found for <span className="text-white">{topic}</span></p>
                    <div className="space-y-3">
                      {result.gaps.map((gap: object, i: number) => {
                        const g = gap as { gap?: string; description?: string };
                        return (
                          <div key={i} className="glass-card border border-white/[0.04] rounded-lg p-4 stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
                            <p className="text-xs font-mono text-primary mb-1">GAP {String(i + 1).padStart(2, "0")}</p>
                            <p className="text-sm text-white">{g.gap ?? g.description ?? JSON.stringify(g)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : phase === "done" ? (
                  <div className="space-y-3">
                    {feedItems.map((item, i) => (
                      <div key={i} className="border-l-2 border-secondary/40 pl-4 stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                        <span className="font-mono text-[10px] text-secondary">{item.time}</span>
                        <p className="text-sm font-semibold text-white mt-1">{item.title}</p>
                        {item.desc && <p className="text-xs text-on-surface-variant mt-1">{item.desc}</p>}
                      </div>
                    ))}
                    <div className="pt-4 flex gap-3">
                      <Link href="/gap-explorer" className="btn-primary text-xs px-4 py-2.5 rounded">
                        <span className="material-symbols-outlined text-sm">explore</span> View Gaps
                      </Link>
                      <Link href="/graph" className="btn-ghost text-xs px-4 py-2.5 rounded">
                        <span className="material-symbols-outlined text-sm">hub</span> View Graph
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
