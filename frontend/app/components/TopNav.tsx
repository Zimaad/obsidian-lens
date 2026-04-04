"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function TopNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isPublic = pathname === "/" || pathname === "/login";

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-14
      bg-cream-50/80 backdrop-blur-xl
      shadow-sm
      border-b border-charcoal
    ">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center group">
          <Image 
            src="/hiatus_logo_cream.svg" 
            alt="Hiatus" 
            width={140} 
            height={56} 
            className="h-10 w-auto object-contain brightness-95 group-hover:brightness-110 transition-all duration-300"
            priority
          />
        </Link>
        {isPublic && (
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="text-charcoal transition-colors duration-200 decoration-none">Home</Link>
            <Link href="/pricing" className="text-charcoal/60 hover:text-charcoal transition-colors duration-200">Pricing</Link>
            <Link href="/lab" className="text-charcoal/60 hover:text-charcoal transition-colors duration-200">Lab</Link>
            <Link href="/gap-explorer" className="text-charcoal/60 hover:text-charcoal transition-colors duration-200">Gap Explorer</Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/settings" className="flex items-center group transition-transform duration-200 active:scale-95">
              <div className="w-9 h-9 rounded-full bg-charcoal text-cream-50 flex items-center justify-center font-bold text-[11px] border border-charcoal group-hover:bg-accent-soft transition-all duration-300 shadow-soft">
                {(() => {
                  if (user.displayName) {
                    const parts = user.displayName.split(" ");
                    return parts.map((p: string) => p[0]).join("").toUpperCase().substring(0, 2);
                  }
                  return user.email?.[0].toUpperCase() || "U";
                })()}
              </div>
            </Link>
          </div>
        ) : (
          <Link href="/login" className="btn-ghost !px-6 !py-1.5 !rounded-full text-xs font-semibold">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

