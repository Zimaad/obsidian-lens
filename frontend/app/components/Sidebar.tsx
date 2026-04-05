"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Frontier" },
  { href: "/gap-explorer", icon: "explore", label: "Explorer" },
  { href: "/library", icon: "book_4", label: "Archive" },
  { href: "/graph", icon: "hub", label: "Network" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth(); // Assuming 'user' exists in context

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center pt-24 pb-10 z-40 bg-cream-50/60 backdrop-blur-2xl border-r border-charcoal/10 transition-all duration-500 ease-strong">
      
      {/* ─── Main Navigation ─── */}
      <nav className="flex-1 flex flex-col items-center gap-1.5 w-full px-2 stagger-container">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-col items-center justify-center w-full py-4 rounded-2xl transition-all duration-500 ease-out-strong stagger-item
                ${isActive
                  ? "bg-charcoal text-cream-50 shadow-premium -translate-y-0.5"
                  : "text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5"
                }`}
              style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute -left-1 w-1 h-6 bg-accent-soft rounded-full shadow-[0_0_12px_var(--accent-soft)]" />
              )}
              
              <span className={`material-symbols-outlined text-2xl transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-charcoal'}`} 
                    style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 300" } : { fontVariationSettings: "'wght' 300" }}>
                {item.icon}
              </span>
              
              <span className={`mt-1 font-headline text-[8px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                {item.label}
              </span>
              
              {/* Tooltip Hover Affect */}
              <div className="absolute left-24 px-3 py-1.5 bg-charcoal text-cream-50 text-[10px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                {item.label} Exploration
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ─── Bottom Utilities ─── */}
      <div className="mt-auto flex flex-col items-center gap-6 w-full px-2">
        <div className="h-px w-8 bg-charcoal/5" />

        {/* Improved Exit Button */}
        <button 
          onClick={handleLogout}
          className="group relative flex flex-col items-center justify-center w-full py-4 rounded-xl text-charcoal/30 hover:text-red-700 hover:bg-red-50/50 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:-translate-x-0.5">logout</span>
          <span className="mt-1 font-headline text-[7px] uppercase tracking-widest font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}


