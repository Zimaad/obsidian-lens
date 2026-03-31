import AppLayout from "../components/AppLayout";
import Link from "next/link";

const recentAnalyses = [
  { id: "OBS-4402", title: "Neural Plasticity in Deep Sleep Cycles", desc: "Cross-referencing neuro-imaging datasets with cognitive behavioral therapy outcomes in clinical trials 2020-2024.", status: "complete" },
  { id: "OBS-9912", title: "Solid-State Battery Energy Density", desc: "Synthesizing material science publications regarding lithium-sulfur stability and ceramic electrolytes.", status: "complete" },
  { id: "OBS-1022", title: "Microplastic Infiltration in Alpine Soils", desc: "Metanalysis of environmental impact studies vs chemical industry toxicity reports.", status: "running" },
  { id: "OBS-5066", title: "Post-Quantum Cryptography Benchmarks", desc: "Comprehensive testing of NIST-approved algorithms against simulated Shor's algorithm instances.", status: "complete" },
];

const stats = [
  { label: "Gaps Discovered", value: "1,284" },
  { label: "Papers Indexed", value: "42.9k" },
  { label: "Contradictions Found", value: "86" },
  { label: "Analyses Run", value: "3,502" },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto page-enter">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Research Core · Precision Mode</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence Synthesis</h1>
            <p className="text-on-surface-variant text-sm mt-2">Initiate a cross-domain literature scan to identify structural gaps and emergent contradictions.</p>
          </div>
          <Link href="/lab" className="btn-primary">
            <span className="material-symbols-outlined text-lg">biotech</span>
            New Analysis
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`glass-card border border-white/[0.05] rounded-xl p-6 stagger-item`} style={{ animationDelay: `${i * 60}ms` }}>
              <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search/Start new */}
        <div className="glass-card border border-white/[0.05] rounded-xl p-6 mb-8 stagger-item" style={{ animationDelay: "280ms" }}>
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">New Scan</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter research topic, e.g. 'transformer attention in low-resource NLP'..."
              className="flex-1 bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary/50 placeholder:text-outline-variant transition-colors duration-200"
            />
            <Link href="/lab" className="btn-primary whitespace-nowrap">
              <span className="material-symbols-outlined text-base">send</span>
              Analyze
            </Link>
          </div>
        </div>

        {/* Recent analyses */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Analyses</h2>
            <p className="text-xs text-on-surface-variant font-mono">Last 24 hours activity</p>
          </div>
          <Link href="/library" className="font-mono text-xs text-primary hover:text-white transition-colors duration-200 uppercase tracking-widest flex items-center gap-1">
            View all
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
          </Link>
        </div>

        <div className="space-y-3">
          {recentAnalyses.map((item, i) => (
            <div
              key={item.id}
              className="glass-card border border-white/[0.05] rounded-xl p-5 flex items-start justify-between gap-4 hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer stagger-item"
              style={{ animationDelay: `${(i + 5) * 60}ms` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-[10px] text-outline uppercase tracking-widest">{item.id}</span>
                  {item.status === "running" && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
                      <div className="data-pulse" style={{ width: 5, height: 5 }} />
                      <span className="font-mono text-[9px] text-secondary uppercase">Running</span>
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{item.desc}</p>
              </div>
              <Link href="/gap-explorer" className="shrink-0 p-2 rounded-lg hover:bg-white/[0.06] transition-colors duration-180">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>arrow_outward</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Batch upload CTA */}
        <div className="mt-8 glass-card border border-dashed border-outline-variant/30 rounded-xl p-8 text-center stagger-item hover:border-primary/30 transition-colors duration-300" style={{ animationDelay: "600ms" }}>
          <span className="material-symbols-outlined text-outline text-4xl mb-3 block">upload_file</span>
          <h3 className="text-white font-semibold mb-1">Run Batch Analysis</h3>
          <p className="text-xs text-on-surface-variant">Upload multiple files or URLs for parallel processing</p>
          <button className="btn-ghost mt-4 text-xs px-5 py-2.5">Upload Files</button>
        </div>
      </div>
    </AppLayout>
  );
}
