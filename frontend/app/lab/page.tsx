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

let globalAnalysisState = {
  activeTopic: "",
  isProcessing: false
};

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
  const initiatedRef = useRef(false);

  useEffect(() => {
    if (initialTopic && !initiatedRef.current && phase === "idle") {
      if (globalAnalysisState.isProcessing && globalAnalysisState.activeTopic === initialTopic) {
        return;
      }
      initiatedRef.current = true;
      setTopic(initialTopic);
      runAnalysis(initialTopic);
    }
  }, [initialTopic]);

  const runAnalysis = async (overriddenTopic?: string) => {
    const currentTopic = (overriddenTopic || topic).trim();
    if (!currentTopic || phase === "running" || globalAnalysisState.isProcessing) return;
    
    setPhase("running");
    globalAnalysisState.isProcessing = true;
    globalAnalysisState.activeTopic = currentTopic;
    
    setResult(null);
    setResultId(null);
    setError(null);
    setStepStatuses({});
    setStepTimes({});
    abortRef.current = new AbortController();

    try {
      for (const step of pipelineSteps) {
        if (abortRef.current?.signal.aborted) break;
        setStepStatuses(prev => ({ ...prev, [step.key]: "running" }));
        await new Promise(r => setTimeout(r, step.durationMs));
        setStepStatuses(prev => ({ ...prev, [step.key]: "done" }));
        setStepTimes(prev => ({ ...prev, [step.key]: `${(step.durationMs / 1000).toFixed(1)}s` }));
      }

      const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const API_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: currentTopic }),
        signal: abortRef.current?.signal,
      });
      
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);

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
        setError(err.message || "Failed to complete analysis.");
      }
    } finally {
      setPhase("done");
      globalAnalysisState.isProcessing = false;
      globalAnalysisState.activeTopic = "";
    }
  };

  return (
    <AppLayout>
      <div className="p-10 max-w-7xl mx-auto page-enter">
        <div className="mb-10 stagger-container">
          <p className="font-headline text-[10px] uppercase font-bold tracking-[0.4em] text-accent-soft mb-2 stagger-item">The Lab</p>
          <h1 className="text-4xl font-headline font-bold text-charcoal tracking-tight stagger-item">Analysis Lab</h1>
          <p className="text-charcoal/60 text-sm mt-3 max-w-2xl font-body stagger-item">Initiate deep semantic cross-analysis. Synthesize hidden contradictions and research gaps from millions of peer-reviewed sources.</p>
        </div>

        <div className="glass-card rounded-2xl p-8 mb-10 stagger-item shadow-soft">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30" style={{ fontSize: "20px" }}>search</span>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runAnalysis()}
                placeholder="Enter research topic..."
                className="w-full bg-cream-100/50 text-charcoal border border-charcoal/5 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-charcoal/20 focus:bg-white placeholder:text-charcoal/20 transition-all font-body"
              />
            </div>
            <button
              onClick={() => runAnalysis()}
              disabled={phase === "running" || !topic.trim()}
              className="btn-primary disabled:opacity-50 px-8 rounded-xl"
            >
              {phase === "running" ? <div className="spinner !border-cream-50/30 !border-t-cream-50" /> : (
                <><span className="material-symbols-outlined text-lg">play_arrow</span> Run Analysis</>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 glass-card rounded-2xl p-8 stagger-item shadow-soft">
            <p className="font-headline text-[10px] uppercase font-bold tracking-widest text-charcoal/40 mb-6">Analysis Pipeline</p>
            <div className="space-y-5">
              {pipelineSteps.map((step) => {
                const status = stepStatuses[step.key] ?? "pending";
                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                      ${status === "done" ? "bg-accent-soft/10 text-accent-soft" :
                        status === "running" ? "bg-charcoal text-cream-50 shadow-md scale-110" : "bg-charcoal/5 text-charcoal/20"}`}>
                      {status === "running" ? (
                        <div className="spinner !border-cream-50/20 !border-t-cream-50" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
                      ) : (
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{status === "done" ? "check_circle" : step.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-body transition-colors duration-300 ${status === "pending" ? "text-charcoal/30" : "text-charcoal font-medium"}`}>{step.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3 glass-card rounded-2xl p-8 stagger-item shadow-soft min-h-[400px] flex flex-col">
            <p className="font-headline text-[10px] uppercase font-bold tracking-widest text-charcoal/40 mb-6">Lab Feed</p>
            {(phase === "done" || result) ? (
              <div className="space-y-6 flex-1 flex flex-col">
                {error && <div className="text-sm text-red-500 font-medium bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}
                {result?.gaps && result.gaps.length > 0 ? (
                  <>
                    <p className="text-[10px] text-accent-soft uppercase font-headline tracking-[0.2em] font-bold">{result.gaps.length} Gaps Detected</p>
                    <div className="space-y-3 flex-1">
                      {result.gaps.slice(0, 3).map((g: any, i: number) => (
                        <div key={i} className="p-5 bg-white/40 rounded-2xl border border-charcoal/5 hover:border-charcoal/10 transition-all group cursor-default">
                          <p className="text-sm text-charcoal font-bold mb-1.5 font-headline group-hover:text-accent-soft transition-colors">{g.title || "Observation"}</p>
                          <p className="text-xs text-charcoal/50 leading-relaxed line-clamp-2 font-body">{g.description || g.gap}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 mt-auto">
                      <Link href={resultId ? `/gap-explorer?id=${resultId}` : "/gap-explorer"} className="btn-primary w-full rounded-xl active:scale-95">
                        <span className="material-symbols-outlined text-lg">explore</span> View Full Analysis
                      </Link>
                    </div>
                  </>
                ) : phase === "done" && !error && (
                  <div className="flex flex-col items-center justify-center flex-1 opacity-20">
                    <span className="material-symbols-outlined text-5xl mb-4">sentiment_neutral</span>
                    <p className="text-sm font-headline uppercase tracking-widest font-bold">No significant gaps detected</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                <span className="material-symbols-outlined text-6xl mb-4">analytics</span>
                <p className="text-sm font-headline font-bold uppercase tracking-widest">Feed Standby</p>
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
    <Suspense fallback={<div className="p-10 text-charcoal/40 font-headline font-bold text-xs uppercase tracking-widest">Initializing Lab...</div>}>
      <LabContent />
    </Suspense>
  );
}

