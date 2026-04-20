import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolsTabs from "@/components/ToolsTabs";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";

const stats = [
  { value: "100%", label: "Client-side" },
  { value: "0s",   label: "Files stored" },
  { value: "8+",   label: "Tools" },
  { value: "Free", label: "Forever" },
];

const features = [
  { icon: <Zap size={22} />,    title: "Instant",  desc: "Runs entirely in your browser. No uploads, no servers." },
  { icon: <Lock size={22} />,   title: "Private",  desc: "Files never leave your device. Zero tracking." },
  { icon: <Shield size={22} />, title: "Creators", desc: "Social presets, grid cutter, live preview simulators." },
];

const faqs = [
  { q: "Are my files safe?",         a: "Yes — all processing runs locally in your browser. Nothing is ever uploaded." },
  { q: "Is ido really free?",        a: "Completely free. No account, no watermarks, no hidden limits." },
  { q: "What formats are supported?", a: "Images: JPG, PNG, WEBP, AVIF. Video: MP4, WebM, MOV. Audio: MP3, WAV, OGG." },
  { q: "What makes ido different?",  a: "Live simulators for Instagram and YouTube — see exactly how your image will look before downloading." },
];

export default function Home() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Header />

      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 72, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 60, left: "15%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 100, right: "10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.1), transparent)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 36, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa" }}>
            ✨ The ultimate toolkit for content creators
          </div>
          <h1 style={{ fontSize: "clamp(72px, 12vw, 112px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-4px", marginBottom: 20 }}>
            <span className="gradient-text">ido</span>
          </h1>
          <p style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, marginBottom: 18 }}>I do it for you.</p>
          <p style={{ fontSize: 18, color: "var(--text-muted)", maxWidth: 600, margin: "0 auto 44px", lineHeight: 1.7 }}>
            Convert images, resize for social platforms, cut Instagram grids, simulate live previews — all in your browser, free.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/tools/social/instagram" className="btn-primary" style={{ padding: "14px 32px", borderRadius: 16, fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Start Creating <ArrowRight size={18} />
            </Link>
            <Link href="/tools/social/grid-cutter" className="btn-secondary" style={{ padding: "14px 32px", borderRadius: 16, fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
              ⊞ Grid Cutter
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 24px 64px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {stats.map(s => (
            <div key={s.label} className="card-hover" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 20, padding: "22px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 30, fontWeight: 900, background: "linear-gradient(135deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</p>
              <p style={{ fontSize: 12, marginTop: 6, color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs section */}
      <section style={{ background: "var(--bg-2)" }}>
        <ToolsTabs />
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, textAlign: "center", marginBottom: 48 }}>Why creators love ido</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {features.map(f => (
              <div key={f.title} className="card-hover" style={{ background: "var(--bg-2)", border: "1px solid rgba(139,92,246,0.12)", borderRadius: 24, padding: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--bg-2)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, textAlign: "center", marginBottom: 48 }}>FAQ</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {faqs.map(faq => (
              <div key={faq.q} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 20, padding: 26 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, marginBottom: 16 }}>Ready to create?</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 40, fontSize: 17 }}>Free, instant, private. No signup needed.</p>
        <Link href="/tools/social/instagram" className="btn-primary" style={{ padding: "16px 48px", borderRadius: 18, fontSize: 17, display: "inline-flex", alignItems: "center", gap: 10 }}>
          Get Started Free <ArrowRight size={20} />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
