"use client";
import TopNav from "./components/TopNav";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import AlgorithmicHero from "./components/AlgorithmicHero";

export default function LandingPage() {
  const protocolRef = useRef<HTMLDivElement>(null);
  const [protocolVisible, setProtocolVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProtocolVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (protocolRef.current) {
      observer.observe(protocolRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <TopNav />
      <main className="relative pt-14 bg-cream-50 min-h-screen border-x border-charcoal">
        {/* ── Hero ── */}
        <section className="relative h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 overflow-hidden border-b border-charcoal">
          {/* Background Algorithmic Art */}
          <AlgorithmicHero />

          <div className="relative z-10 max-w-5xl text-center page-enter">
            <h1 className="text-7xl md:text-9xl font-headline font-bold tracking-tight text-charcoal mb-8 leading-[0.95]">
              Map the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-charcoal to-accent-soft animate-reveal py-2">Unknown.</span>
            </h1>

            <p className="text-charcoal/60 text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-body">
              An agentic workflow that reads thousands of papers, detects latent contradictions, and visualizes the frontiers of human knowledge.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center stagger-container">
              <Link href="/login" className="btn-primary stagger-item !px-12 !py-5 text-lg shadow-premium">
                Start Researching
              </Link>
              <Link href="/lab" className="btn-ghost stagger-item !px-12 !py-5 text-lg font-bold border-charcoal/10">
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* ── How It Works (Protocol) ── */}
        <section ref={protocolRef} className="py-40 px-6 bg-white relative border-y border-charcoal">
          <div className="max-w-7xl mx-auto">
            <div className={`mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 transition-all duration-1000 ${protocolVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="max-w-2xl">
                <h2 className="font-headline text-sm uppercase tracking-[0.4em] text-accent-soft font-bold mb-4">Protocol</h2>
                <h3 className="text-5xl md:text-6xl font-headline font-bold tracking-tight text-charcoal">The Agentic Workflow</h3>
              </div>
              <p className="text-charcoal/50 max-w-xs font-body text-sm leading-relaxed">
                Our system mimics the intellectual rigor of a senior researcher, scaled to thousands of documents per minute.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { n: "01", icon: "search", title: "Deep Search", desc: "Agents crawl academic databases, pre-prints, and patents to gather every relevant data point." },
                { n: "02", icon: "auto_stories", title: "Semantic Read", desc: "LLMs digest methodology, findings, and limitations to understand the core thesis of each paper." },
                { n: "03", icon: "psychology", title: "Analyze", desc: "Cross-reference findings to detect statistical anomalies or logic gaps across the literature set." },
                { n: "04", icon: "insights", title: "Synthesize", desc: "Generate a comprehensive map of unexplored territories and high-value research questions." },
              ].map((step, i) => (
                <div
                  key={step.n}
                  className={`flex flex-col gap-6 group transition-all duration-700 ease-out`}
                  style={{
                    transitionDelay: `${i * 200}ms`,
                    opacity: protocolVisible ? 1 : 0,
                    transform: protocolVisible ? 'translateY(0)' : 'translateY(30px)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-charcoal text-cream-50 flex items-center justify-center font-bold font-headline transition-all duration-300 group-hover:bg-accent-soft group-hover:scale-110 shadow-soft">
                      {step.n}
                    </div>
                    <div className="h-px flex-1 bg-charcoal/10" />
                  </div>
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-charcoal text-4xl group-hover:text-accent-soft transition-colors">{step.icon}</span>
                    <h4 className="text-2xl font-headline font-bold text-charcoal">{step.title}</h4>
                    <p className="text-charcoal/60 leading-relaxed font-body text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Bento ── */}
        <section className="py-40 px-6 bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-24 text-center">
              <h2 className="text-5xl font-headline font-bold tracking-tight text-charcoal mb-6">Frontiers of Knowledge</h2>
              <p className="text-charcoal/50 max-w-xl mx-auto font-body text-lg">Hiatus doesn't just summarize; it identifies the structural holes in current scientific consensus.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 stagger-container">
              {/* Feature 1 */}
              <div className="md:col-span-8 bg-white border border-charcoal rounded-3xl p-12 shadow-soft overflow-hidden group stagger-item">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                    <span className="font-headline text-xs text-accent-soft font-bold tracking-[0.2em] uppercase">Discovery Engine</span>
                    <h4 className="text-4xl font-headline font-bold text-charcoal leading-tight">Autonomous Gap Detection</h4>
                    <p className="text-charcoal/60 leading-relaxed font-body">Our proprietary algorithms analyze citation trajectories to highlight areas where research intensity has dropped despite rising relevance.</p>
                    <ul className="space-y-4">
                      {["Niche identification in 200+ disciplines", "Reproducibility risk scoring"].map(t => (
                        <li key={t} className="flex items-center gap-3 text-sm font-bold text-charcoal/80">
                          <span className="material-symbols-outlined text-accent-soft" style={{ fontSize: "20px" }}>verified</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 w-full relative">
                    <div className="bg-cream-100 rounded-2xl p-4 border border-charcoal transition-transform duration-700 ease-out-strong group-hover:scale-[1.02]">
                      <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                        alt="Data Dashboard"
                        className="rounded-lg shadow-xl opacity-80 mix-blend-multiply"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-4 bg-white border border-charcoal rounded-3xl p-10 shadow-soft hover:bg-cream-100/30 transition-all duration-300 stagger-item group">
                <div className="w-14 h-14 rounded-2xl bg-charcoal/5 flex items-center justify-center mb-8 group-hover:bg-charcoal group-hover:text-cream-50 transition-all duration-300">
                  <span className="material-symbols-outlined text-3xl">rule</span>
                </div>
                <h4 className="text-2xl font-headline font-bold text-charcoal mb-4">Contradiction Maps</h4>
                <p className="text-charcoal/60 leading-relaxed font-body text-sm">Instantly spot papers with conflicting results. Our system highlights methodology drift before you start your own study.</p>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-4 bg-white border border-charcoal rounded-3xl p-10 shadow-soft hover:bg-cream-100/30 transition-all duration-300 stagger-item group">
                <div className="w-14 h-14 rounded-2xl bg-charcoal/5 flex items-center justify-center mb-8 group-hover:bg-charcoal group-hover:text-cream-50 transition-all duration-300">
                  <span className="material-symbols-outlined text-3xl">hub</span>
                </div>
                <h4 className="text-2xl font-headline font-bold text-charcoal mb-4">Citation Origins</h4>
                <p className="text-charcoal/60 leading-relaxed font-body text-sm">Navigate the web of influence in a fluid visual environment. Understand exactly where a research trail ends.</p>
              </div>

              {/* Feature 4 */}
              <Link href="/login" className="md:col-span-8 bg-charcoal rounded-3xl p-10 flex items-center justify-between group cursor-pointer transition-all duration-300 hover:bg-black stagger-item">
                <div className="max-w-md">
                  <h4 className="text-3xl font-headline font-bold text-cream-50 mb-3">Ready for your breakthrough?</h4>
                  <p className="text-cream-50/40 font-body text-sm">Join researchers across Ivy League institutions and global R&D labs mapping the unknown.</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-cream-50 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
                  <span className="material-symbols-outlined text-charcoal text-3xl">arrow_forward</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-32 px-6 text-center bg-white border-t border-charcoal">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-7xl font-headline font-bold text-charcoal tracking-tight">Synthesize the future.</h2>
            <p className="text-charcoal/60 text-lg md:text-xl font-body leading-relaxed max-w-2xl mx-auto">
              Unlock professional tools for literature mapping and gap discovery today. Free for academic researchers.
            </p>
            <Link href="/login" className="btn-primary !rounded-2xl !px-14 !py-5 text-xl shadow-premium">
              Create Research Account
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="py-20 px-6 bg-cream-50 border-t border-charcoal">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
              <div className="space-y-4">
                <Link href="/" className="inline-block transition-transform hover:scale-105">
                  <Image 
                    src="/hiatus_logo_cream.svg" 
                    alt="Hiatus" 
                    width={100} 
                    height={40} 
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <p className="text-sm text-charcoal/40 font-body max-w-xs">Precision research systems for detecting scientific frontiers and knowledge gaps.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <h5 className="font-headline font-bold text-xs uppercase tracking-widest text-charcoal/40">Product</h5>
                  <ul className="space-y-2 text-sm text-charcoal/60 font-medium">
                    <li><a href="#" className="hover:text-charcoal transition-colors">Lab</a></li>
                    <li><a href="#" className="hover:text-charcoal transition-colors">Explorer</a></li>
                    <li><a href="#" className="hover:text-charcoal transition-colors">API</a></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="font-headline font-bold text-xs uppercase tracking-widest text-charcoal/40">Legal</h5>
                  <ul className="space-y-2 text-sm text-charcoal/60 font-medium">
                    <li><a href="#" className="hover:text-charcoal transition-colors">Privacy</a></li>
                    <li><a href="#" className="hover:text-charcoal transition-colors">Terms</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-charcoal/5 gap-4">
              <p className="text-xs text-charcoal/30 font-headline font-bold tracking-widest uppercase">© 2026 Hiatus Systems</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}


