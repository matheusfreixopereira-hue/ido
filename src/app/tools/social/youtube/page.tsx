"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, Download, ChevronRight } from "lucide-react";
import Link from "next/link";

type Tool = "banner" | "profile" | "thumbnail";

const toolTabs: { id: Tool; label: string; size: string; w: number; h: number }[] = [
  { id: "banner",    label: "Channel Banner",  size: "2560 × 1440", w: 2560, h: 1440 },
  { id: "profile",   label: "Profile Photo",   size: "800 × 800",   w: 800,  h: 800  },
  { id: "thumbnail", label: "Thumbnail",       size: "1280 × 720",  w: 1280, h: 720  },
];

const CANVAS_W = 360;

export default function YouTubePage() {
  const [activeTool, setActiveTool] = useState<Tool>("banner");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [channelName, setChannelName] = useState("Your Channel");
  const [subscribers, setSubscribers] = useState("1.2K subscribers");
  const [imgReady, setImgReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const tool = toolTabs.find(t => t.id === activeTool)!;
  const cW = CANVAS_W;
  const cH = activeTool === "banner" ? Math.round(CANVAS_W * 9 / 16) : activeTool === "thumbnail" ? Math.round(CANVAS_W * 9 / 16) : CANVAS_W;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = cW; canvas.height = cH;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, cW, cH);

    const bg = activeTool === "banner" ? "#1a1a1a" : activeTool === "thumbnail" ? "#2d2d2d" : "#e0e0e0";
    ctx.fillStyle = bg;
    if (activeTool === "profile") {
      ctx.beginPath();
      ctx.arc(cW / 2, cH / 2, cW / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, cW, cH);
    }

    if (imgRef.current) {
      const img = imgRef.current;
      const r = tool.w / tool.h;
      let baseW = cW, baseH = cW / r;
      if (activeTool === "profile") { baseW = cW; baseH = cH; }
      const sW = baseW * scale, sH = baseH * scale;
      const x = (cW - sW) / 2 + offset.x;
      const y = (cH - sH) / 2 + offset.y;

      ctx.save();
      if (activeTool === "profile") {
        ctx.beginPath();
        ctx.arc(cW / 2, cH / 2, cW / 2, 0, Math.PI * 2);
        ctx.clip();
      }
      ctx.drawImage(img, x, y, sW, sH);
      ctx.restore();
    }

    if (activeTool === "banner") {
      const safeW = cW * (1546 / 2560);
      const safeH = cH * (423 / 1440);
      const sx = (cW - safeW) / 2;
      const sy = (cH - safeH) / 2;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(sx, sy, safeW, safeH);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(sx, sy, safeW, safeH);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Safe zone (all devices)", cW / 2, sy + safeH / 2);
    }
  }, [imgReady, offset, scale, activeTool, cW, cH, tool]);

  useEffect(() => { draw(); }, [draw]);

  const loadImage = (files: FileList | null) => {
    if (!files?.[0]) return;
    const url = URL.createObjectURL(files[0]);
    setImgSrc(url);
    setOffset({ x: 0, y: 0 });
    setScale(1);
    setImgReady(false);
    const img = new window.Image();
    img.onload = () => { imgRef.current = img; setImgReady(true); };
    img.src = url;
  };

  const onMouseDown = (e: React.MouseEvent) => { setDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging) setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const onMouseUp = () => setDragging(false);
  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); setScale(s => Math.max(0.2, Math.min(5, s - e.deltaY * 0.001))); };

  const exportImage = useCallback(() => {
    if (!imgRef.current) return;
    const factor = tool.w / CANVAS_W;

    const out = document.createElement("canvas");
    out.width = tool.w;
    out.height = tool.h;
    const ctx = out.getContext("2d")!;

    const r = tool.w / tool.h;
    let baseW = CANVAS_W, baseH = CANVAS_W / r;
    if (activeTool === "profile") { baseW = CANVAS_W; baseH = CANVAS_W; }

    const sW = baseW * scale * factor;
    const sH = baseH * scale * factor;
    const x = (tool.w - sW) / 2 + offset.x * factor;
    const y = (tool.h - sH) / 2 + offset.y * factor;

    ctx.save();
    if (activeTool === "profile") {
      ctx.beginPath();
      ctx.arc(tool.w / 2, tool.h / 2, tool.w / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(imgRef.current, x, y, sW, sH);
    ctx.restore();

    out.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `youtube-${activeTool}.png`;
      a.click();
    }, "image/png");
  }, [activeTool, tool, offset, scale]);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Header />
      <main style={{ paddingTop: 88, paddingBottom: 64 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={14} />
            <span>Social Media</span>
            <ChevronRight size={14} />
            <span style={{ color: "var(--text)", fontWeight: 600 }}>YouTube</span>
          </div>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ width: 60, height: 60, borderRadius: 20, background: "linear-gradient(135deg, #ff0000, #cc0000)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(255,0,0,0.35)" }}>▶️</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>YouTube Tools</h1>
            <p style={{ color: "var(--text-muted)" }}>Live preview — see exactly how your channel will look</p>
          </div>

          {/* Tool tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 40, justifyContent: "center", flexWrap: "wrap" }}>
            {toolTabs.map(t => (
              <button key={t.id} onClick={() => { setActiveTool(t.id); setOffset({ x: 0, y: 0 }); setScale(1); }}
                style={{ padding: "10px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s",
                  background: activeTool === t.id ? "linear-gradient(135deg, #ff0000, #cc0000)" : "rgba(255,255,255,0.06)",
                  color: activeTool === t.id ? "#fff" : "var(--text-muted)",
                  boxShadow: activeTool === t.id ? "0 6px 16px rgba(255,0,0,0.3)" : "none" }}>
                {t.label} <span style={{ opacity: 0.7, fontSize: 11 }}>({t.size})</span>
              </button>
            ))}
          </div>

          {/* Editor + mockup stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Top: editor row */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>
              {/* Canvas editor */}
              <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 24, padding: 24, width: CANVAS_W + 48 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Upload & Position</h3>
                {!imgSrc ? (
                  <div className="upload-zone" style={{ borderRadius: 16, padding: 40, textAlign: "center", cursor: "pointer", background: "var(--bg)" }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); loadImage(e.dataTransfer.files); }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #ff0000, #cc0000)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Upload size={22} style={{ color: "white" }} />
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 6 }}>Drop your image here</p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {activeTool === "banner" ? "Recommended: 2560×1440" : activeTool === "profile" ? "Recommended: 800×800" : "Recommended: 1280×720"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                      <canvas ref={canvasRef}
                        style={{ borderRadius: activeTool === "profile" ? "50%" : 8, cursor: dragging ? "grabbing" : "grab", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", display: "block" }}
                        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onWheel={onWheel} />
                    </div>
                    <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>🖱 Drag to reposition · Scroll to zoom</p>
                    {activeTool === "banner" && <p style={{ textAlign: "center", fontSize: 11, color: "#facc15", marginBottom: 12 }}>⚠ Dashed area = visible on all devices</p>}
                    <input type="range" min="0.2" max="5" step="0.05" value={scale}
                      onChange={e => setScale(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#ff0000", marginBottom: 12 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => fileRef.current?.click()} className="btn-secondary" style={{ flex: 1, padding: "10px", borderRadius: 12, fontSize: 13 }}>Change</button>
                      <button onClick={exportImage} style={{ flex: 2, padding: "10px", borderRadius: 12, fontSize: 13, background: "linear-gradient(135deg, #ff0000, #cc0000)", color: "white", border: "none", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Download size={14} /> Download {tool.size}
                      </button>
                    </div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => loadImage(e.target.files)} />
              </div>

              {/* Channel name / subscribers */}
              <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 20, padding: 20 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Customize preview</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input value={channelName} onChange={e => setChannelName(e.target.value)} placeholder="Channel name"
                    style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14 }} />
                  <input value={subscribers} onChange={e => setSubscribers(e.target.value)} placeholder="1.2K subscribers"
                    style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14 }} />
                </div>
                <div style={{ marginTop: 20, padding: 16, background: "rgba(255,0,0,0.06)", borderRadius: 12, border: "1px solid rgba(255,0,0,0.15)" }}>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                    <strong style={{ color: "var(--text)" }}>Tip:</strong> The download button exports at full {tool.size} resolution, perfectly matching what you see in the preview below.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom: full-width YouTube mockup */}
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, textAlign: "center" }}>Live Preview</h3>
              <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
                {/* YT top bar */}
                <div style={{ background: "#fff", padding: "8px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#ff0000", fontWeight: 900, fontSize: 20 }}>▶</span>
                    <span style={{ color: "#000", fontWeight: 900, fontSize: 18 }}>YouTube</span>
                  </div>
                  <div style={{ background: "#f0f0f0", borderRadius: 20, padding: "6px 24px", fontSize: 13, color: "#555" }}>Search</div>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0e0e0" }} />
                </div>

                {/* Banner */}
                <div style={{ width: "100%", background: "#1a1a1a", overflow: "hidden", position: "relative" }}>
                  {imgSrc && activeTool === "banner" ? (
                    <YTBannerPreview canvasRef={canvasRef} />
                  ) : (
                    <div style={{ height: 140, background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                        {activeTool === "banner" ? "Upload a banner to preview" : "Channel banner area"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Channel info */}
                <div style={{ padding: "0 24px 0" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 20, paddingTop: 0, paddingBottom: 16, borderBottom: "1px solid #e5e5e5" }}>
                    {/* Profile photo */}
                    <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#e0e0e0", border: "4px solid white", marginTop: -24, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                      {imgSrc && activeTool === "profile" ? (
                        <YTProfilePreview canvasRef={canvasRef} size={80} />
                      ) : (
                        <div style={{ width: 80, height: 80, background: "#ff0000", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 28 }}>
                          {channelName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 4 }}>
                      <p style={{ fontWeight: 800, color: "#000", fontSize: 20, marginBottom: 3 }}>{channelName}</p>
                      <p style={{ color: "#606060", fontSize: 13 }}>@{channelName.toLowerCase().replace(/\s+/g, "")} · {subscribers}</p>
                      <p style={{ color: "#606060", fontSize: 12, marginTop: 4 }}>Your channel description goes here · Videos · About</p>
                    </div>
                    <div style={{ paddingBottom: 8 }}>
                      <button style={{ padding: "10px 20px", background: "#000", color: "#fff", border: "none", borderRadius: 20, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Subscribe</button>
                    </div>
                  </div>

                  {/* Nav tabs */}
                  <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #e5e5e5" }}>
                    {["Home", "Videos", "Shorts", "Playlists", "Posts"].map((tab, i) => (
                      <span key={tab} style={{ fontSize: 14, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#000" : "#606060", padding: "14px 16px 12px", borderBottom: i === 0 ? "2px solid #000" : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>{tab}</span>
                    ))}
                  </div>
                </div>

                {/* Thumbnails grid */}
                <div style={{ padding: "20px 24px 24px" }}>
                  <p style={{ fontWeight: 700, color: "#000", marginBottom: 16, fontSize: 15 }}>For you</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        {imgSrc && activeTool === "thumbnail" && i === 0 ? (
                          <YTThumbnailPreview canvasRef={canvasRef} />
                        ) : (
                          <div style={{ aspectRatio: "16/9", background: `hsl(${i * 50 + 200}, 15%, 88%)`, borderRadius: 8 }} />
                        )}
                        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${i * 50 + 200}, 40%, 70%)`, flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 13, color: "#000", fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>Video title #{i + 1} — watch now</p>
                            <p style={{ fontSize: 12, color: "#606060" }}>{channelName}</p>
                            <p style={{ fontSize: 11, color: "#606060" }}>12K views · 3 days ago</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function YTBannerPreview({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const src = canvasRef.current; const dst = ref.current;
    if (!src || !dst) return;
    dst.width = 1100; dst.height = 140;
    const ctx = dst.getContext("2d")!;
    ctx.drawImage(src, 0, 0, 1100, 140);
  });
  return <canvas ref={ref} style={{ width: "100%", height: 140, display: "block" }} />;
}

function YTProfilePreview({ canvasRef, size }: { canvasRef: React.RefObject<HTMLCanvasElement | null>; size: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const src = canvasRef.current; const dst = ref.current;
    if (!src || !dst) return;
    dst.width = size; dst.height = size;
    const ctx = dst.getContext("2d")!;
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(src, 0, 0, size, size);
  });
  return <canvas ref={ref} width={size} height={size} style={{ display: "block" }} />;
}

function YTThumbnailPreview({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const src = canvasRef.current; const dst = ref.current;
    if (!src || !dst) return;
    dst.width = 320; dst.height = 180;
    const ctx = dst.getContext("2d")!;
    ctx.drawImage(src, 0, 0, 320, 180);
  });
  return <canvas ref={ref} style={{ width: "100%", aspectRatio: "16/9", display: "block", borderRadius: 8 }} />;
}
