"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { socialPresets } from "@/lib/tools";
import { Download, Upload, Monitor } from "lucide-react";

type Preset = typeof socialPresets[number];

export default function SocialResize() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<Preset>(socialPresets[0]);
  const [results, setResults] = useState<{ url: string; preset: Preset }[]>([]);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = (files: FileList | null) => {
    if (!files?.[0]) return;
    const url = URL.createObjectURL(files[0]);
    setImageUrl(url);
    setResults([]);
  };

  const renderPreview = useCallback(() => {
    if (!imageUrl || !previewRef.current) return;
    const canvas = previewRef.current;
    const ctx = canvas.getContext("2d")!;
    const img = new window.Image();
    img.onload = () => {
      const maxW = 280;
      const ratio = selected.width / selected.height;
      const previewW = maxW;
      const previewH = maxW / ratio;
      canvas.width = previewW;
      canvas.height = previewH;

      const scale = Math.max(previewW / img.naturalWidth, previewH / img.naturalHeight);
      const sw = previewW / scale;
      const sh = previewH / scale;
      const sx = (img.naturalWidth - sw) / 2;
      const sy = (img.naturalHeight - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, previewW, previewH);
    };
    img.src = imageUrl;
  }, [imageUrl, selected]);

  useEffect(() => { renderPreview(); }, [renderPreview]);

  const exportAll = useCallback(async () => {
    if (!imageUrl) return;
    setProcessing(true);
    const out: { url: string; preset: Preset }[] = [];

    for (const preset of socialPresets) {
      const img = new window.Image();
      await new Promise<void>(resolve => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = preset.width;
          canvas.height = preset.height;
          const ctx = canvas.getContext("2d")!;

          const scale = Math.max(preset.width / img.naturalWidth, preset.height / img.naturalHeight);
          const sw = preset.width / scale;
          const sh = preset.height / scale;
          const sx = (img.naturalWidth - sw) / 2;
          const sy = (img.naturalHeight - sh) / 2;
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, preset.width, preset.height);

          canvas.toBlob(blob => {
            if (blob) out.push({ url: URL.createObjectURL(blob), preset });
            resolve();
          }, "image/jpeg", 0.92);
        };
        img.src = imageUrl;
      });
    }

    setResults(out);
    setProcessing(false);
  }, [imageUrl]);

  const exportOne = useCallback(async (preset: Preset) => {
    if (!imageUrl) return;
    const img = new window.Image();
    await new Promise<void>(resolve => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = preset.width;
        canvas.height = preset.height;
        const ctx = canvas.getContext("2d")!;
        const scale = Math.max(preset.width / img.naturalWidth, preset.height / img.naturalHeight);
        const sw = preset.width / scale;
        const sh = preset.height / scale;
        const sx = (img.naturalWidth - sw) / 2;
        const sy = (img.naturalHeight - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, preset.width, preset.height);
        canvas.toBlob(blob => {
          if (!blob) { resolve(); return; }
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${preset.platform}-${preset.type}-${preset.width}x${preset.height}.jpg`;
          a.click();
          resolve();
        }, "image/jpeg", 0.92);
      };
      img.src = imageUrl;
    });
  }, [imageUrl]);

  const grouped = socialPresets.reduce((acc, p) => {
    if (!acc[p.platform]) acc[p.platform] = [];
    acc[p.platform].push(p);
    return acc;
  }, {} as Record<string, Preset[]>);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              <Monitor size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">Social Media Resizer</h1>
            <p style={{ color: "var(--text-muted)" }}>Perfect dimensions for every platform — instantly</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Upload + settings */}
            <div className="space-y-6">
              {!imageUrl ? (
                <div
                  className="upload-zone rounded-2xl p-10 text-center cursor-pointer"
                  style={{ background: "var(--bg-2)" }}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); loadFile(e.dataTransfer.files); }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-float" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
                      <Upload size={24} className="text-white" />
                    </div>
                    <p className="font-semibold text-lg">Drop your image here</p>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>or click to browse</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files)} />
                </div>
              ) : (
                <div className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Your image</span>
                    <button onClick={() => { setImageUrl(null); setResults([]); }} className="text-xs btn-secondary px-3 py-1 rounded-lg">
                      Change
                    </button>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Uploaded" className="w-full rounded-xl object-cover" style={{ maxHeight: 200, objectFit: "cover" }} />
                </div>
              )}

              {imageUrl && (
                <>
                  <div className="glass rounded-2xl p-5 space-y-4">
                    <h3 className="font-semibold">Platform presets</h3>
                    {Object.entries(grouped).map(([platform, presets]) => (
                      <div key={platform}>
                        <p className="text-xs font-bold uppercase mb-2" style={{ color: "var(--text-muted)" }}>{platform}</p>
                        <div className="flex flex-wrap gap-2">
                          {presets.map(p => (
                            <button key={`${p.platform}-${p.type}`}
                              onClick={() => setSelected(p)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                              style={{
                                background: selected.platform === p.platform && selected.type === p.type ? "linear-gradient(135deg, #8b5cf6, #ec4899)" : "rgba(139,92,246,0.1)",
                                color: selected.platform === p.platform && selected.type === p.type ? "white" : "#a78bfa",
                                border: `1px solid ${selected.platform === p.platform && selected.type === p.type ? "transparent" : "rgba(139,92,246,0.2)"}`,
                              }}>
                              {p.type}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={exportAll} disabled={processing}
                    className="btn-primary w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2">
                    {processing ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating all sizes...</> : <><Download size={18} /> Export all {socialPresets.length} sizes</>}
                  </button>
                </>
              )}
            </div>

            {/* Right: Preview */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold">{selected.platform} — {selected.type}</h3>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>{selected.width} × {selected.height}px</p>
                  </div>
                  {imageUrl && (
                    <button onClick={() => exportOne(selected)} className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                      <Download size={14} /> This size
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center p-4 rounded-xl" style={{ background: "var(--bg)", minHeight: 200 }}>
                  {imageUrl ? (
                    <canvas ref={previewRef} className="rounded-lg max-w-full" style={{ maxHeight: 280 }} />
                  ) : (
                    <div className="text-center" style={{ color: "var(--text-muted)" }}>
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm">Preview appears here</p>
                    </div>
                  )}
                </div>
              </div>

              {results.length > 0 && (
                <div className="glass rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold">All exported sizes</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {results.map((r, i) => (
                      <a key={i} href={r.url} download={`${r.preset.platform}-${r.preset.type}-${r.preset.width}x${r.preset.height}.jpg`}
                        className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer"
                        style={{ background: "var(--bg)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(139,92,246,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "var(--bg)")}>
                        <span className="text-lg">{r.preset.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{r.preset.platform} {r.preset.type}</p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{r.preset.width}×{r.preset.height}</p>
                        </div>
                        <Download size={14} style={{ color: "#a78bfa" }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
