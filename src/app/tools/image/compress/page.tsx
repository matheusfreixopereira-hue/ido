"use client";
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadZone from "@/components/UploadZone";
import { Download, Minimize2 } from "lucide-react";

interface Result { name: string; url: string; originalSize: string; newSize: string; saved: string; }

export default function ImageCompress() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [results, setResults] = useState<Result[]>([]);
  const [processing, setProcessing] = useState(false);

  const compress = useCallback(async () => {
    if (!files.length) return;
    setProcessing(true);
    setResults([]);
    const out: Result[] = [];

    for (const file of files) {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>(resolve => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
          canvas.toBlob(blob => {
            if (!blob) { resolve(); return; }
            const saved = ((1 - blob.size / file.size) * 100).toFixed(0);
            out.push({
              name: file.name,
              url: URL.createObjectURL(blob),
              originalSize: `${(file.size / 1024).toFixed(1)} KB`,
              newSize: `${(blob.size / 1024).toFixed(1)} KB`,
              saved: `${saved}%`,
            });
            resolve();
          }, mime, quality / 100);
          URL.revokeObjectURL(url);
        };
        img.src = url;
      });
    }

    setResults(out);
    setProcessing(false);
  }, [files, quality]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              <Minimize2 size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">Image Compressor</h1>
            <p style={{ color: "var(--text-muted)" }}>Reduce file size while keeping great quality</p>
          </div>

          <UploadZone onFiles={setFiles} accept="image/*" multiple label="Drop images to compress" sublabel="JPG, PNG, WEBP supported" />

          {files.length > 0 && (
            <div className="mt-6 glass rounded-2xl p-6 space-y-4">
              <label className="text-sm font-medium block" style={{ color: "var(--text-muted)" }}>
                Quality: <span className="text-white font-bold">{quality}%</span>
                {quality >= 80 && <span className="ml-2 text-xs text-green-400">High quality</span>}
                {quality >= 60 && quality < 80 && <span className="ml-2 text-xs text-yellow-400">Balanced</span>}
                {quality < 60 && <span className="ml-2 text-xs text-orange-400">Maximum compression</span>}
              </label>
              <input type="range" min="10" max="100" step="5" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-purple-500" />
              <div className="flex gap-2">
                {[{ label: "Web", value: 75 }, { label: "Social", value: 85 }, { label: "Email", value: 60 }].map(p => (
                  <button key={p.label} onClick={() => setQuality(p.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium btn-secondary">
                    {p.label} ({p.value}%)
                  </button>
                ))}
              </div>
              <button onClick={compress} disabled={processing}
                className="btn-primary w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2">
                {processing ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Compressing...</> : <><Minimize2 size={18} /> Compress {files.length} {files.length === 1 ? "image" : "images"}</>}
              </button>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6 space-y-3">
              <h2 className="font-bold text-lg">Compressed files</h2>
              {results.map((r, i) => (
                <div key={i} className="glass rounded-2xl p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium truncate">{r.name}</p>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                      {r.originalSize} → <span className="text-green-400 font-semibold">{r.newSize}</span>
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }}>
                        -{r.saved}
                      </span>
                    </p>
                  </div>
                  <a href={r.url} download={r.name} className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                    <Download size={14} /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
