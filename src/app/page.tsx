import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools, categories } from "@/lib/tools";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";

const stats = [
  { value: "100%", label: "Client-side processing" },
  { value: "0s", label: "Files stored" },
  { value: "8+", label: "Tools available" },
  { value: "Free", label: "Forever" },
];

const features = [
  { icon: <Zap size={22} />, title: "Instant processing", desc: "Everything runs in your browser. No waiting for uploads or servers." },
  { icon: <Lock size={22} />, title: "100% private", desc: "Your files never leave your device. Zero tracking, zero storage." },
  { icon: <Shield size={22} />, title: "Creator-focused", desc: "Built specifically for content creators and social media managers." },
];

const faqs = [
  { q: "Are my files safe?", a: "Yes! All processing happens directly in your browser. Your files are never sent to any server." },
  { q: "Is ido really free?", a: "Yes, completely free. No account required, no watermarks, no limits." },
  { q: "What formats are supported?", a: "Images: JPG, PNG, WEBP, AVIF, GIF. Video: MP4, WebM, MOV. Audio: MP3, WAV, OGG, FLAC." },
  { q: "What makes ido different?", a: "Unlike other converters, ido is built for content creators — with social media presets, grid cutter, and instant previews for every major platform." },
];

const categoryColors: Record<string, string> = {
  image: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  social: "linear-gradient(135deg, #ec4899, #f97316)",
  video: "linear-gradient(135deg, #3b82f6, #06b6d4)",
  audio: "linear-gradient(135deg, #10b981, #6366f1)",
};

export default function Home() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Header />

      {/* ── Hero ── */}
      <section style={{ paddingTop: 120, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        {/* blobs */}
        <div style={{ position: "absolute", top: 80, left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 120, right: "15%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.12), transparent)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 32, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa" }}>
            ✨ The ultimate toolkit for content creators
          </div>

          <h1 style={{ fontSize: "clamp(64px, 10vw, 100px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-3px", marginBottom: 16 }}>
            <span className="gradient-text">ido</span>
          </h1>
          <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>
            I do it for you.
          </p>
          <p style={{ fontSize: 18, color: "var(--text-muted)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Convert images, resize for every social platform, cut Instagram grids, turn videos into GIFs — all in your browser, instantly, for free.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/tools/social/resize" className="btn-primary" style={{ padding: "14px 32px", borderRadius: 16, fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Start Creating <ArrowRight size={18} />
            </Link>
            <Link href="/tools/social/grid-cutter" className="btn-secondary" style={{ padding: "14px 32px", borderRadius: 16, fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
              ⊞ Grid Cutter
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {stats.map((s) => (
            <div key={s.label} className="card-hover" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 20, padding: "24px 16px", textAlign: "center" }}>
              <p style={{ fontSize: 32, fontWeight: 900, background: "linear-gradient(135deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</p>
              <p style={{ fontSize: 12, marginTop: 6, color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools ── */}
      <section style={{ background: "var(--bg-2)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, marginBottom: 12 }}>All the tools you need</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16 }}>Organized by category. No signup required.</p>
          </div>

          {categories.map((cat) => {
            const catTools = tools.filter(t => t.category === cat.id);
            return (
              <div key={cat.id} style={{ marginBottom: 56 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: categoryColors[cat.id], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    {cat.emoji}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800 }}>{cat.label}</h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {catTools.map((tool) => (
                    <Link key={tool.id} href={tool.href} style={{ textDecoration: "none", display: "block" }}>
                      <div className="card-hover" style={{ background: "var(--bg)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 20, padding: 24, height: "100%", position: "relative", cursor: "pointer" }}>
                        {tool.badge && (
                          <span style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999, background: tool.badge === "VIRAL" ? "rgba(236,72,153,0.15)" : "rgba(139,92,246,0.15)", color: tool.badge === "VIRAL" ? "#f472b6" : "#a78bfa", border: `1px solid ${tool.badge === "VIRAL" ? "rgba(236,72,153,0.3)" : "rgba(139,92,246,0.3)"}`, letterSpacing: 1 }}>
                            {tool.badge}
                          </span>
                        )}
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: categoryColors[cat.id], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
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
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, marginBottom: 12 }}>How it works</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 56 }}>Three steps, zero friction.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { step: "01", title: "Upload your file", desc: "Drag & drop or click to select. Any format supported." },
              { step: "02", title: "Choose settings", desc: "Pick the format, platform preset, or grid layout." },
              { step: "03", title: "Download instantly", desc: "Your file is ready. No email, no waiting, no account." },
            ].map((s) => (
              <div key={s.step}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, margin: "0 auto 16px" }}>
                  {s.step}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ background: "var(--bg-2)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 900, textAlign: "center", marginBottom: 48 }}>Why creators love ido</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} className="card-hover" style={{ background: "var(--bg)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 24, padding: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 900, textAlign: "center", marginBottom: 48 }}>FAQ</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqs.map((faq) => (
              <div key={faq.q} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 20, padding: 28 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: 16 }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "var(--bg-2)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, marginBottom: 16 }}>Ready to create?</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 40, fontSize: 17 }}>Free, instant, private. No signup needed.</p>
          <Link href="/tools/social/resize" className="btn-primary" style={{ padding: "16px 48px", borderRadius: 18, fontSize: 17, display: "inline-flex", alignItems: "center", gap: 10 }}>
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
