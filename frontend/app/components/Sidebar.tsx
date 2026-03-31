"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/lab", icon: "biotech", label: "Lab" },
  { href: "/gap-explorer", icon: "explore", label: "Gap Explorer" },
  { href: "/library", icon: "book_4", label: "Library" },
  { href: "/graph", icon: "hub", label: "Graph" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-16 flex flex-col items-center pt-20 pb-6 z-40 bg-[#0a0a0f]/80 border-r border-white/[0.04] backdrop-blur-xl">
      {/* Logo mark */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_14px_rgba(199,191,255,0.3)]">
        <span className="material-symbols-outlined text-on-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>lens</span>
      </div>

      <nav className="flex flex-col gap-1 w-full px-2">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`nav-link group relative flex flex-col items-center justify-center gap-1 py-3 rounded-lg cursor-pointer stagger-item
                ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-white/[0.04] hover:text-white"
                }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="material-symbols-outlined text-xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-wider opacity-70 leading-none">{item.label}</span>
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Online indicator */}
      <div className="mt-auto flex flex-col items-center gap-1.5">
        <div className="data-pulse data-pulse-animated" />
        <span className="font-mono text-[7px] uppercase tracking-widest text-on-surface-variant/50">Live</span>
      </div>
    </aside>
  );
}
