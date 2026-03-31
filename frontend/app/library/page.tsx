"use client";
import AppLayout from "../components/AppLayout";
import Link from "next/link";
import { useState } from "react";

const papers = [
  {
    id: "LIB-001",
    title: "Neural Substrate of Consciousness: Integrated Information Theory v4.0",
    desc: "Cross-examination of integrated information metrics in thalamocortical loops during rapid-eye-movement sleep states.",
    year: 2024, field: "Neuroscience", claims: 8, gaps: 2, contradictions: 1,
  },
  {
    id: "LIB-002",
    title: "Post-Quantum Cryptography in Decentralized Finance",
    desc: "Evaluating the vulnerability of existing liquidity pools to Grover's algorithm and Shor's algorithm variants.",
    year: 2024, field: "Cryptography", claims: 12, gaps: 3, contradictions: 0,
  },
  {
    id: "LIB-003",
    title: "Dark Matter Constraints from Dwarf Spheroidal Galaxies",
    desc: "Review of gamma-ray emission upper limits and implications for WIMP annihilation cross-sections.",
    year: 2023, field: "Astrophysics", claims: 6, gaps: 1, contradictions: 2,
  },
  {
    id: "LIB-004",
    title: "Microplastic Infiltration in Alpine Soil Ecosystems",
    desc: "Metanalysis of environmental impact studies versus chemical industry toxicity reports for high-altitude ecosystems.",
    year: 2024, field: "Environmental Science", claims: 9, gaps: 4, contradictions: 1,
  },
];

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const filtered = papers.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.field.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto page-enter">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Paper Library</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Research Library</h1>
          </div>
          <button className="btn-primary">
            <span className="material-symbols-outlined text-base">upload_file</span>
            Upload PDF / URL
          </button>
        </div>

        {/* Search & filters */}
        <div className="flex gap-3 mb-8 stagger-item">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: "18px" }}>search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search papers, fields, keywords..."
              className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-secondary/50 placeholder:text-outline-variant transition-colors duration-200"
            />
          </div>
          <button className="btn-ghost px-4 py-2.5 text-xs">
            <span className="material-symbols-outlined text-sm">tune</span> Filter
          </button>
          <button className="btn-ghost px-4 py-2.5 text-xs">
            <span className="material-symbols-outlined text-sm">sort</span> Sort
          </button>
        </div>

        {/* Upload drop zone */}
        <div className="glass-card border border-dashed border-outline-variant/30 rounded-xl p-6 mb-8 text-center hover:border-primary/30 transition-colors duration-300 group cursor-pointer stagger-item" style={{ animationDelay: "80ms" }}>
          <span className="material-symbols-outlined text-outline text-3xl mb-2 block group-hover:text-primary/60 transition-colors duration-200">cloud_upload</span>
          <p className="text-sm font-semibold text-white mb-0.5">New Analysis</p>
          <p className="text-xs text-on-surface-variant">Upload PDF or URL to start — drag & drop or click</p>
        </div>

        {/* Papers list */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((paper, i) => (
              <div
                key={paper.id}
                className="glass-card border border-white/[0.05] rounded-xl p-5 hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer group stagger-item"
                style={{ animationDelay: `${(i + 2) * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-[9px] text-outline">{paper.id}</span>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/20 uppercase tracking-wider">{paper.field}</span>
                      <span className="font-mono text-[9px] text-on-surface-variant">{paper.year}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-primary transition-colors duration-200">{paper.title}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{paper.desc}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-[10px] font-mono text-on-surface-variant">
                        <span className="material-symbols-outlined text-secondary" style={{ fontSize: "13px" }}>auto_stories</span>
                        {paper.claims} claims
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "13px" }}>explore</span>
                        {paper.gaps} gaps
                      </span>
                      {paper.contradictions > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-error">
                          <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>rule</span>
                          {paper.contradictions} contradiction{paper.contradictions > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href="/gap-explorer" className="shrink-0 p-2 rounded-lg hover:bg-white/[0.06] transition-colors duration-180">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors duration-200" style={{ fontSize: "18px" }}>arrow_outward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-card border border-white/[0.05] rounded-xl stagger-item">
            <span className="material-symbols-outlined text-outline text-5xl mb-3 block">search_off</span>
            <p className="text-sm font-semibold text-white mb-1">No Records Found</p>
            <p className="text-xs text-on-surface-variant font-mono uppercase tracking-widest">Revise your parameters or initiate new scan</p>
          </div>
        )}

        {/* Footer status */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_6px_rgba(77,218,218,0.8)]" />
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Privacy Protocol Active</span>
          </div>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">System Status: Nominal</span>
        </div>
      </div>
    </AppLayout>
  );
}
