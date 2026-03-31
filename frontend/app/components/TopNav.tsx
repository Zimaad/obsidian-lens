"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function TopNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isPublic = pathname === "/" || pathname === "/login";

  return (
    <nav className={`fixed top-0 w-full z-50 flex items-center justify-between px-6 h-14
      bg-slate-950/40 backdrop-blur-xl
      shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
      border-b border-white/[0.04]
      ${!isPublic ? "pl-20" : ""}
    `}>
      <div className="flex items-center gap-8">
        {isPublic && (
          <>
            <Link href="/" className="text-lg font-bold tracking-tighter text-white">Obsidian Lens</Link>
            <div className="hidden md:flex gap-6 text-sm">
              <Link href="/" className="text-violet-300 font-semibold transition-colors duration-200">Home</Link>
              <Link href="/lab" className="text-slate-400 hover:text-slate-200 transition-colors duration-200">Lab</Link>
              <Link href="/gap-explorer" className="text-slate-400 hover:text-slate-200 transition-colors duration-200">Gap Explorer</Link>
            </div>
          </>
        )}
        {!isPublic && (
          <span className="text-sm font-mono text-on-surface-variant uppercase tracking-widest">Obsidian Lens</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/[0.05]">
          <span className="material-symbols-outlined text-slate-400 text-sm mr-2" style={{ fontSize: "15px" }}>search</span>
          <input
            type="text"
            placeholder="Search research..."
            className="bg-transparent border-none text-xs focus:ring-0 focus:outline-none text-white placeholder-slate-500 w-28"
          />
        </div>
        
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/settings" className="flex items-center group">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || "User")}&background=8B5CF6&color=fff`}
                alt="Profile"
                className="w-7 h-7 rounded-full border border-violet-500/30 group-hover:border-violet-400/60 transition-colors duration-200"
              />
            </Link>
          </div>
        ) : (
          <Link href="/login" className="btn-ghost text-xs px-4 py-1.5 rounded-full">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
