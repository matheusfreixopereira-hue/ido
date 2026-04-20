import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools, categories } from "@/lib/tools";
import { ArrowRight, Shield, Zap, Lock, Star } from "lucide-react";

const stats = [
  { value: "100%", label: "Client-side processing" },
  { value: "0s", label: "Files stored" },
  { value: "8+", label: "Tools available" },
  { value: "Free", label: "Forever" },
];

const features = [
  { icon: <Zap size={20} />, title: "Instant processing", desc: "Everything runs in your browser. No waiting for uploads or servers." },
  { icon: <Lock size={20} />, title: "100% private", desc: "Your files never leave your device. Zero tracking, zero storage." },
  { icon: <Shield size={20} />, title: "Creator-focused", desc: "Built specifically for content creators, designers, and social media managers." },
];

const faqs = [
  { q: "Are my files safe?", a: "Yes! All processing happens directly in your browser using Web APIs. Your files are never sent to any server." },
  { q: "Is ido really free?", a: "Yes, completely free. No account required, no watermarks, no limits on the basic plan." },
  { q: "What formats are supported?", a: "Images: JPG, PNG, WEBP, AVIF, GIF, BMP. Video: MP4, WebM, MOV, AVI. Audio: MP3, WAV, OGG, FLAC." },
  { q: "What makes ido different?", a: "Unlike other converters, ido is built for content creators — with social media presets, grid cutter, and instant previews for every major platform." },
];

export default function Home() {
  const popularTools = tools.filter(t => t.popular);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
          <div className="absolute top-32 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa" }}>
            <Star size={14} fill="currentColor" />
            The ultimate toolkit for content creators
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
            <span className="gradient-text">ido</span>
            <span className="block text-3xl md:text-4xl mt-3 font-bold" style={{ color: "var(--text)" }}>
              I do it for you.
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: "var(--text-muted)" }}>
            Convert images, resize for every social platform, cut Instagram grids, turn videos into GIFs —
            all in your browser, instantly, for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools/social/resize" className="btn-primary px-8 py-4 rounded-2xl text-base flex items-center gap-2 justify-center">
              Start Creating <ArrowRight size={18} />
            </Link>
            <Link href="/tools/social/grid-cutter" className="btn-secondary px-8 py-4 rounded-2xl text-base flex items-center gap-2 justify-center">
              ⊞ Instagram Grid Cutter
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 text-center card-hover">
              <p className="text-3xl font-black gradient-text">{s.value}</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-6 py-16" style={{ background: "var(--bg-2)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3">All the tools you need</h2>
            <p style={{ color: "var(--text-muted)" }}>Organized by category. No signup required.</p>
          </div>

          {categories.map((cat) => {
            const catTools = tools.filter(t => t.category === cat.id);
            return (
              <div key={cat.id} className="mb-12">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h3 className="text-xl font-bold">{cat.label}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {catTools.map((tool) => (
                    <Link key={tool.id} href={tool.href}
                      className="glass rounded-2xl p-5 card-hover flex flex-col gap-3 relative group"
                    >
                      {tool.badge && (
                        <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: tool.badge === "VIRAL" ? "rgba(236,72,153,0.2)" : "rgba(139,92,246,0.2)", color: tool.badge === "VIRAL" ? "#ec4899" : "#a78bfa", border: `1px solid ${tool.badge === "VIRAL" ? "rgba(236,72,153,0.3)" : "rgba(139,92,246,0.3)"}` }}>
                          {tool.badge}
                        </span>
                      )}
                      <span className="text-3xl">{tool.icon}</span>
                      <div>
                        <p className="font-bold">{tool.name}</p>
                        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
                      </div>
                      <span className="text-xs font-medium mt-auto flex items-center gap-1" style={{ color: "#a78bfa" }}>
                        Try now <ArrowRight size={12} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">How it works</h2>
          <p className="mb-12" style={{ color: "var(--text-muted)" }}>Three steps, zero friction.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload your file", desc: "Drag & drop or click to select. Any format supported." },
              { step: "02", title: "Choose your settings", desc: "Pick the format, platform preset, or grid layout." },
              { step: "03", title: "Download instantly", desc: "Your file is ready. No email, no waiting, no account." },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "white" }}>
                  {s.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16" style={{ background: "var(--bg-2)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Why creators love ido</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 card-hover">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "white" }}>
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass rounded-2xl p-6">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center" style={{ background: "var(--bg-2)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Ready to create?</h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>Free, instant, private. No signup needed.</p>
          <Link href="/tools/social/resize" className="btn-primary px-10 py-4 rounded-2xl text-lg inline-flex items-center gap-2">
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
