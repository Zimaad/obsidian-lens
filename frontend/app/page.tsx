import TopNav from "./components/TopNav";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <TopNav />
      <main className="relative pt-14">
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0 bg-[#0a0a0f]">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/[0.08] rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/[0.04] rounded-full blur-[100px]" />
            {/* Stars */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-[12%] left-[22%] w-px h-px bg-white rounded-full shadow-[0_0_4px_white]" />
              <div className="absolute top-[32%] left-[61%] w-px h-px bg-white rounded-full" />
              <div className="absolute top-[68%] left-[14%] w-px h-px bg-white rounded-full" />
              <div className="absolute top-[84%] left-[79%] w-[2px] h-[2px] bg-primary rounded-full shadow-[0_0_8px_#c7bfff]" />
              <div className="absolute top-[44%] left-[42%] w-px h-px bg-white rounded-full" />
              <div className="absolute top-[20%] left-[78%] w-px h-px bg-secondary rounded-full shadow-[0_0_4px_#4ddada]" />
            </div>
          </div>

          <div className="relative z-10 max-w-5xl text-center page-enter">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
              <div className="data-pulse data-pulse-animated" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-secondary-fixed">System Active: V4.2 Core</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.05]">
              Map the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Unknown.</span>
              <br />
              Find What Research Has Missed.
            </h1>

            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Harness an autonomous agentic workflow that reads thousands of papers, detects latent contradictions, and visualizes the frontiers of human knowledge in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-primary">Start Researching</Link>
              <Link href="/lab" className="btn-ghost">View Demo</Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative z-10 mt-20 w-full max-w-6xl">
            <div className="glass-card rounded-xl border border-white/[0.05] p-4 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop"
                alt="Research Visualization — abstract neural network graph"
                className="w-full h-auto rounded-lg object-cover grayscale brightness-75 hover:grayscale-0 transition-[filter,opacity] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              />
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-32 px-6 bg-surface-container-low relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-primary mb-2">Protocol</h2>
              <h3 className="text-4xl font-bold tracking-tight text-white">The Agentic Workflow</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { n: "01", icon: "search",      title: "Deep Search",   desc: "Agents crawl academic databases, pre-prints, and patents to gather every relevant data point." },
                { n: "02", icon: "auto_stories", title: "Semantic Read", desc: "LLMs digest methodology, findings, and limitations to understand the core thesis of each paper." },
                { n: "03", icon: "psychology",   title: "Analyze",       desc: "Cross-reference findings to detect statistical anomalies or logic gaps across the literature set." },
                { n: "04", icon: "insights",     title: "Synthesize",    desc: "Generate a comprehensive map of unexplored territories and high-value research questions." },
              ].map((step, i) => (
                <div key={step.n} className="relative group stagger-item" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="font-mono text-5xl font-black text-white/[0.04] absolute -top-10 -left-4 group-hover:text-primary/[0.08] transition-colors duration-300">{step.n}</div>
                  <div className="flex flex-col gap-4">
                    <span className="material-symbols-outlined text-secondary text-3xl">{step.icon}</span>
                    <h4 className="text-xl font-bold text-white">{step.title}</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Bento ── */}
        <section className="py-32 px-6 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Uncover Insights Others Overlook</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">Obsidian Lens doesn't just summarize; it identifies the structural holes in current human knowledge.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Feature 1 */}
              <div className="md:col-span-8 glass-card border border-white/[0.05] rounded-xl p-8 signature-glow overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <span className="font-mono text-xs text-primary mb-4 block tracking-widest uppercase">Frontier Engine</span>
                    <h4 className="text-3xl font-bold text-white mb-4">Autonomous Gap Discovery</h4>
                    <p className="text-on-surface-variant leading-relaxed mb-6">Our proprietary algorithms analyze citations and claim trajectories to highlight areas where research intensity has dropped despite rising relevance.</p>
                    <ul className="space-y-3">
                      {["Niche identification in 200+ disciplines", "Probability scoring for discovery breakthroughs"].map(t => (
                        <li key={t} className="flex items-center gap-3 text-sm text-white/80">
                          <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>check_circle</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="bg-surface-container-highest rounded-lg p-2 border border-white/[0.05]">
                      <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                        alt="Data Analysis Dashboard"
                        className="rounded shadow-xl opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-4 glass-card border border-white/[0.05] rounded-xl p-8 hover:bg-white/[0.04] transition-colors duration-200">
                <span className="material-symbols-outlined text-secondary text-4xl mb-6 block">rule</span>
                <h4 className="text-xl font-bold text-white mb-2">Contradiction Detection</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Instantly spot papers with conflicting results. Our system highlights reproducibility risks before you start your own study.</p>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-4 glass-card border border-white/[0.05] rounded-xl p-8 hover:bg-white/[0.04] transition-colors duration-200">
                <span className="material-symbols-outlined text-secondary text-4xl mb-6 block">hub</span>
                <h4 className="text-xl font-bold text-white mb-2">Interactive Lit Map</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Navigate the web of citations in a fluid 3D environment. Understand who influenced whom and where the trail ends.</p>
              </div>

              {/* Feature 4 */}
              <Link href="/login" className="md:col-span-8 glass-card border border-white/[0.05] rounded-xl p-8 flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] transition-colors duration-200">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Export Ready Analysis</h4>
                  <p className="text-sm text-on-surface-variant">Generate BibTeX, CSV, or detailed PDF reports with a single click.</p>
                </div>
                <span className="material-symbols-outlined text-primary text-4xl transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6 text-center border-t border-white/[0.05] bg-surface-container-lowest">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to find your next breakthrough?</h2>
          <p className="text-on-surface-variant mb-10 max-w-xl mx-auto">Join 50,000+ researchers across Ivy League institutions and global R&D labs.</p>
          <Link href="/login" className="btn-primary rounded-full px-10 py-5 text-base">
            Create Free Research Account
          </Link>
        </section>

        {/* ── Footer ── */}
        <footer className="py-12 px-6 bg-[#0a0a0f] border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-lg font-bold tracking-tighter text-white">Obsidian Lens</span>
              <p className="text-xs text-slate-500 mt-2 font-mono">Precision Research Systems © 2024</p>
            </div>
            <div className="flex gap-8 text-xs font-mono uppercase tracking-widest text-slate-400">
              {["Documentation", "API", "Privacy", "Terms"].map(l => (
                <a key={l} href="#" className="hover:text-primary transition-colors duration-200">{l}</a>
              ))}
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-slate-500 hover:text-white cursor-pointer transition-colors duration-200">public</span>
              <span className="material-symbols-outlined text-slate-500 hover:text-white cursor-pointer transition-colors duration-200">alternate_email</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
