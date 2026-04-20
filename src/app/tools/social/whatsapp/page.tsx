"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function WhatsAppPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Header />
      <main style={{ paddingTop: 88, paddingBottom: 64 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)", marginBottom: 48 }}>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={14} /><span>Social Media</span><ChevronRight size={14} />
            <span style={{ color: "var(--text)", fontWeight: 600 }}>WhatsApp</span>
          </div>
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 72, height: 72, borderRadius: 24, background: "linear-gradient(135deg, #25d366, #128c7e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(37,211,102,0.3)" }}>💬</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>WhatsApp Tools</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>Profile photo resizer with live preview — coming soon!</p>
            <Link href="/tools/social/instagram" className="btn-primary" style={{ padding: "12px 28px", borderRadius: 14, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Try Instagram tools →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
