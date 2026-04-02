"use client";
import AppLayout from "../components/AppLayout";
import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

interface GraphNode {
  id: string; 
  x: number; 
  y: number; 
  r: number; 
  color: string; 
  label: string;
  type: 'root' | 'paper' | 'gap';
}

function GraphContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user } = useAuth();
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<[string, string][]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      if (!user) return;
      setLoading(true);
      try {
        let targetDoc: any = null;
        if (id) {
          const snap = await getDoc(doc(db, "analyses", id));
          if (snap.exists()) targetDoc = { id: snap.id, ...snap.data() };
        } else {
          // Fetch latest analysis
          const q = query(
            collection(db, "analyses"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const snap = await getDocs(q);
          if (!snap.empty) targetDoc = { id: snap.docs[0].id, ...snap.docs[0].data() };
        }

        if (targetDoc) {
          setAnalysis(targetDoc);
          generateGraph(targetDoc);
        }
      } catch (err) {
        console.error("Error fetching graph data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [id, user]);

  const generateGraph = (data: any) => {
    const newNodes: GraphNode[] = [];
    const newEdges: [string, string][] = [];

    // 1. Root Node (Topic)
    const rootId = "root";
    newNodes.push({
      id: rootId,
      x: 50,
      y: 50,
      r: 18,
      color: "#1A1A1A",
      label: data.topic,
      type: 'root'
    });
    setSelected(rootId);

    // 2. Paper Nodes (Middle Circle)
    const papers = data.papers || [];
    const paperRadius = 30;
    papers.forEach((p: any, i: number) => {
      const angle = (i / papers.length) * 2 * Math.PI;
      const paperId = `paper-${i}`;
      newNodes.push({
        id: paperId,
        x: 50 + paperRadius * Math.cos(angle),
        y: 50 + paperRadius * Math.sin(angle),
        r: 10,
        color: "#C5A028",
        label: p.title || "Research Paper",
        type: 'paper'
      });
      newEdges.push([rootId, paperId]);
    });

    // 3. Gap Nodes (Outer Circle)
    const gaps = data.gaps || [];
    const gapRadius = 45;
    gaps.forEach((g: any, i: number) => {
      const angle = ((i + 0.5) / gaps.length) * 2 * Math.PI;
      const gapId = `gap-${i}`;
      newNodes.push({
        id: gapId,
        x: 50 + gapRadius * Math.cos(angle),
        y: 50 + gapRadius * Math.sin(angle),
        r: 8,
        color: "#4E342E",
        label: g.title || g.gap || "Knowledge Gap",
        type: 'gap'
      });
      
      // Connect to root or a random paper for visual complexity
      newEdges.push([rootId, gapId]);
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="spinner !w-12 !h-12 border-4 mb-6" />
        <p className="font-headline text-[10px] uppercase font-bold tracking-[0.4em] text-charcoal/40 animate-pulse">Synchronizing Topology...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-6xl text-charcoal/10 mb-6">hub</span>
        <h2 className="text-2xl font-headline font-bold text-charcoal mb-4">No Data to Visualize</h2>
        <p className="text-charcoal/50 max-w-xs mb-8">Initiate an analysis in the Lab to generate your first research graph.</p>
        <Link href="/lab" className="btn-primary px-8 rounded-xl">Go to Lab</Link>
      </div>
    );
  }

  const selectedNode = nodes.find(n => n.id === selected);

  return (
    <div className="p-10 max-w-7xl mx-auto page-enter">
      <div className="flex items-start justify-between mb-10 stagger-container">
        <div className="stagger-item">
          <p className="font-headline text-[10px] uppercase font-bold tracking-[0.4em] text-accent-soft mb-2">Visual Connection Graph</p>
          <h1 className="text-4xl font-headline font-bold text-charcoal tracking-tight">Citation Network</h1>
          <p className="text-charcoal/60 text-sm mt-3 font-body">Mapping: <span className="text-charcoal font-bold italic">{analysis.topic}</span></p>
        </div>
        <div className="flex gap-4 stagger-item">
          <Link href={`/gap-explorer?id=${analysis.id}`} className="btn-primary rounded-xl px-6 py-3 shadow-soft active:scale-95">
            <span className="material-symbols-outlined text-xl">explore</span>
            <span className="font-bold">Explorer</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* SVG Graph Area */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] p-8 stagger-item shadow-premium relative bg-white/40 border border-charcoal/5">
          <div className="relative w-full overflow-hidden rounded-2xl bg-cream-100/30" style={{ paddingBottom: "75%" }}>
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full p-4"
            >
              {/* Connection Lines */}
              {edges.map(([a, b]) => {
                const na = nodes.find(n => n.id === a);
                const nb = nodes.find(n => n.id === b);
                if (!na || !nb) return null;
                const isFocused = selected === a || selected === b;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={isFocused ? "#C5A028" : "#1A1A1A"}
                    strokeWidth={isFocused ? 0.4 : 0.15}
                    strokeOpacity={isFocused ? 0.6 : 0.08}
                    className="transition-all duration-700 ease-out"
                  />
                );
              })}
              
              {/* Nodes */}
              {nodes.map(node => {
                const isSelected = node.id === selected;
                return (
                  <g key={node.id} onClick={() => setSelected(node.id)} className="cursor-pointer group">
                    <circle
                      cx={node.x} cy={node.y} r={node.r + (isSelected ? 2 : 0)}
                      fill={isSelected ? node.color : "#F1EED7"}
                      stroke={node.color}
                      strokeWidth={isSelected ? 0 : 0.4}
                      className="transition-all duration-500 shadow-xl"
                    />
                    <text
                      x={node.x} y={node.y}
                      textAnchor="middle" line-height="1"
                      fontSize={isSelected ? 3 : 2}
                      className={`font-headline font-bold uppercase tracking-tighter transition-all duration-500 pointer-events-none
                        ${isSelected ? "fill-white" : "fill-charcoal/40"}`}
                    >
                      {node.label.length > 12 ? node.label.substring(0, 10) + "..." : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="flex items-center gap-8 mt-8 pt-6 border-t border-charcoal/5">
             {[["#1A1A1A","Topic Cluster"], ["#C5A028","Evidence"], ["#4E342E","Latent Gap"]].map(([c, l]) => (
               <div key={l} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                 <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-charcoal/40">{l}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Info Side Panel */}
        <div className="space-y-6 flex flex-col h-full">
           <div className="glass-card rounded-[2rem] p-8 flex-1 border border-charcoal/5 shadow-soft">
              <p className="font-headline text-[10px] uppercase font-bold tracking-[0.2em] text-accent-soft mb-6">Structural metadata</p>
              
              {selectedNode ? (
                <div className="page-enter">
                   <h2 className="text-2xl font-headline font-bold text-charcoal mb-4 leading-tight">{selectedNode.label}</h2>
                   <p className="text-sm font-body text-charcoal/50 leading-relaxed mb-10">
                     {selectedNode.type === 'root' ? `Central research thesis focused on ${analysis.topic}. All vectors originate from this node.` :
                      selectedNode.type === 'paper' ? "Primary evidence node identifying statistical or logical support for the central thesis." :
                      "Structural hole detected in the literature where research intensity is inversely proportional to potential impact."}
                   </p>
                   
                   <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-cream-100/50 border border-charcoal/5">
                         <p className="text-[10px] font-headline font-bold uppercase text-charcoal/30 tracking-widest mb-1">Nodal Class</p>
                         <p className="text-sm font-headline font-bold text-charcoal uppercase tracking-widest">{selectedNode.type}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-cream-100/50 border border-charcoal/5">
                         <p className="text-[10px] font-headline font-bold uppercase text-charcoal/30 tracking-widest mb-1">Connectivity</p>
                         <p className="text-sm font-headline font-bold text-charcoal uppercase tracking-widest">
                           {edges.filter(e => e[0] === selected || e[1] === selected).length} active vectors
                         </p>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                   <span className="material-symbols-outlined text-5xl mb-4">ads_click</span>
                   <p className="text-[10px] font-headline font-bold uppercase tracking-widest">Select a node to inspect</p>
                </div>
              )}
           </div>

           <Link href="/gap-explorer" className="btn-primary w-full !py-6 rounded-2xl justify-between group">
              <span className="font-bold">Deep Explorer Mode</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
           </Link>
        </div>
      </div>
    </div>
  );
}

export default function GraphPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-10 font-headline text-xs uppercase tracking-widest text-charcoal/40">Initializing Visualization...</div>}>
        <GraphContent />
      </Suspense>
    </AppLayout>
  );
}
