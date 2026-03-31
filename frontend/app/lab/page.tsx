"use client";
import AppLayout from "../components/AppLayout";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

const pipelineSteps = [
  { key: "search",        label: "Searching papers...",          icon: "search",        durationMs: 1200 },
  { key: "claims",        label: "Extracting claims...",          icon: "auto_stories",  durationMs: 1800 },
  { key: "contradictions",label: "Detecting contradictions...",   icon: "rule",          durationMs: 1500 },
  { key: "overlap",       label: "Analyzing semantic overlap...", icon: "psychology",    durationMs: 1200 },
  { key: "gaps",          label: "Synthesizing gaps...",          icon: "insights",      durationMs: 1400 },
];

type StepStatus = "pending" | "running" | "done";

function LabContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";
  const [topic, setTopic] = useState(initialTopic);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});
  const [stepTimes, setStepTimes] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ gaps: any[]; contradictions: any[]; papers: any[]; claims: any[] } | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { user } = useAuth();

  // Run analysis if topic is present in URL on mount
  useEffect(() => {
    if (initialTopic && phase === "idle") {
      setTopic(initialTopic);
      setTimeout(() => runAnalysis(initialTopic), 100);
    }
  }, [initialTopic]);

  const runAnalysis = async (overriddenTopic?: string) => {
    const currentTopic = overriddenTopic || topic.trim();
    if (!currentTopic || phase === "running") return;
    
    setPhase("running");
    setResult(null);
    setResultId(null);
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
        body: JSON.stringify({ topic: currentTopic }),
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);

      // Persist to Firestore if logged in
      if (user) {
        const docRef = await addDoc(collection(db, "analyses"), {
          userId: user.uid,
          topic: data.topic,
          papers: data.papers || [],
          gaps: data.gaps || [],
          contradictions: data.contradictions || [],
          claims: data.claims || [],
          status: "complete",
          createdAt: serverTimestamp(),
        });
        setResultId(docRef.id);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Analysis Error:", err);
        setError(err.message || "Failed to complete analysis. Please ensure backend is running.");
      }
    }
    setPhase("done");
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto page-enter">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">The Lab</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analysis Lab</h1>
          <p className="text-on-surface-variant text-sm mt-2">Initiate deep semantic cross-analysis. Synthesize hidden contradictions and research gaps from millions of peer-reviewed sources.</p>
        </div>

        <div className="glass-card border border-white/[0.05] rounded-xl p-6 mb-8 stagger-item">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: "18px" }}>search</span>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runAnalysis()}
                placeholder="Enter research topic..."
                className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors duration-200"
              />
            </div>
            <button
              onClick={() => runAnalysis()}
              disabled={phase === "running" || !topic.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {phase === "running" ? <div className="spinner" /> : (
                <>Run Analysis</>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 glass-card border border-white/[0.05] rounded-xl p-6 stagger-item">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-5">Analysis Pipeline</p>
            <div className="space-y-4">
              {pipelineSteps.map((step) => {
                const status = stepStatuses[step.key] ?? "pending";
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 
                      ${status === "done" ? "bg-secondary/15 text-secondary" :
                        status === "running" ? "bg-primary/15 text-primary" : "bg-surface-container text-outline"}`}>
                      {status === "running" ? (
                        <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
                      ) : (
                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>{status === "done" ? "check_circle" : step.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${status === "pending" ? "text-outline" : "text-on-surface"}`}>{step.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3 glass-card border border-white/[0.05] rounded-xl p-6 stagger-item">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-5">Lab Feed</p>
            {/* Feed Content */}
            {(phase === "done" || result) && (
              <div className="space-y-4">
                {error && <div className="text-xs text-error">{error}</div>}
                {result?.gaps && result.gaps.length > 0 ? (
                  <>
                    <p className="text-xs text-on-surface-variant uppercase font-mono">Gaps Detected</p>
                    <div className="space-y-2">
                      {result.gaps.slice(0, 3).map((g: any, i: number) => (
                        <div key={i} className="p-3 bg-white/[0.02] rounded border border-white/[0.04]">
                          <p className="text-sm text-white">{g.gap || g.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 flex gap-3">
                      <Link href={resultId ? `/gap-explorer?id=${resultId}` : "/gap-explorer"} className="btn-primary text-xs px-4 py-2.5 rounded">
                        View Full Analysis
                      </Link>
                    </div>
                  </>
                ) : phase === "done" && <p className="text-sm text-outline">No gaps found.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function LabPage() {
  return (
    <Suspense fallback={<div>Loading Lab...</div>}>
      <LabContent />
    </Suspense>
  );
}
