"use client";
import AppLayout from "../components/AppLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function LibraryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPapers() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "analyses"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateLabel: doc.data().createdAt?.toDate().toLocaleDateString() || "Recent",
          year: doc.data().createdAt?.toDate().getFullYear() || 2026
        }));
        setPapers(fetched);
      } catch (error) {
        console.error("Error fetching library:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPapers();
  }, [user]);

  const filtered = papers.filter(p =>
    (p.topic || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.field || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-10 max-w-7xl mx-auto page-enter">
        <div className="flex items-start justify-between mb-10 stagger-container">
          <div className="stagger-item">
            <p className="font-headline text-[10px] uppercase font-bold tracking-[0.4em] text-accent-soft mb-2">Paper Library</p>
            <h1 className="text-4xl font-headline font-bold text-charcoal tracking-tight">Research Library</h1>
            <p className="text-charcoal/60 text-sm mt-3 max-w-2xl font-body">Manage your repository of synthesized papers, methodology nodes, and derived insights.</p>
          </div>
          <Link href="/dashboard" className="btn-primary rounded-xl px-8 py-4 stagger-item shadow-soft active:scale-95">
            <span className="material-symbols-outlined text-xl">biotech</span>
            <span className="font-bold">New Analysis</span>
          </Link>
        </div>

        {/* Search & filters */}
        <div className="flex gap-4 mb-10 stagger-item">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30" style={{ fontSize: "20px" }}>search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search papers, topics, keywords..."
              className="w-full bg-cream-100/50 text-charcoal border border-charcoal/5 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-charcoal/20 focus:bg-white placeholder:text-charcoal/20 transition-all font-body shadow-inner"
            />
          </div>
          <button className="btn-ghost px-6 rounded-xl text-xs font-bold border border-charcoal/5 hover:bg-white transition-all">
            <span className="material-symbols-outlined text-base">tune</span> Filter
          </button>
        </div>

        {/* Papers list */}
        {loading ? (
          <div className="space-y-4 mb-12">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4 mb-12 stagger-container">
            {filtered.map((paper, i) => (
              <Link
                key={paper.id}
                href={`/gap-explorer?id=${paper.id}`}
                className="glass-card rounded-3xl p-8 flex items-center justify-between gap-8 hover:bg-white/60 hover:translate-x-1 hover:shadow-premium transition-all duration-300 cursor-pointer group stagger-item"
                style={{ "--stagger-delay": `${(i + 2) * 60}ms` } as React.CSSProperties}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-charcoal/5 border border-charcoal/5">
                      <span className="font-headline text-[10px] text-charcoal/60 uppercase font-bold tracking-widest">{paper.field || "General"}</span>
                    </span>
                    <span className="font-headline text-[10px] text-charcoal/30 font-bold uppercase tracking-widest">{paper.dateLabel}</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-charcoal mb-3 group-hover:text-accent-soft transition-colors leading-tight">{paper.topic}</h3>
                  <p className="text-base text-charcoal/50 leading-relaxed font-body max-w-4xl line-clamp-2">{paper.abstract || paper.summary || "Synthesis complete. Access the full topological map to explore identified latent gaps."}</p>
                  
                  <div className="flex items-center gap-8 mt-8">
                    <span className="flex items-center gap-2.5 text-[11px] font-headline font-bold uppercase tracking-[0.1em] text-charcoal/40">
                      <span className="material-symbols-outlined text-[18px] text-accent-soft">insights</span>
                      {paper.gaps?.length || 0} Gaps
                    </span>
                    <span className="flex items-center gap-2.5 text-[11px] font-headline font-bold uppercase tracking-[0.1em] text-charcoal/40">
                      <span className="material-symbols-outlined text-[18px] text-charcoal/20">rule</span>
                      {paper.contradictions?.length || 0} Contradictions
                    </span>
                  </div>
                </div>
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-charcoal/5 group-hover:bg-charcoal group-hover:text-cream-50 flex items-center justify-center transition-all shadow-soft active:scale-95">
                  <span className="material-symbols-outlined text-2xl">explore</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-card rounded-3xl stagger-item opacity-40 shadow-soft bg-cream-100/20">
            <span className="material-symbols-outlined text-6xl mb-6 block text-charcoal/20">inbox</span>
            <p className="text-sm font-headline font-bold uppercase tracking-widest text-charcoal/40">Neural Store Empty</p>
            <p className="text-xs font-body text-charcoal/30 mt-2">Initialize a new research scan to populate your library.</p>
          </div>
        )}

        {/* Footer status */}
        {!loading && (
          <div className="mt-12 flex items-center justify-between border-t border-charcoal/5 pt-8 stagger-item">
            <div className="flex items-center gap-3">
              <div className="data-pulse !w-2 !h-2" />
              <span className="font-headline text-[10px] text-charcoal/30 uppercase font-bold tracking-[0.2em]">Neural Pipeline Synced</span>
            </div>
            <span className="font-headline text-[10px] text-charcoal/30 uppercase font-bold tracking-[0.2em]">Repository Scope: {papers.length} Analyses</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


