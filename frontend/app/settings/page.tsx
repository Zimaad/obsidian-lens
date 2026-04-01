"use client";
import AppLayout from "../components/AppLayout";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
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
      <div className="p-10 max-w-3xl mx-auto page-enter">
        {/* Header */}
        <div className="mb-12 stagger-container">
          <div className="stagger-item">
            <p className="font-headline text-[10px] uppercase font-bold tracking-[0.4em] text-accent-soft mb-2">Configuration</p>
            <h1 className="text-4xl font-headline font-bold text-charcoal tracking-tight">Settings</h1>
            <p className="text-charcoal/60 text-sm mt-3 font-body">Manage your research environment, API integration keys, and platform preferences.</p>
          </div>
        </div>

        {/* Profile */}
        <section className="glass-card rounded-2xl p-8 mb-8 stagger-item shadow-soft">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-charcoal text-cream-50 flex items-center justify-center font-bold text-xl border border-charcoal shadow-sm">
              {(() => {
                if (user?.displayName) {
                  const parts = user.displayName.split(" ");
                  return parts.map((p: string) => p[0]).join("").toUpperCase().substring(0, 2);
                }
                return user?.email?.[0].toUpperCase() || "R";
              })()}
            </div>
            <div>
              <h2 className="text-xl font-headline font-bold text-charcoal">{user?.displayName || "Research Guest"}</h2>
              <p className="text-sm text-charcoal/50 font-body">{user?.email || "guest@obsidian.io"}</p>
              <span className="inline-block mt-2 font-headline text-[9px] px-2.5 py-1 rounded-lg bg-charcoal/5 border border-charcoal/5 text-charcoal/60 uppercase font-bold tracking-[0.2em]">
                {user ? "Standard Researcher" : "Public View"}
              </span>
            </div>
            <button className="ml-auto btn-ghost text-[10px] uppercase font-bold tracking-widest px-6 py-3 rounded-xl border border-charcoal/5">Edit Profile</button>
          </div>
        </section>

        {/* Integrations */}
        <section className="glass-card rounded-2xl p-8 mb-8 stagger-item shadow-soft">
          <h3 className="text-[10px] font-headline font-bold text-charcoal uppercase tracking-[0.2em] mb-2">Integrations & API Keys</h3>
          <p className="text-sm text-charcoal/50 font-body mb-8">System interface for spectral analysis and citation mapping.</p>

          <div className="space-y-6">
            {[
              { label: "Gemini API Key", sublabel: "Neural synthesis engine", value: geminiKey, set: setGeminiKey },
              { label: "Semantic Scholar Key", sublabel: "Knowledge graph retrieval", value: semanticKey, set: setSemanticKey },
            ].map(({ label, sublabel, value, set }) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-headline text-[10px] uppercase tracking-widest text-charcoal/40 font-bold block">{label}</label>
                  <span className="text-[9px] text-accent-soft font-bold uppercase tracking-widest">{sublabel}</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={value}
                    readOnly
                    className="flex-1 bg-cream-100/50 text-charcoal border border-charcoal/5 rounded-xl px-5 py-4 text-sm font-mono focus:outline-none placeholder:text-charcoal/20 transition-all shadow-inner"
                  />
                  <button className="btn-ghost w-14 h-14 rounded-xl flex items-center justify-center border border-charcoal/5">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Research Preferences */}
        <section className="glass-card rounded-2xl p-8 mb-8 stagger-item shadow-soft">
          <h3 className="text-[10px] font-headline font-bold text-charcoal uppercase tracking-[0.2em] mb-2">Platform Preferences</h3>
          <p className="text-sm text-charcoal/50 font-body mb-8">Configure analysis rigor and interface defaults.</p>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-headline font-bold text-charcoal">Max papers per scan</p>
                <p className="text-xs text-charcoal/50 font-body">Higher values increase synthesis depth but slow retrieval</p>
              </div>
              <select
                value={maxPapers}
                onChange={e => setMaxPapers(e.target.value)}
                className="bg-cream-100/50 border border-charcoal/5 text-charcoal text-sm rounded-xl px-4 py-2 font-body focus:outline-none focus:bg-white transition-all shadow-sm"
              >
                <option>50</option><option>100</option><option>250</option><option>500</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-headline font-bold text-charcoal">Preferred language</p>
                <p className="text-xs text-charcoal/50 font-body">System will attempt translation for cross-domain papers</p>
              </div>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-cream-100/50 border border-charcoal/5 text-charcoal text-sm rounded-xl px-4 py-2 font-body focus:outline-none focus:bg-white transition-all shadow-sm"
              >
                <option>English</option><option>Spanish</option><option>German</option><option>French</option>
              </select>
            </div>

            {[
              { label: "Automatic contradiction highlighting", desc: "Flag conflicting claims across papers during parsing" },
              { label: "Include pre-prints", desc: "Index papers from arXiv and bioRxiv for emergent research" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-headline font-bold text-charcoal">{label}</p>
                  <p className="text-xs text-charcoal/50 font-body">{desc}</p>
                </div>
                <button className="relative w-12 h-7 rounded-full bg-charcoal/5 border border-charcoal/5 transition-colors">
                  <span className="absolute left-1 top-1 w-5 h-5 rounded-full bg-charcoal-300 shadow-sm transition-transform translate-x-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end mb-12 stagger-item">
          <button onClick={handleSave} className="btn-primary px-10 py-4 rounded-xl shadow-premium active:scale-95 transition-all">
            {saved ? (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">check_circle</span>
                <span className="font-bold">Protocol Saved</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">save</span>
                <span className="font-bold">Commit Changes</span>
              </div>
            )}
          </button>
        </div>

        {/* Danger Zone */}
        <section className="glass-card border border-red-500/10 rounded-2xl p-8 stagger-item shadow-soft bg-red-50/5">
          <h3 className="text-[10px] font-headline font-bold text-red-500 uppercase tracking-[0.2em] mb-2">Neural Purge</h3>
          <p className="text-sm text-charcoal/50 font-body mb-8">Deleting your account is irreversible. All research clusters and API configurations will be permanently purged.</p>

          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-red-500/60 border border-red-500/20 px-8 py-4 rounded-xl hover:bg-red-500/5 transition-all active:scale-95"
            >
              Initialize Deletion
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-red-500 font-bold uppercase tracking-widest">Confim Neural Purge Request</p>
              <div className="flex gap-4">
                <button className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-white bg-red-500 px-8 py-4 rounded-xl shadow-lg active:scale-95">
                  Confirm Purge
                </button>
                <button onClick={() => setShowDelete(false)} className="btn-ghost text-[10px] font-headline font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-xl border border-charcoal/5">Cancel</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

