"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/tools/image/convert", label: "Images" },
  { href: "/tools/social/resize", label: "Social Media" },
  { href: "/tools/social/grid-cutter", label: "Grid Cutter" },
  { href: "/tools/video/gif", label: "Video → GIF" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50" style={{ background: "rgba(7,7,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl group">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
            <Zap size={16} fill="white" />
          </span>
          <span className="gradient-text">ido</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/tools/social/resize" className="hidden md:flex btn-primary px-4 py-2 rounded-xl text-sm">
            Try Free ✨
          </Link>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} style={{ color: "var(--text-muted)" }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-1" style={{ borderTop: "1px solid var(--border)" }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
