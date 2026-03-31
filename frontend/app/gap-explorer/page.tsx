import AppLayout from "../components/AppLayout";
import Link from "next/link";

const gaps = [
  {
    id: "GAP-001",
    title: "Temporal Consistency in Large-Scale Latent Models",
    field: "Neural-Symbolic AI",
    significance: "Critical",
    desc: "Existing architectures fail to maintain logical coherence over sequences exceeding 1M tokens without exponential compute degradation.",
    why: "Without temporal consistency, neural models cannot perform long-horizon reasoning required for scientific discovery or legal analysis.",
    approach: ["Implement Recursive Kernel Memory layers.", "Utilize symbolic state anchors at 100k token intervals.", "Hybridized attention mechanism with linear-scaling kernels."],
  },
  {
    id: "GAP-002",
    title: "Cross-Modal Reasoning in Low-Resource Domains",
    field: "Multimodal AI",
    significance: "High",
    desc: "No existing approach robustly bridges zero-shot visual and linguistic reasoning in domains with fewer than 500 labeled examples.",
    why: "Low-resource domains like rare disease pathology or indigenous language preservation depend on this capability.",
    approach: ["Few-shot contrastive alignment objectives.", "Domain-specific visual tokenization.", "Cross-lingual transfer via pivot language embeddings."],
  },
  {
    id: "GAP-003",
    title: "Ethical Alignment in Autonomous Policy Generators",
    field: "AI Safety",
    significance: "High",
    desc: "Current RLHF-trained systems produce policies that are locally optimal but globally misaligned under adversarial distribution shifts.",
    why: "As LLMs are deployed in governance and healthcare policy generation, untested alignment failures compound at scale.",
    approach: ["Hierarchical reward modeling with constitutional priors.", "Red-team simulation at policy generation phase.", "Multi-stakeholder value aggregation frameworks."],
  },
];

const contradictions = [
  {
    a: "Sparse attention mechanisms exhibit negligible loss in structural integrity for long-form synthesis.",
    b: "Sparsity leads to 'cognitive drifting' where high-entropy nodes are pruned, causing logic collapse.",
    analysis: "The conflict lies in the definition of entropy thresholds. Zhang assumes static weighting, while Miller observes dynamic weight decay during inference.",
    trend: "Contradictions in sparse attention have increased by 40% since Q3, indicating a nearing paradigm shift.",
  },
];

const tabs = ["Analysis", "Models", "Datasets"];

export default function GapExplorerPage() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto page-enter">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Gap Explorer</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Neural-Symbolic Integration Gaps</h1>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost text-xs px-4 py-2.5 rounded">
              <span className="material-symbols-outlined text-sm">ios_share</span> Export
            </button>
            <Link href="/lab" className="btn-primary text-xs px-4 py-2.5 rounded">
              <span className="material-symbols-outlined text-sm">refresh</span> New Scan
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/[0.05] pb-0">
          {tabs.map((t, i) => (
            <button key={t} className={`pb-3 text-sm font-semibold tracking-tight transition-colors duration-180 border-b-2
              ${i === 0 ? "text-primary border-primary" : "text-on-surface-variant hover:text-white border-transparent"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gaps list */}
          <div className="lg:col-span-2 space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-4">{gaps.length} Gaps Found</p>
            {gaps.map((gap, i) => (
              <div
                key={gap.id}
                className="glass-card border border-white/[0.05] rounded-xl p-6 hover:bg-white/[0.04] transition-colors duration-200 group stagger-item"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-outline">{gap.id}</span>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-wider
                      ${gap.significance === "Critical"
                        ? "bg-error/10 border-error/20 text-error"
                        : "bg-tertiary/10 border-tertiary/20 text-tertiary"}`}>
                      {gap.significance}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container">{gap.field}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{gap.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{gap.desc}</p>

                <div className="space-y-3">
                  <div className="bg-surface-container rounded-lg p-3">
                    <p className="font-mono text-[10px] text-secondary uppercase tracking-wider mb-1.5">
                      <span className="material-symbols-outlined mr-1" style={{ fontSize: "12px" }}>history_edu</span>
                      Why it matters
                    </p>
                    <p className="text-xs text-on-surface-variant">{gap.why}</p>
                  </div>
                  <div className="bg-surface-container rounded-lg p-3">
                    <p className="font-mono text-[10px] text-primary uppercase tracking-wider mb-1.5">
                      <span className="material-symbols-outlined mr-1" style={{ fontSize: "12px" }}>precision_manufacturing</span>
                      Suggested approach
                    </p>
                    <ul className="space-y-1">
                      {gap.approach.map(a => (
                        <li key={a} className="text-xs text-on-surface-variant flex items-start gap-2">
                          <span className="text-primary mt-0.5">·</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active contradictions panel */}
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">Active Contradictions</p>
            {contradictions.map((c, i) => (
              <div key={i} className="glass-card border border-error/10 rounded-xl p-5 stagger-item" style={{ animationDelay: `${(i + 3) * 80}ms` }}>
                <span className="material-symbols-outlined text-error text-xl mb-3 block">rule</span>
                <div className="space-y-3">
                  <div className="px-3 py-2 rounded bg-surface-container border-l-2 border-secondary/40">
                    <p className="text-xs text-on-surface-variant italic">&ldquo;{c.a}&rdquo;</p>
                  </div>
                  <div className="px-3 py-2 rounded bg-surface-container border-l-2 border-error/40">
                    <p className="text-xs text-on-surface-variant italic">&ldquo;{c.b}&rdquo;</p>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">{c.analysis}</p>
                <div className="mt-3 pt-3 border-t border-white/[0.05]">
                  <p className="font-mono text-[10px] text-outline uppercase tracking-wider mb-1">Trend Analysis</p>
                  <p className="text-xs text-on-surface-variant">{c.trend}</p>
                </div>
              </div>
            ))}

            <Link href="/graph" className="glass-card border border-white/[0.05] rounded-xl p-5 flex items-center justify-between group hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer stagger-item" style={{ animationDelay: "500ms" }}>
              <div>
                <p className="text-sm font-semibold text-white mb-1">View Connection Graph</p>
                <p className="text-xs text-on-surface-variant">Explore citation network visually</p>
              </div>
              <span className="material-symbols-outlined text-primary transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
