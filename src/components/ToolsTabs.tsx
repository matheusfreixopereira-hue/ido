"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools } from "@/lib/tools";

const tabs = [
  { id: "photo",  label: "📷 Photo",       category: "image" },
  { id: "video",  label: "🎬 Video",        category: "video" },
  { id: "audio",  label: "🎵 Audio",        category: "audio" },
  { id: "doc",    label: "📄 Document",     category: "document" },
  { id: "social", label: "📱 Social Media", category: "social" },
];

const platforms = [
  { id: "instagram", label: "Instagram", icon: "📸", color: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", href: "/tools/social/instagram", desc: "Profile, Post, Story, Reels" },
  { id: "youtube",   label: "YouTube",   icon: "▶️", color: "linear-gradient(135deg, #ff0000, #cc0000)",           href: "/tools/social/youtube",   desc: "Banner, Thumbnail, Profile" },
  { id: "tiktok",    label: "TikTok",    icon: "🎵", color: "linear-gradient(135deg, #010101, #69c9d0)",           href: "/tools/social/tiktok",    desc: "Video cover, Profile" },
  { id: "whatsapp",  label: "WhatsApp",  icon: "💬", color: "linear-gradient(135deg, #25d366, #128c7e)",           href: "/tools/social/whatsapp",  desc: "Profile photo, Status" },
  { id: "facebook",  label: "Facebook",  icon: "👥", color: "linear-gradient(135deg, #1877f2, #0a5bd1)",           href: "/tools/social/resize",    desc: "Cover, Profile, Post" },
];

const docTools = [
  { name: "PDF Compressor",   desc: "Reduce PDF file size",       badge: "Soon" },
  { name: "PDF to Word",      desc: "Convert PDF to editable doc", badge: "Soon" },
  { name: "Merge PDFs",       desc: "Combine multiple PDFs",       badge: "Soon" },
  { name: "Word to PDF",      desc: "Convert .docx to PDF",        badge: "Soon" },
];

export default function ToolsTabs() {
  const [active, setActive] = useState("photo");

  const categoryTools = tools.filter(t => {
    if (active === "photo") return t.category === "image";
    if (active === "video") return t.category === "video";
    if (active === "audio") return t.category === "audio";
    return false;
  });

  return (
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, marginBottom: 12 }}>All the tools you need</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 16 }}>Pick a category and get started instantly.</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              style={{
                padding: "12px 24px", borderRadius: 14, fontSize: 14, fontWeight: 700,
                border: "none", cursor: "pointer", transition: "all 0.2s",
                background: active === tab.id ? "linear-gradient(135deg, #8b5cf6, #ec4899)" : "rgba(139,92,246,0.08)",
                color: active === tab.id ? "#fff" : "var(--text-muted)",
                boxShadow: active === tab.id ? "0 8px 20px rgba(139,92,246,0.35)" : "none",
                transform: active === tab.id ? "translateY(-2px)" : "none",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Social Media platforms grid */}
        {active === "social" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
            {platforms.map(p => (
              <Link key={p.id} href={p.href} style={{ textDecoration: "none" }}>
                <div className="card-hover" style={{ background: "var(--bg-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 22, padding: 28, textAlign: "center", cursor: "pointer" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                    {p.icon}
                  </div>
                  <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, color: "var(--text)" }}>{p.label}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{p.desc}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 14, fontSize: 12, fontWeight: 600, color: "#a78bfa" }}>
                    Open <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Document tools (coming soon) */}
        {active === "doc" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {docTools.map(t => (
              <div key={t.name} style={{ background: "var(--bg-2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, opacity: 0.6 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>📄</div>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{t.name}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.desc}</p>
                <span style={{ display: "inline-block", marginTop: 12, fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)", letterSpacing: 1 }}>SOON</span>
              </div>
            ))}
          </div>
        )}

        {/* Regular tool cards */}
        {active !== "social" && active !== "doc" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {categoryTools.map(tool => (
              <Link key={tool.id} href={tool.href} style={{ textDecoration: "none" }}>
                <div className="card-hover" style={{ background: "var(--bg-2)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: 22, padding: 24, cursor: "pointer", height: "100%", position: "relative" }}>
                  {tool.badge && (
                    <span style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999, background: tool.badge === "VIRAL" ? "rgba(236,72,153,0.15)" : "rgba(139,92,246,0.15)", color: tool.badge === "VIRAL" ? "#f472b6" : "#a78bfa", border: `1px solid ${tool.badge === "VIRAL" ? "rgba(236,72,153,0.3)" : "rgba(139,92,246,0.3)"}`, letterSpacing: 1 }}>
                      {tool.badge}
                    </span>
                  )}
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
                    {tool.icon}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: "var(--text)" }}>{tool.name}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 16 }}>{tool.description}</p>
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
