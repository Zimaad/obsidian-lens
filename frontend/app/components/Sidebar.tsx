"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dash" },
  { href: "/lab", icon: "biotech", label: "Lab" },
  { href: "/gap-explorer", icon: "explore", label: "Gap" },
  { href: "/library", icon: "book_4", label: "Lib" },
  { href: "/graph", icon: "hub", label: "Graph" },
  { href: "/settings", icon: "settings", label: "Setup" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-16 flex flex-col items-center pt-20 pb-6 z-40 bg-cream-50/80 border-r border-charcoal/5 backdrop-blur-xl">
      {/* Logo mark */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-9 h-9 bg-charcoal rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110">
        <span className="material-symbols-outlined text-cream-50 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>lens</span>
      </div>

      <nav className="flex flex-col gap-2 w-full px-2 mt-4 stagger-container">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`nav-link group relative flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl cursor-pointer stagger-item
                ${isActive
                  ? "bg-charcoal text-cream-50 shadow-md"
                  : "text-charcoal hover:bg-charcoal/10"
                }`}
              style={{ "--stagger-delay": `${i * 50}ms` } as React.CSSProperties}
            >
              <span className="material-symbols-outlined text-xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className="font-headline text-[7px] uppercase tracking-widest font-bold leading-none">{item.label}</span>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent-soft rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <button 
        onClick={handleLogout}
        title="Logout"
        className="mt-6 nav-link group relative flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl cursor-pointer text-charcoal/60 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full px-2"
      >
        <span className="material-symbols-outlined text-xl">logout</span>
        <span className="font-headline text-[7px] uppercase tracking-widest font-bold leading-none">Exit</span>
      </button>

      {/* Online indicator */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="data-pulse data-pulse-animated scale-75" />
        <span className="font-headline text-[7px] uppercase tracking-widest text-charcoal/30 font-bold">Live</span>
      </div>
    </aside>
  );
}

