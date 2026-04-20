"use client";
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadZone from "@/components/UploadZone";
import { Download, Maximize2 } from "lucide-react";

const presets = [
  { label: "HD", w: 1920, h: 1080 }, { label: "4K", w: 3840, h: 2160 },
  { label: "Square", w: 1080, h: 1080 }, { label: "Story", w: 1080, h: 1920 },
];

export default function ImageResize() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [keepRatio, setKeepRatio] = useState(true);
  const [origRatio, setOrigRatio] = useState(1);
  const [result, setResult] = useState<{ url: string; name: string; size: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  const loadImage = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    const img = new window.Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setOrigRatio(ratio);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = URL.createObjectURL(f);
  }, []);

  const updateW = (v: number) => {
    setWidth(v);
    if (keepRatio) setHeight(Math.round(v / origRatio));
  };
  const updateH = (v: number) => {
    setHeight(v);
    if (keepRatio) setWidth(Math.round(v * origRatio));
  };

  const resize = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (!blob) return;
        const ext = file.name.split(".").pop() || "jpg";
        const name = `${file.name.replace(/\.[^.]+$/, "")}_${width}x${height}.${ext}`;
        setResult({ url: URL.createObjectURL(blob), name, size: `${(blob.size / 1024).toFixed(1)} KB` });
        setProcessing(false);
      }, file.type || "image/jpeg", 0.92);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [file, width, height]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              <Maximize2 size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">Image Resizer</h1>
            <p style={{ color: "var(--text-muted)" }}>Resize to exact dimensions</p>
          </div>

          <UploadZone onFiles={loadImage} accept="image/*" label="Drop an image" />

          {file && (
            <div className="mt-6 glass rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap gap-2">
                {presets.map(p => (
                  <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h); }} className="px-3 py-1.5 rounded-lg text-xs font-medium btn-secondary">
                    {p.label} ({p.w}×{p.h})
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Width (px)</label>
                  <input type="number" value={width} onChange={e => updateW(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Height (px)</label>
                  <input type="number" value={height} onChange={e => updateH(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={keepRatio} onChange={e => setKeepRatio(e.target.checked)} className="w-4 h-4 accent-purple-500" />
                <span className="text-sm font-medium">Keep aspect ratio</span>
              </label>
              <button onClick={resize} disabled={processing} className="btn-primary w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                {processing ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resizing...</> : <><Maximize2 size={18} /> Resize to {width}×{height}</>}
              </button>
            </div>
          )}

          {result && (
            <div className="mt-6 glass rounded-2xl p-5 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium">{result.name}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{result.size} · {width}×{height}px</p>
              </div>
              <a href={result.url} download={result.name} className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                <Download size={14} /> Download
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
