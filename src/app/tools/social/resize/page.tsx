"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { socialPresets } from "@/lib/tools";
import { Download, Upload, Monitor } from "lucide-react";

type Preset = typeof socialPresets[number];

const CANVAS_W = 320;

export default function SocialResize() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imgReady, setImgReady] = useState(false);
  const [selected, setSelected] = useState<Preset>(socialPresets[0]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [results, setResults] = useState<{ url: string; preset: Preset }[]>([]);
  const [processing, setProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const cH = Math.round(CANVAS_W / (selected.width / selected.height));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_W;
    canvas.height = cH;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CANVAS_W, cH);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, CANVAS_W, cH);

    if (!imgRef.current) return;

    const ratio = selected.width / selected.height;
    const baseH = CANVAS_W / ratio;
    const sW = CANVAS_W * scale;
    const sH = baseH * scale;
    const x = (CANVAS_W - sW) / 2 + offset.x;
    const y = (cH - sH) / 2 + offset.y;

    ctx.drawImage(imgRef.current, x, y, sW, sH);
  }, [imgReady, offset, scale, selected, cH]);

  useEffect(() => { draw(); }, [draw]);

  const loadFile = (files: FileList | null) => {
    if (!files?.[0]) return;
    const url = URL.createObjectURL(files[0]);
    setImageUrl(url);
    setOffset({ x: 0, y: 0 });
    setScale(1);
    setImgReady(false);
    setResults([]);
    const img = new window.Image();
    img.onload = () => { imgRef.current = img; setImgReady(true); };
    img.src = url;
  };

  const selectPreset = (p: Preset) => {
    setSelected(p);
    setOffset({ x: 0, y: 0 });
    setScale(1);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging) setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setDragging(false);
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.max(0.2, Math.min(5, s - e.deltaY * 0.001)));
  };

  const exportOne = useCallback((preset: Preset, currentOffset = offset, currentScale = scale) => {
    if (!imgRef.current) return;
    const factor = preset.width / CANVAS_W;
    const presetCH = Math.round(CANVAS_W / (preset.width / preset.height));

    const out = document.createElement("canvas");
    out.width = preset.width;
    out.height = preset.height;
    const ctx = out.getContext("2d")!;

    const baseH = CANVAS_W / (preset.width / preset.height);
    const sW = CANVAS_W * currentScale * factor;
    const sH = baseH * currentScale * factor;
    const x = (preset.width - sW) / 2 + currentOffset.x * factor;
    const y = (preset.height - sH) / 2 + currentOffset.y * factor;

    ctx.drawImage(imgRef.current, x, y, sW, sH);

    out.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${preset.platform}-${preset.type}-${preset.width}x${preset.height}.jpg`;
      a.click();
    }, "image/jpeg", 0.92);
  }, [offset, scale]);

  const exportAll = useCallback(async () => {
    if (!imgRef.current) return;
    setProcessing(true);
    const out: { url: string; preset: Preset }[] = [];

    for (const preset of socialPresets) {
      const factor = preset.width / CANVAS_W;
      const canvas = document.createElement("canvas");
      canvas.width = preset.width;
      canvas.height = preset.height;
      const ctx = canvas.getContext("2d")!;
      const baseH = CANVAS_W / (preset.width / preset.height);
      const sW = CANVAS_W * scale * factor;
      const sH = baseH * scale * factor;
      const x = (preset.width - sW) / 2 + offset.x * factor;
      const y = (preset.height - sH) / 2 + offset.y * factor;
      ctx.drawImage(imgRef.current!, x, y, sW, sH);

      await new Promise<void>(resolve => {
        canvas.toBlob(blob => {
          if (blob) out.push({ url: URL.createObjectURL(blob), preset });
          resolve();
        }, "image/jpeg", 0.92);
      });
    }

    setResults(out);
    setProcessing(false);
  }, [offset, scale]);

  const grouped = socialPresets.reduce((acc, p) => {
    if (!acc[p.platform]) acc[p.platform] = [];
    acc[p.platform].push(p);
    return acc;
  }, {} as Record<string, Preset[]>);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, paddingTop: 88, paddingBottom: 64 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(139,92,246,0.35)" }}>
              <Monitor size={24} color="white" />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Social Media Resizer</h1>
            <p style={{ color: "var(--text-muted)" }}>Perfect dimensions for every platform — instantly</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

            {/* Left: canvas editor + presets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Canvas editor */}
              <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 24, padding: 20 }}>
                {!imageUrl ? (
                  <div
                    className="upload-zone"
                    style={{ borderRadius: 16, padding: 48, textAlign: "center", cursor: "pointer", background: "var(--bg)" }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); loadFile(e.dataTransfer.files); }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Upload size={22} color="white" />
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 6 }}>Drop your image here</p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>or click to browse</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>Your image</span>
                      <button onClick={() => { setImageUrl(null); setResults([]); imgRef.current = null; }}
                        style={{ fontSize: 12, padding: "4px 12px", borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer" }}>
                        Change
                      </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                      <canvas
                        ref={canvasRef}
                        style={{ borderRadius: 10, cursor: dragging ? "grabbing" : "grab", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", display: "block", maxWidth: "100%" }}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                        onWheel={onWheel}
                      />
                    </div>
                    <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                      🖱 Drag to reposition · Scroll to zoom
                    </p>
                    <input
                      type="range" min="0.2" max="5" step="0.05" value={scale}
                      onChange={e => setScale(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#8b5cf6" }}
                    />
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => loadFile(e.target.files)} />
              </div>

              {/* Presets */}
              {imageUrl && (
                <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 20, padding: 20 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Platform presets</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {Object.entries(grouped).map(([platform, presets]) => (
                      <div key={platform}>
                        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>{platform}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {presets.map(p => {
                            const isActive = selected.platform === p.platform && selected.type === p.type;
                            return (
                              <button
                                key={`${p.platform}-${p.type}`}
                                onClick={() => selectPreset(p)}
                                style={{
                                  padding: "5px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                                  background: isActive ? "linear-gradient(135deg, #8b5cf6, #ec4899)" : "rgba(139,92,246,0.08)",
                                  color: isActive ? "white" : "#a78bfa",
                                  border: `1px solid ${isActive ? "transparent" : "rgba(139,92,246,0.2)"}`,
                                }}>
                                {p.type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imageUrl && (
                <button onClick={exportAll} disabled={processing}
                  style={{ width: "100%", padding: "14px", borderRadius: 16, fontWeight: 700, fontSize: 15, border: "none", cursor: processing ? "not-allowed" : "pointer", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: processing ? 0.7 : 1 }}>
                  {processing
                    ? <><span style={{ width: 18, height: 18, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Generating all sizes...</>
                    : <><Download size={18} /> Export all {socialPresets.length} sizes</>}
                </button>
              )}
            </div>

            {/* Right: preview info + results */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Selected preset info */}
              <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 20, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{selected.platform} — {selected.type}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{selected.width} × {selected.height}px</p>
                  </div>
                  {imageUrl && (
                    <button
                      onClick={() => exportOne(selected)}
                      style={{ padding: "8px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "white", display: "flex", alignItems: "center", gap: 6 }}>
                      <Download size={14} /> This size
                    </button>
                  )}
                </div>
                <div style={{ background: "var(--bg)", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160 }}>
                  {imageUrl ? (
                    <PreviewMirror canvasRef={canvasRef} />
                  ) : (
                    <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>📱</div>
                      <p style={{ fontSize: 13 }}>Preview appears here</p>
                    </div>
                  )}
                </div>
                {imageUrl && (
                  <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>
                    Drag & zoom on the left to reposition — preview updates live
                  </p>
                )}
              </div>

              {/* Export results */}
              {results.length > 0 && (
                <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 20, padding: 20 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>All exported sizes</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }}>
                    {results.map((r, i) => (
                      <a key={i} href={r.url} download={`${r.preset.platform}-${r.preset.type}-${r.preset.width}x${r.preset.height}.jpg`}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "var(--bg)", textDecoration: "none", color: "var(--text)", transition: "background 0.15s", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(139,92,246,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "var(--bg)")}>
                        <span style={{ fontSize: 18 }}>{r.preset.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{r.preset.platform} {r.preset.type}</p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.preset.width}×{r.preset.height}</p>
                        </div>
                        <Download size={14} color="#a78bfa" />
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

function PreviewMirror({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const src = canvasRef.current;
    const dst = ref.current;
    if (!src || !dst) return;
    dst.width = src.width;
    dst.height = src.height;
    const ctx = dst.getContext("2d")!;
    ctx.drawImage(src, 0, 0);
  });

  return (
    <canvas
      ref={ref}
      style={{ borderRadius: 8, maxWidth: "100%", maxHeight: 240, display: "block" }}
    />
  );
}
