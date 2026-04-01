"use client";
import AppLayout from "../components/AppLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topicInput, setTopicInput] = useState("");

  useEffect(() => {
    async function fetchAnalyses() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "analyses"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateLabel: doc.data().createdAt?.toDate().toLocaleDateString() || "Recent"
        }));
        setAnalyses(fetched);
      } catch (error) {
        console.error("Error fetching analyses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalyses();
  }, [user]);

  const totalGaps = analyses.reduce((acc, curr) => acc + (curr.gaps?.length || 0), 0);
  const totalPapers = analyses.reduce((acc, curr) => acc + (curr.papers?.length || 0), 0);
  const totalContradictions = analyses.reduce((acc, curr) => acc + (curr.contradictions?.length || 0), 0);

  const stats = [
    { label: "Gaps Discovered", value: totalGaps.toString(), icon: "insights" },
    { label: "Papers Indexed", value: totalPapers.toString(), icon: "auto_stories" },
    { label: "Contradictions", value: totalContradictions.toString(), icon: "rule" },
    { label: "Analyses Run", value: analyses.length.toString(), icon: "analytics" },
  ];

  return (
    <AppLayout>
      <div className="p-10 max-w-7xl mx-auto page-enter">
        {/* Header */}
        <div className="flex items-start justify-between mb-12 stagger-container">
          <div className="stagger-item">
            <p className="font-headline text-[10px] uppercase font-bold tracking-[0.4em] text-accent-soft mb-2">Research Core · Precision Mode</p>
            <h1 className="text-4xl font-headline font-bold text-charcoal tracking-tight">Intelligence Synthesis</h1>
            <p className="text-charcoal/80 text-sm mt-3 max-w-2xl font-body">Initiate a cross-domain literature scan to identify structural gaps and emergent contradictions.</p>
          </div>
          <Link href="/lab" className="btn-primary rounded-xl px-6 py-4 stagger-item shadow-soft active:scale-95">
            <span className="material-symbols-outlined text-xl">biotech</span>
            <span className="font-bold">New Analysis</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 stagger-container">
          {stats.map((stat, i) => (
            <div key={stat.label} className="glass-card rounded-2xl p-8 stagger-item shadow-soft group hover:translate-y-[-4px] transition-all duration-300" style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}>
              <div className="flex items-start justify-between mb-4">
                <span className="material-symbols-outlined text-charcoal/20 group-hover:text-accent-soft transition-colors" style={{ fontSize: "24px" }}>{stat.icon}</span>
              </div>
              <p className="text-4xl font-headline font-bold text-charcoal tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-charcoal/40 font-headline uppercase font-bold tracking-widest mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search/Start new */}
        <div className="glass-card rounded-2xl p-8 mb-12 stagger-item shadow-soft">
          <p className="font-headline text-[10px] text-charcoal/40 uppercase font-bold tracking-widest mb-4">New Scan</p>
          <div className="flex gap-4">
            <div className="flex-1 relative">
               <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30" style={{ fontSize: "20px" }}>search</span>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter research topic, e.g. 'transformer attention in low-resource NLP'..."
                className="w-full bg-cream-100/50 text-charcoal border border-charcoal/5 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-charcoal/20 focus:bg-white placeholder:text-charcoal/20 transition-all font-body"
              />
            </div>
            <Link 
              href={`/lab?topic=${encodeURIComponent(topicInput)}`}
              className={`btn-primary rounded-xl px-10 active:scale-95 ${!topicInput.trim() ? "opacity-50 pointer-events-none" : ""}`}
            >
              <span className="material-symbols-outlined text-xl">send</span>
              <span className="font-bold">Analyze</span>
            </Link>
          </div>
        </div>

        {/* Recent analyses */}
        <div className="mb-6 flex items-end justify-between stagger-item">
          <div>
            <h2 className="text-xl font-headline font-bold text-charcoal">Recent Discoveries</h2>
            <p className="text-[10px] text-charcoal/40 font-headline font-bold uppercase tracking-widest mt-1">Based on your synthesis activity</p>
          </div>
          <Link href="/library" className="font-headline text-[10px] text-accent-soft hover:text-accent-deep transition-colors font-bold uppercase tracking-[0.2em] flex items-center gap-2 pb-1 group">
            Open Library
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: "16px" }}>arrow_forward</span>
          </Link>
        </div>

        <div className="space-y-4 mb-12 stagger-container">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-3xl" />)}
            </div>
          ) : analyses.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center opacity-30">
              <span className="material-symbols-outlined text-5xl mb-4 block">history</span>
              <p className="text-sm font-headline font-bold uppercase tracking-widest">No previous scans found</p>
            </div>
          ) : (
            analyses.map((item, i) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 flex items-center justify-between gap-6 hover:bg-white/50 hover:translate-x-1 transition-all duration-300 cursor-pointer group stagger-item shadow-soft"
                style={{ "--stagger-delay": `${(i + 5) * 60}ms` } as React.CSSProperties}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-headline text-[9px] text-charcoal/30 uppercase font-bold tracking-[0.2em]">{item.dateLabel}</span>
                    <span className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-charcoal/5 border border-charcoal/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-soft" />
                      <span className="font-headline text-[9px] text-charcoal/60 uppercase font-bold tracking-widest">{item.status}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-headline font-bold text-charcoal truncate group-hover:text-accent-soft transition-colors">{item.topic}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-[10px] text-charcoal/70 font-body flex items-center gap-1">
                       <span className="material-symbols-outlined text-[14px]">insights</span> {item.gaps?.length || 0} gaps
                    </p>
                    <p className="text-[10px] text-charcoal/70 font-body flex items-center gap-1">
                       <span className="material-symbols-outlined text-[14px]">rule</span> {item.contradictions?.length || 0} contradictions
                    </p>
                  </div>
                </div>
                <Link href={`/gap-explorer?id=${item.id}`} className="shrink-0 w-12 h-12 rounded-xl bg-charcoal/5 group-hover:bg-charcoal group-hover:text-cream-50 flex items-center justify-center transition-all">
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </Link>
              </div>
            ))
          )}
        </div>

      </div>
    </AppLayout>
  );
}

