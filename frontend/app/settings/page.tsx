"use client";
import AppLayout from "../components/AppLayout";
import { useState } from "react";

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState("AIza••••••••••••••••XYZ");
  const [semanticKey, setSemanticKey] = useState("sk_••••••••••••••••••abc");
  const [maxPapers, setMaxPapers] = useState("100");
  const [language, setLanguage] = useState("English");
  const [showDelete, setShowDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto page-enter">
        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Configuration</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-on-surface-variant text-sm mt-2">Manage your research environment, API integration keys, and platform preferences.</p>
        </div>

        {/* Profile */}
        <section className="glass-card border border-white/[0.05] rounded-xl p-6 mb-6 stagger-item">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"
              alt="Adrian Thorne"
              className="w-14 h-14 rounded-xl border border-violet-500/30"
            />
            <div>
              <h2 className="text-lg font-bold text-white">Adrian Thorne</h2>
              <p className="text-sm text-on-surface-variant">researcher@obsidian.io</p>
              <span className="inline-block mt-1 font-mono text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">Pro Plan</span>
            </div>
            <button className="ml-auto btn-ghost text-xs px-4 py-2 rounded">Edit Profile</button>
          </div>
        </section>

        {/* Integrations */}
        <section className="glass-card border border-white/[0.05] rounded-xl p-6 mb-6 stagger-item" style={{ animationDelay: "60ms" }}>
          <h3 className="text-sm font-bold text-white mb-1">Integrations & API Keys</h3>
          <p className="text-xs text-on-surface-variant mb-6">Used for high-speed spectral analysis and deep citation graphing.</p>

          <div className="space-y-5">
            {[
              { label: "Gemini API Key", sublabel: "Required for deep semantic reasoning", value: geminiKey, set: setGeminiKey },
              { label: "Semantic Scholar API Key", sublabel: "Required for deep citation graphing and metadata retrieval", value: semanticKey, set: setSemanticKey },
            ].map(({ label, sublabel, value, set }) => (
              <div key={label} className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant block">{label}</label>
                <p className="text-[11px] text-outline mb-2">{sublabel}</p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={value}
                    onChange={e => set(e.target.value)}
                    className="flex-1 bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-secondary/50 placeholder:text-outline-variant transition-colors duration-200"
                  />
                  <button className="btn-ghost text-xs px-3 py-2 rounded">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Research Preferences */}
        <section className="glass-card border border-white/[0.05] rounded-xl p-6 mb-6 stagger-item" style={{ animationDelay: "120ms" }}>
          <h3 className="text-sm font-bold text-white mb-1">Research Preferences</h3>
          <p className="text-xs text-on-surface-variant mb-6">Configure analysis behavior and defaults.</p>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Max papers per scan</p>
                <p className="text-xs text-on-surface-variant">Higher values increase accuracy but slow analysis</p>
              </div>
              <select
                value={maxPapers}
                onChange={e => setMaxPapers(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-secondary/50 transition-colors duration-200"
              >
                <option>50</option><option>100</option><option>250</option><option>500</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Preferred language</p>
                <p className="text-xs text-on-surface-variant">Papers outside this language will still be indexed</p>
              </div>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-secondary/50 transition-colors duration-200"
              >
                <option>English</option><option>Spanish</option><option>German</option><option>French</option>
              </select>
            </div>

            {[
              { label: "Automatic contradiction highlighting", desc: "Flag conflicting claims across papers in real-time" },
              { label: "Include pre-prints", desc: "Index papers not yet peer-reviewed from arXiv and bioRxiv" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{label}</p>
                  <p className="text-xs text-on-surface-variant">{desc}</p>
                </div>
                <button className="relative w-11 h-6 rounded-full bg-secondary/20 border border-secondary/30 transition-colors duration-200">
                  <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-secondary transition-transform duration-200 shadow-sm translate-x-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end mb-8 stagger-item" style={{ animationDelay: "180ms" }}>
          <button onClick={handleSave} className="btn-primary px-8">
            {saved ? (
              <><span className="material-symbols-outlined text-base">check_circle</span> Saved!</>
            ) : (
              <><span className="material-symbols-outlined text-base">save</span> Save Changes</>
            )}
          </button>
        </div>

        {/* Danger Zone */}
        <section className="glass-card border border-error/20 rounded-xl p-6 stagger-item" style={{ animationDelay: "240ms" }}>
          <h3 className="text-sm font-bold text-error mb-1">Danger Zone</h3>
          <p className="text-xs text-on-surface-variant mb-5">Deleting your account is irreversible. All research clusters, saved library assets, and API configurations will be permanently purged.</p>

          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="text-xs font-mono uppercase tracking-widest text-error border border-error/30 px-5 py-2.5 rounded-lg hover:bg-error/10 transition-colors duration-200 active:scale-[0.97]"
              style={{ transition: "background 200ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)" }}
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-error font-semibold">Are you absolutely sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button className="text-xs font-mono uppercase tracking-widest text-error border border-error/40 px-5 py-2.5 rounded-lg hover:bg-error/15 transition-colors duration-200">
                  Yes, Delete Everything
                </button>
                <button onClick={() => setShowDelete(false)} className="btn-ghost text-xs px-5 py-2.5 rounded-lg">Cancel</button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-white/[0.05] flex gap-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors duration-180">Legal Docs</a>
            <a href="#" className="hover:text-primary transition-colors duration-180">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors duration-180">Support</a>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
