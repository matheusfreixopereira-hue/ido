"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Music, Info } from "lucide-react";

export default function AudioConvert() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              <Music size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">Audio Converter</h1>
            <p style={{ color: "var(--text-muted)" }}>Convert between audio formats</p>
          </div>
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: "rgba(139,92,246,0.1)" }}>
              <Info size={24} style={{ color: "#a78bfa" }} />
            </div>
            <h2 className="text-xl font-bold">Coming very soon!</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Audio conversion requires FFmpeg.wasm, which is being integrated.
              In the meantime, try our video tools!
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {["MP3", "WAV", "OGG", "FLAC", "AAC", "M4A"].map(f => (
                <span key={f} className="px-3 py-1 rounded-lg text-sm font-semibold" style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>{f}</span>
              ))}
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>All these formats will be supported</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
