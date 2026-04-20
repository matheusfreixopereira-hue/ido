import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }} className="mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
                <Zap size={14} fill="white" className="text-white" />
              </span>
              <span className="gradient-text">ido</span>
            </Link>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              The ultimate toolkit for content creators. Fast, free, and private.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Images</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <li><Link href="/tools/image/convert" className="hover:text-white transition-colors">Convert Image</Link></li>
              <li><Link href="/tools/image/compress" className="hover:text-white transition-colors">Compress Image</Link></li>
              <li><Link href="/tools/image/resize" className="hover:text-white transition-colors">Resize Image</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Social Media</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <li><Link href="/tools/social/resize" className="hover:text-white transition-colors">Platform Resizer</Link></li>
              <li><Link href="/tools/social/grid-cutter" className="hover:text-white transition-colors">Grid Cutter</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Video & Audio</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <li><Link href="/tools/video/gif" className="hover:text-white transition-colors">Video to GIF</Link></li>
              <li><Link href="/tools/video/mute" className="hover:text-white transition-colors">Mute Video</Link></li>
              <li><Link href="/tools/audio/convert" className="hover:text-white transition-colors">Convert Audio</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>© 2026 ido. Free forever. Files never stored.</p>
          <p className="text-sm mt-2 md:mt-0" style={{ color: "var(--text-muted)" }}>
            Built for creators 🚀
          </p>
        </div>
      </div>
    </footer>
  );
}
