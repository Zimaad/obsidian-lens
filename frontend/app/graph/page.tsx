"use client";
import AppLayout from "../components/AppLayout";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface GraphNode {
  id: string; x: number; y: number; r: number; color: string; label: string; active: boolean;
}

const nodes: GraphNode[] = [
  { id: "A", x: 50,  y: 50,  r: 22, color: "#c7bfff", label: "LLM Foundations",          active: true  },
  { id: "B", x: 25,  y: 28,  r: 16, color: "#4ddada", label: "Scaling Laws",              active: false },
  { id: "C", x: 75,  y: 28,  r: 16, color: "#4ddada", label: "Emergent Abilities",        active: false },
  { id: "D", x: 15,  y: 58,  r: 13, color: "#8d7fff", label: "RLHF",                     active: false },
  { id: "E", x: 38,  y: 75,  r: 13, color: "#8d7fff", label: "Chain-of-Thought",          active: false },
  { id: "F", x: 63,  y: 75,  r: 13, color: "#8d7fff", label: "Retrieval Augmentation",   active: false },
  { id: "G", x: 85,  y: 58,  r: 13, color: "#8d7fff", label: "Sparse Attention",          active: false },
  { id: "H", x: 18,  y: 40,  r: 10, color: "#474555", label: "Tokenization",             active: false },
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
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto page-enter">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Visual Connection Graph</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Citation Network</h1>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost text-xs px-4 py-2.5 rounded">
              <span className="material-symbols-outlined text-sm">ios_share</span> Export
            </button>
            <Link href="/gap-explorer" className="btn-ghost text-xs px-4 py-2.5 rounded">
              <span className="material-symbols-outlined text-sm">explore</span> Explorer
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-6 mb-8 border-b border-white/[0.05]">
          {["Graph","Explorer","Library"].map((t, i) => (
            <button key={t} className={`pb-3 text-sm font-semibold transition-colors duration-180 border-b-2
              ${i === 0 ? "text-primary border-primary" : "text-on-surface-variant hover:text-white border-transparent"}`}>{t}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Graph */}
          <div className="lg:col-span-2 glass-card border border-white/[0.05] rounded-xl p-4 stagger-item" style={{ animationDelay: "80ms" }}>
            <div className="relative w-full" style={{ paddingBottom: "66%" }}>
              <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                style={{ background: "radial-gradient(ellipse at center, rgba(199,191,255,0.03) 0%, transparent 70%)" }}
              >
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
                      stroke={isSelected ? "#c7bfff" : "#35343a"}
                      strokeWidth={isSelected ? 0.5 : 0.3}
                      strokeOpacity={isSelected ? 0.7 : 0.4}
                      style={{ transition: "stroke 200ms cubic-bezier(0.23,1,0.32,1), stroke-opacity 200ms cubic-bezier(0.23,1,0.32,1)" }}
                    />
                  );
                })}
                {/* Nodes */}
                {nodes.map(node => {
                  const isSelected = node.id === selected;
                  return (
                    <g key={node.id} onClick={() => setSelected(node.id)} style={{ cursor: "pointer" }}>
                      {isSelected && (
                        <circle cx={node.x} cy={node.y} r={node.r + 4} fill="none" stroke={node.color} strokeWidth="0.5" strokeOpacity="0.3" />
                      )}
                      <circle
                        cx={node.x} cy={node.y} r={node.r}
                        fill={isSelected ? node.color : "rgba(255,255,255,0.04)"}
                        stroke={node.color}
                        strokeWidth={isSelected ? 0 : 0.5}
                        strokeOpacity={0.6}
                        style={{ transition: "fill 200ms cubic-bezier(0.23,1,0.32,1), r 200ms cubic-bezier(0.23,1,0.32,1)" }}
                      />
                      <text
                        x={node.x} y={node.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={node.r > 15 ? 3.5 : 2.8}
                        fill={isSelected ? "#2a009f" : node.color}
                        fontWeight={isSelected ? "700" : "400"}
                        fontFamily="Inter, sans-serif"
                        style={{ pointerEvents: "none", transition: "fill 200ms cubic-bezier(0.23,1,0.32,1)" }}
                      >
                        {node.label.split(" ").slice(0, 2).join(" ")}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* Graph legend */}
            <div className="flex items-center gap-6 px-4 pt-3 pb-1 border-t border-white/[0.04] mt-2">
              {[["#c7bfff","Primary node"],["#4ddada","Strong citation"],["#8d7fff","Indirect link"],["#474555","Peripheral"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                  <span className="font-mono text-[9px] text-on-surface-variant">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Paper details */}
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant stagger-item" style={{ animationDelay: "100ms" }}>
              {selected ? `Selected: ${nodes.find(n => n.id === selected)?.label}` : "Select a node"}
            </p>
            {papers.map((paper, i) => (
              <div key={paper.id} className="glass-card border border-white/[0.05] rounded-xl p-5 stagger-item" style={{ animationDelay: `${(i + 2) * 80}ms` }}>
                <span className="font-mono text-[9px] text-outline block mb-2">{paper.id}</span>
                <h3 className="text-sm font-semibold text-white mb-3">{paper.title}</h3>
                <ul className="space-y-2">
                  {paper.claims.map(claim => (
                    <li key={claim} className="flex items-start gap-2 text-xs text-on-surface-variant">
                      <span className="text-secondary mt-0.5 shrink-0">•</span>
                      {claim}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-white/[0.04] flex gap-2">
                  <Link href="/gap-explorer" className="btn-ghost text-[10px] px-3 py-1.5 rounded">View Gaps</Link>
                  <button className="btn-ghost text-[10px] px-3 py-1.5 rounded">Cite</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
