"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
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
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: serverTimestamp(),
          role: "researcher"
        });
      }
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Auth Error:", err);
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
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-accent-soft/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-charcoal/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="mb-12 text-center page-enter">
        <Link href="/" className="flex flex-col items-center gap-4 group">
          <div className="w-14 h-14 bg-charcoal rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
            <span className="material-symbols-outlined text-cream-50 text-3xl">lens</span>
          </div>
          <div className="space-y-1">
            <h1 className="font-headline font-bold text-4xl tracking-tighter text-charcoal">Hiatus</h1>
            <p className="font-headline text-[10px] uppercase tracking-[0.4em] text-accent-soft font-bold">Research Gateway</p>
          </div>
        </Link>
      </header>

      {/* Card */}
      <main className="w-full max-w-[440px] relative page-enter" style={{ transitionDelay: "100ms" }}>
        <div className="relative bg-white/60 backdrop-blur-2xl border border-charcoal/5 rounded-3xl p-10 shadow-2xl">
          {/* Tabs */}
          <div className="flex items-center gap-10 mb-10 border-b border-charcoal/5">
            {(["login", "signup"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`relative pb-4 text-sm font-bold tracking-tight transition-all duration-200 capitalize font-headline
                  ${tab === t ? "text-charcoal border-b-2 border-charcoal" : "text-charcoal/30 hover:text-charcoal/60 border-b-2 border-transparent"}`}
              >
                {t === "login" ? "Login" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <div className="mb-8 stagger-container">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-cream-100 disabled:opacity-50 transition-all duration-200 py-4 px-4 rounded-xl border border-charcoal/10 group active:scale-[0.97] shadow-sm stagger-item"
            >
              <img
                src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-bold text-charcoal font-headline">Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center py-4 mb-6">
            <div className="flex-grow border-t border-charcoal/5" />
            <span className="flex-shrink mx-4 font-headline text-[10px] uppercase tracking-widest text-charcoal/30 font-bold">or use email</span>
            <div className="flex-grow border-t border-charcoal/5" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 stagger-container">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-xs text-red-600 flex items-center gap-3 stagger-item">
                <span className="material-symbols-outlined text-sm">error</span>
                <span className="font-medium">{error}</span>
              </div>
            )}
            <div className="space-y-2 stagger-item">
              <label className="font-headline text-[10px] uppercase tracking-widest text-charcoal/40 font-bold pl-1 block">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="researcher@university.edu"
                required
                className="w-full bg-cream-100/50 text-charcoal border border-transparent focus:border-charcoal/20 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200 placeholder:text-charcoal/20 text-sm py-4 px-5 rounded-2xl font-body"
              />
            </div>

            <div className="space-y-2 stagger-item">
              <div className="flex justify-between items-center px-1">
                <label className="font-headline text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Secret Key</label>
                <a href="#" className="font-headline text-[10px] uppercase tracking-widest text-accent-soft hover:text-accent-deep transition-colors font-bold">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-cream-100/50 text-charcoal border border-transparent focus:border-charcoal/20 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200 placeholder:text-charcoal/20 text-sm py-4 px-5 rounded-2xl font-body"
              />
            </div>

            <div className="pt-4 stagger-item">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-cream-50/30 border-t-cream-50 rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="font-bold">{tab === "login" ? "Initialize Session" : "Create Account"}</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-[11px] text-charcoal/40 leading-relaxed font-body stagger-item">
            By accessing the obsidian core, you agree to our{" "}
            <a href="#" className="text-charcoal font-bold hover:underline underline-offset-4">Intelligence Protocols</a>{" "}
            and{" "}
            <a href="#" className="text-charcoal font-bold hover:underline underline-offset-4">Privacy Standards</a>.
          </p>
        </div>

        {/* Status bar */}
        <div className="mt-8 flex items-center justify-center gap-6 stagger-item">
          <div className="flex items-center gap-2">
            <span className="data-pulse data-pulse-animated scale-75" />
            <span className="font-headline text-[10px] text-charcoal/40 tracking-widest uppercase font-bold">System Online</span>
          </div>
          <div className="h-3 w-px bg-charcoal/10" />
          <span className="font-headline text-[10px] text-charcoal/40 tracking-widest uppercase font-bold">v.4.2.0-Stable</span>
        </div>
      </main>

      {/* Footer Nav */}
      <footer className="fixed bottom-10 w-full px-12 flex justify-between items-center opacity-30 hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="hidden lg:block pointer-events-auto">
          <Link href="/" className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-charcoal/60 hover:text-charcoal transition-colors">← Return to Frontier</Link>
        </div>
        <div className="text-right">
          <p className="font-headline text-[10px] tracking-widest text-charcoal/40 font-bold uppercase">Secure Portal Endpoint</p>
          <p className="text-[9px] text-accent-soft font-bold uppercase tracking-widest mt-1">Encrypted at rest</p>
        </div>
      </footer>
    </div>
  );
}

