"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Image, Video, Music, FileText, Smartphone } from "lucide-react";
import { tools } from "@/lib/tools";

const tabs = [
  { id: "photo",  label: "Photo",        Icon: Image,      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", glow: "rgba(99,102,241,0.4)" },
  { id: "video",  label: "Video",        Icon: Video,      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)", glow: "rgba(59,130,246,0.4)" },
  { id: "audio",  label: "Audio",        Icon: Music,      gradient: "linear-gradient(135deg, #10b981, #06b6d4)", glow: "rgba(16,185,129,0.4)" },
  { id: "doc",    label: "Document",     Icon: FileText,   gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", glow: "rgba(245,158,11,0.4)" },
  { id: "social", label: "Social Media", Icon: Smartphone, gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)", glow: "rgba(236,72,153,0.4)" },
];

const platforms = [
  { id: "instagram", label: "Instagram", emoji: "📸", gradient: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", href: "/tools/social/instagram", desc: "Profile, Post, Story, Reels", glow: "rgba(131,58,180,0.5)" },
  { id: "youtube",   label: "YouTube",   emoji: "▶",  gradient: "linear-gradient(135deg, #ff0000, #cc0000)",          href: "/tools/social/youtube",   desc: "Banner, Thumbnail, Profile", glow: "rgba(255,0,0,0.4)" },
  { id: "tiktok",    label: "TikTok",    emoji: "♪",  gradient: "linear-gradient(135deg, #010101, #69c9d0)",          href: "/tools/social/tiktok",    desc: "Video cover, Profile", glow: "rgba(105,201,208,0.4)" },
  { id: "whatsapp",  label: "WhatsApp",  emoji: "💬", gradient: "linear-gradient(135deg, #25d366, #128c7e)",          href: "/tools/social/whatsapp",  desc: "Profile photo, Status", glow: "rgba(37,211,102,0.4)" },
  { id: "facebook",  label: "Facebook",  emoji: "f",  gradient: "linear-gradient(135deg, #1877f2, #0a5bd1)",          href: "/tools/social/resize",    desc: "Cover, Profile, Post", glow: "rgba(24,119,242,0.4)" },
];

const docTools = [
  { name: "PDF Compressor", desc: "Reduce PDF file size" },
  { name: "PDF to Word",    desc: "Convert PDF to editable doc" },
  { name: "Merge PDFs",     desc: "Combine multiple PDFs" },
  { name: "Word to PDF",    desc: "Convert .docx to PDF" },
];

const toolGradients: Record<string, string> = {
  image:  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  video:  "linear-gradient(135deg, #3b82f6, #06b6d4)",
  audio:  "linear-gradient(135deg, #10b981, #06b6d4)",
  social: "linear-gradient(135deg, #ec4899, #8b5cf6)",
};

export default function ToolsTabs() {
  const [active, setActive] = useState("social");
  const [hovered, setHovered] = useState<string | null>(null);

  const categoryTools = tools.filter(t => {
    if (active === "photo")  return t.category === "image";
    if (active === "video")  return t.category === "video";
    if (active === "audio")  return t.category === "audio";
    return false;
  });

  const activeTab = tabs.find(t => t.id === active)!;

  return (
    <section style={{ padding: "80px 24px 100px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, marginBottom: 12 }}>
            All the tools you need
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 17 }}>Pick a category and get started — no signup required.</p>
        </div>

        {/* Tab bar — big visual cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 48 }}>
          {tabs.map(tab => {
            const isActive = active === tab.id;
            return (
              <button key={tab.id} onClick={() => setActive(tab.id)}
                onMouseEnter={() => setHovered(tab.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "20px 12px 18px",
                  borderRadius: 20,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                  background: isActive ? tab.gradient : hovered === tab.id ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                  boxShadow: isActive ? `0 12px 32px ${tab.glow}` : hovered === tab.id ? "0 4px 16px rgba(0,0,0,0.3)" : "none",
                  transform: isActive ? "translateY(-4px) scale(1.02)" : hovered === tab.id ? "translateY(-2px)" : "none",
                  outline: isActive ? "none" : "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.25s",
                }}>
                  <tab.Icon size={20} color={isActive ? "#fff" : "#a78bfa"} />
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: isActive ? "#fff" : "var(--text-muted)",
                  letterSpacing: 0.3,
                }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Social Media platform cards */}
        {active === "social" && (
          <div>
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
              Choose a platform to get perfectly sized assets with live preview
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
              {platforms.map(p => (
                <Link key={p.id} href={p.href} style={{ textDecoration: "none" }}>
                  <div
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      borderRadius: 24, padding: "28px 16px 24px",
                      textAlign: "center", cursor: "pointer",
                      background: hovered === p.id ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                      transform: hovered === p.id ? "translateY(-6px)" : "none",
                      boxShadow: hovered === p.id ? `0 16px 40px ${p.glow}` : "none",
                    }}>
                    {/* Platform icon circle */}
                    <div style={{
                      width: 64, height: 64, borderRadius: 22,
                      background: p.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28, margin: "0 auto 16px",
                      boxShadow: `0 8px 20px ${p.glow}`,
                      transition: "transform 0.25s",
                      transform: hovered === p.id ? "scale(1.1)" : "scale(1)",
                    }}>
                      {p.emoji}
                    </div>
                    <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 6, color: "var(--text)" }}>{p.label}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 14 }}>{p.desc}</p>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 12, fontWeight: 700, color: "#a78bfa",
                      padding: "4px 12px", borderRadius: 999,
                      background: "rgba(139,92,246,0.12)",
                      border: "1px solid rgba(139,92,246,0.2)",
                    }}>
                      Open <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Document coming soon */}
        {active === "doc" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {docTools.map(t => (
              <div key={t.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 22, padding: 26, opacity: 0.55 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg, #f59e0b, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>📄</div>
                <p style={{ fontWeight: 700, marginBottom: 5 }}>{t.name}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{t.desc}</p>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)", letterSpacing: 1 }}>SOON</span>
              </div>
            ))}
          </div>
        )}

        {/* Regular tool cards */}
        {active !== "social" && active !== "doc" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {categoryTools.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>🚧</p>
                <p style={{ fontWeight: 600 }}>Coming soon!</p>
              </div>
            ) : categoryTools.map(tool => (
              <Link key={tool.id} href={tool.href} style={{ textDecoration: "none" }}>
                <div
                  onMouseEnter={() => setHovered(tool.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: hovered === tool.id ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 22, padding: 26, height: "100%",
                    position: "relative", cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                    transform: hovered === tool.id ? "translateY(-4px)" : "none",
                    boxShadow: hovered === tool.id ? "0 16px 40px rgba(139,92,246,0.15)" : "none",
                  }}>
                  {tool.badge && (
                    <span style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999, background: tool.badge === "VIRAL" ? "rgba(236,72,153,0.15)" : "rgba(139,92,246,0.15)", color: tool.badge === "VIRAL" ? "#f472b6" : "#a78bfa", border: `1px solid ${tool.badge === "VIRAL" ? "rgba(236,72,153,0.3)" : "rgba(139,92,246,0.3)"}`, letterSpacing: 1 }}>
                      {tool.badge}
                    </span>
                  )}
                  <div style={{ width: 48, height: 48, borderRadius: 15, background: toolGradients[tool.category] || toolGradients.image, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18 }}>
                    {tool.icon}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: "var(--text)" }}>{tool.name}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 18 }}>{tool.description}</p>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Try now <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
