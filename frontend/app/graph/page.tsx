"use client";
import AppLayout from "../components/AppLayout";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface GraphNode {
  id: string; x: number; y: number; r: number; color: string; label: string; active: boolean;
}

const nodes: GraphNode[] = [
  { id: "A", x: 50,  y: 50,  r: 22, color: "#1A1A1A", label: "LLM Foundations",          active: true  },
  { id: "B", x: 25,  y: 28,  r: 16, color: "#C5A028", label: "Scaling Laws",              active: false },
  { id: "C", x: 75,  y: 28,  r: 16, color: "#C5A028", label: "Emergent Abilities",        active: false },
  { id: "D", x: 15,  y: 58,  r: 13, color: "#4E342E", label: "RLHF",                     active: false },
  { id: "E", x: 38,  y: 75,  r: 13, color: "#4E342E", label: "Chain-of-Thought",          active: false },
  { id: "F", x: 63,  y: 75,  r: 13, color: "#4E342E", label: "Retrieval Augmentation",   active: false },
  { id: "G", x: 85,  y: 58,  r: 13, color: "#4E342E", label: "Sparse Attention",          active: false },
  { id: "H", x: 18,  y: 40,  r: 10, color: "#1A1A1A", label: "Tokenization",             active: false },
];

const edges = [
  ["A","B"],["A","C"],["A","D"],["A","E"],["A","F"],["A","G"],["B","H"],["B","C"],["C","G"],["D","E"],["E","F"],
];

const papers = [
  { id: "RES-8821-X", title: "Large Language Models: Foundations and Risks", claims: ["Scaling laws demonstrate predictable emergence of emergent abilities in dense models.", "Cross-entropy loss plateauing indicates theoretical limits of next-token prediction."] },
  { id: "RES-4102-B", title: "Attention Is All You Need — Revisited", claims: ["Multi-head attention scales quadratically with sequence length.", "Sparse attention achieves comparable BLEU with 3× less compute in long-form tasks."] },
];

export default function GraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<string | null>("A");

  return (
    <AppLayout>
      <div className="p-10 max-w-7xl mx-auto page-enter">
        <div className="flex items-start justify-between mb-10 stagger-container">
          <div className="stagger-item">
            <p className="font-headline text-[10px] uppercase font-bold tracking-[0.4em] text-accent-soft mb-2">Visual Connection Graph</p>
            <h1 className="text-4xl font-headline font-bold text-charcoal tracking-tight">Citation Network</h1>
            <p className="text-charcoal/60 text-sm mt-3 font-body">Map the topological relationship between synthesized research nodes.</p>
          </div>
          <div className="flex gap-4 stagger-item">
            <button className="btn-ghost rounded-xl px-4 py-3 border border-charcoal/5 group active:scale-95">
              <span className="material-symbols-outlined text-xl group-hover:text-accent-soft transition-colors font-bold">ios_share</span>
            </button>
            <Link href="/gap-explorer" className="btn-primary rounded-xl px-6 py-3 shadow-soft active:scale-95">
              <span className="material-symbols-outlined text-xl">explore</span>
              <span className="font-bold">Explorer</span>
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-10 mb-10 border-b border-charcoal/5">
          {["Network Graph","Matrix View","Library Archive"].map((t, i) => (
            <button key={t} className={`pb-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] transition-all border-b-2
              ${i === 0 ? "text-charcoal border-charcoal" : "text-charcoal/30 hover:text-charcoal/50 border-transparent"}`}>{t}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* SVG Graph */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 stagger-item shadow-premium relative bg-white/20">
            <div className="relative w-full" style={{ paddingBottom: "70%" }}>
              <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                   <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                   </radialGradient>
                </defs>
                {/* Edges */}
                {edges.map(([a, b]) => {
                  const na = nodes.find(n => n.id === a)!;
                  const nb = nodes.find(n => n.id === b)!;
                  const key = `${a}-${b}`;
                  const isSelected = a === selected || b === selected;
                  return (
                    <line
                      key={key}
                      x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                      stroke={isSelected ? "#C5A028" : "#1A1A1A"}
                      strokeWidth={isSelected ? 0.6 : 0.2}
                      strokeOpacity={isSelected ? 0.8 : 0.1}
                      style={{ transition: "all 400ms cubic-bezier(0.23,1,0.32,1)" }}
                    />
                  );
                })}
                {/* Nodes */}
                {nodes.map(node => {
                  const isSelected = node.id === selected;
                  return (
                    <g key={node.id} onClick={() => setSelected(node.id)} style={{ cursor: "pointer" }}>
                      {isSelected && (
                        <circle cx={node.x} cy={node.y} r={node.r + 5} fill="none" stroke={node.color} strokeWidth="0.3" strokeOpacity="0.2" className="animate-ping" style={{ animationDuration: '3s' }} />
                      )}
                      <circle
                        cx={node.x} cy={node.y} r={node.r}
                        fill={isSelected ? node.color : "#F1EED7"}
                        stroke={node.color}
                        strokeWidth={0.5}
                        strokeOpacity={isSelected ? 0.3 : 1}
                        className="shadow-sm"
                        style={{ transition: "all 400ms cubic-bezier(0.23,1,0.32,1)" }}
                      />
                      <text
                        x={node.x} y={node.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={node.r > 15 ? 3.5 : 2.5}
                        fill={isSelected ? "#F7F5E6" : "#1A1A1A"}
                        className="font-headline font-bold uppercase tracking-tighter"
                        style={{ pointerEvents: "none", transition: "all 400ms cubic-bezier(0.23,1,0.32,1)" }}
                      >
                        {node.label.split(" ").slice(0, 2).join(" ")}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* Graph legend */}
            <div className="flex items-center gap-10 px-6 py-5 border-t border-charcoal/5 mt-4">
              {[["#1A1A1A","Primary Node"],["#C5A028","Mechanism"],["#4E342E","Emergent"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: c }} />
                  <span className="font-headline text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Paper details */}
          <div className="space-y-6">
            <p className="font-headline text-[10px] uppercase font-bold tracking-widest text-charcoal/40 stagger-item">
              {selected ? `Active Node: ${nodes.find(n => n.id === selected)?.label}` : "Select Topology Node"}
            </p>
            <div className="stagger-container space-y-4">
              {papers.map((paper, i) => (
                <div key={paper.id} className="glass-card rounded-2xl p-6 stagger-item shadow-soft hover:bg-white/40 transition-all cursor-crosshair">
                  <span className="font-headline text-[9px] text-accent-soft font-bold uppercase tracking-widest block mb-2">{paper.id}</span>
                  <h3 className="text-lg font-headline font-bold text-charcoal mb-4 leading-tight">{paper.title}</h3>
                  <ul className="space-y-3 mb-6">
                    {paper.claims.map(claim => (
                      <li key={claim} className="flex items-start gap-3 text-xs text-charcoal/60 font-body leading-relaxed group">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-soft mt-1.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                        {claim}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4 border-t border-charcoal/5 pt-4">
                    <Link href="/gap-explorer" className="text-[10px] font-headline font-bold uppercase tracking-widest text-charcoal hover:text-accent-soft transition-colors">Manifest Gaps</Link>
                    <button className="text-[10px] font-headline font-bold uppercase tracking-widest text-charcoal/30 hover:text-charcoal transition-colors">Citation Map</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
