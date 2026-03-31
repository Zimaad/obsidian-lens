"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user record in firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: serverTimestamp(),
          role: "researcher"
        });
      }
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Friendly messages
      if (err.code === "auth/user-not-found") setError("No account found with this email.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else if (err.code === "auth/email-already-in-use") setError("Email already registered.");
      else if (err.code === "auth/weak-password") setError("Password should be at least 6 characters.");
      else setError("Failed to authenticate. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError("Google sign-in failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131318] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Kinetic background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 20% 30%, rgba(199,191,255,0.05) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(77,218,218,0.03) 0%, transparent 40%)"
        }} />
      </div>

      {/* Header */}
      <header className="mb-12 text-center page-enter">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(199,191,255,0.3)]">
            <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>lens</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl tracking-tighter text-white">Obsidian Lens</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">Research Gap Finder</p>
        </div>
      </header>

      {/* Card */}
      <main className="w-full max-w-[440px] relative page-enter" style={{ animationDelay: "60ms" }}>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/[0.08] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/[0.04] blur-[80px] rounded-full pointer-events-none" />

        <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          {/* Tabs */}
          <div className="flex items-center gap-8 mb-10">
            {(["login", "signup"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`relative pb-2 text-sm font-semibold tracking-tight transition-colors duration-180 capitalize
                  ${tab === t ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-white border-b-2 border-transparent"}`}
              >
                {t === "login" ? "Login" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <div className="mb-8">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest hover:bg-surface-container disabled:opacity-50 transition-colors duration-180 py-3.5 px-4 rounded-lg border border-outline-variant/20 group active:scale-[0.98]" style={{ transition: "background 180ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)" }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACq3rSgRyR7NQ5YE-oRP2nuo5LDHFSv1nSA-prPSCB5bGn1EsVNz_NZoi9cNsmAhfIuPVgmaSZB_wSvKoYrqOCvahDk9_2Sh9LHr47-Uj3k_hqkifndUpxu5tHDnde0mo8kqgo36vSL7chmV1WAX4l-8hEEla5BCxVxm2Z0t-ZH2NxSduPs7ERkXDCAv_oskn-LCPaJeaYNGaKV2Q46ueTzyULfYPyLvRojZYbRObnihpm_xLKxo06odSd3odeW73MX_TqcXDOhA"
                alt="Google"
                className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all duration-200"
              />
              <span className="text-sm font-semibold text-on-surface">Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center py-4 mb-4">
            <div className="flex-grow border-t border-outline-variant/20" />
            <span className="flex-shrink mx-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">or use email</span>
            <div className="flex-grow border-t border-outline-variant/20" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-container/30 border border-error/50 p-3 rounded text-[11px] text-error flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant pl-1 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="researcher@obsidian.io"
                required
                className="w-full bg-surface-container-lowest text-on-surface border-0 border-b-2 border-transparent focus:border-secondary focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-outline-variant text-sm py-3 px-4 rounded-t-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Password</label>
                <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-primary hover:text-white transition-colors duration-180">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-surface-container-lowest text-on-surface border-0 border-b-2 border-transparent focus:border-secondary focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-outline-variant text-sm py-3 px-4 rounded-t-lg"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-lg flex items-center justify-center gap-2"
                style={{ boxShadow: "0 8px 20px rgba(199,191,255,0.2)" }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{tab === "login" ? "Initialize Session" : "Create Account"}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-[11px] text-on-surface-variant leading-relaxed">
            By accessing the obsidian core, you agree to our{" "}
            <a href="#" className="text-white hover:underline underline-offset-4">Intelligence Protocols</a>{" "}
            and{" "}
            <a href="#" className="text-white hover:underline underline-offset-4">Privacy Standards</a>.
          </p>
        </div>

        {/* Status bar */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(77,218,218,0.8)]" />
            <span className="font-mono text-[10px] text-on-surface-variant tracking-wider uppercase">System Online</span>
          </div>
          <div className="h-3 w-px bg-outline-variant/30" />
          <span className="font-mono text-[10px] text-on-surface-variant tracking-wider uppercase">v.2.4.0-Stable</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-8 w-full px-6 flex justify-between items-end opacity-30 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="hidden lg:block">
          <p className="font-mono text-[10px] tracking-widest text-on-surface-variant mb-1">LATENCY MONITOR</p>
          <div className="flex gap-1 h-3 items-end">
            {[40, 60, 30, 80, 50, 70, 45].map((h, i) => (
              <div key={i} className="w-[2px] bg-secondary rounded-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] tracking-widest text-on-surface-variant">SECURE ENDPOINT</p>
          <p className="text-[10px] text-primary">ENCRYPTED AT REST</p>
        </div>
      </footer>
    </div>
  );
}
