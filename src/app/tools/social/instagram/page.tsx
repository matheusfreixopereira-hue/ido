"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, Download, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Tool = "profile" | "post" | "story";

const toolTabs: { id: Tool; label: string; size: string; w: number; h: number }[] = [
  { id: "profile", label: "Profile Photo", size: "320 × 320", w: 320, h: 320 },
  { id: "post",    label: "Post",          size: "1080 × 1080", w: 1080, h: 1080 },
  { id: "story",   label: "Story / Reels", size: "1080 × 1920", w: 1080, h: 1920 },
];

export default function InstagramPage() {
  const [activeTool, setActiveTool] = useState<Tool>("profile");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [username, setUsername] = useState("your.username");
  const [bio, setBio] = useState("Your bio here 🌟");
  const [result, setResult] = useState<string | null>(null);
  const [imgReady, setImgReady] = useState(false);

  const previewRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const CANVAS_SIZE = 280;

  const draw = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (!imgRef.current) {
      ctx.fillStyle = "#e0e0e0";
      ctx.beginPath();
      ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#999";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Upload photo", CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      return;
    }

    const img = imgRef.current;
    const tool = toolTabs.find(t => t.id === activeTool)!;
    const ratio = tool.w / tool.h;

    let baseW: number, baseH: number;
    if (ratio >= 1) { baseW = CANVAS_SIZE; baseH = CANVAS_SIZE / ratio; }
    else { baseH = CANVAS_SIZE; baseW = CANVAS_SIZE * ratio; }

    const scaledW = baseW * scale;
    const scaledH = baseH * scale;
    const x = (CANVAS_SIZE - scaledW) / 2 + offset.x;
    const y = (CANVAS_SIZE - scaledH) / 2 + offset.y;

    // Clip to circle for profile, rect for others
    ctx.save();
    if (activeTool === "profile") {
      ctx.beginPath();
      ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0, Math.PI * 2);
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.roundRect(0, 0, CANVAS_SIZE, CANVAS_SIZE, 4);
      ctx.clip();
    }

    ctx.drawImage(img, x, y, scaledW, scaledH);
    ctx.restore();

    // Circle border for profile
    if (activeTool === "profile") {
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 1, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [imgReady, offset, scale, activeTool]);

  useEffect(() => { draw(); }, [draw]);

  const loadImage = (files: FileList | null) => {
    if (!files?.[0]) return;
    const url = URL.createObjectURL(files[0]);
    setImgSrc(url);
    setOffset({ x: 0, y: 0 });
    setScale(1);
    setResult(null);
    setImgReady(false);
    const img = new window.Image();
    img.onload = () => { imgRef.current = img; setImgReady(true); };
    img.src = url;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setDragging(false);
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.max(0.3, Math.min(4, s - e.deltaY * 0.001)));
  };

  const exportImage = useCallback(() => {
    if (!imgRef.current) return;
    const tool = toolTabs.find(t => t.id === activeTool)!;
    const canvas = document.createElement("canvas");
    canvas.width = tool.w; canvas.height = tool.h;
    const ctx = canvas.getContext("2d")!;
    const ratio = CANVAS_SIZE / tool.w;

    if (activeTool === "profile") {
      ctx.beginPath();
      ctx.arc(tool.w / 2, tool.h / 2, tool.w / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    const scaledW = (tool.w * scale) / ratio / CANVAS_SIZE * tool.w;
    const scaledH = (tool.h * scale) / ratio / CANVAS_SIZE * tool.h;
    const x = (tool.w - scaledW) / 2 + (offset.x / ratio);
    const y = (tool.h - scaledH) / 2 + (offset.y / ratio);
    ctx.drawImage(imgRef.current, x / (tool.w / CANVAS_SIZE), y / (tool.h / CANVAS_SIZE), scaledW / (tool.w / CANVAS_SIZE) * (tool.w / CANVAS_SIZE), scaledH / (tool.h / CANVAS_SIZE) * (tool.w / CANVAS_SIZE));

    // simpler: just use preview canvas scaled up
    const src = previewRef.current!;
    const bigCanvas = document.createElement("canvas");
    bigCanvas.width = tool.w; bigCanvas.height = tool.h;
    const bCtx = bigCanvas.getContext("2d")!;
    if (activeTool === "profile") {
      bCtx.beginPath();
      bCtx.arc(tool.w / 2, tool.h / 2, tool.w / 2, 0, Math.PI * 2);
      bCtx.clip();
    }
    bCtx.drawImage(src, 0, 0, tool.w, tool.h);
    bigCanvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `instagram-${activeTool}.png`;
      a.click();
    }, "image/png");
  }, [activeTool, offset, scale]);

  const tool = toolTabs.find(t => t.id === activeTool)!;

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Header />
      <main style={{ paddingTop: 88, paddingBottom: 64, minHeight: "100vh" }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={14} />
            <span>Social Media</span>
            <ChevronRight size={14} />
            <span style={{ color: "var(--text)", fontWeight: 600 }}>Instagram</span>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ width: 60, height: 60, borderRadius: 20, background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(131,58,180,0.4)" }}>
              📸
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Instagram Tools</h1>
            <p style={{ color: "var(--text-muted)" }}>Live preview — see exactly how it will look on your profile</p>
          </div>

          {/* Tool tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 40, justifyContent: "center", flexWrap: "wrap" }}>
            {toolTabs.map(t => (
              <button key={t.id} onClick={() => { setActiveTool(t.id); setOffset({ x: 0, y: 0 }); setScale(1); setResult(null); }}
                style={{ padding: "10px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s",
                  background: activeTool === t.id ? "linear-gradient(135deg, #833ab4, #fd1d1d)" : "rgba(255,255,255,0.06)",
                  color: activeTool === t.id ? "#fff" : "var(--text-muted)",
                  boxShadow: activeTool === t.id ? "0 6px 16px rgba(131,58,180,0.35)" : "none" }}>
                {t.label} <span style={{ opacity: 0.7, fontSize: 11 }}>({t.size})</span>
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            {/* Left: Editor */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 24, padding: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
                  {activeTool === "profile" ? "Upload & Position" : "Upload Image"}
                </h3>

                {!imgSrc ? (
                  <div className="upload-zone" style={{ borderRadius: 16, padding: 40, textAlign: "center", cursor: "pointer", background: "var(--bg)" }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); loadImage(e.dataTransfer.files); }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #833ab4, #fd1d1d)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Upload size={22} className="text-white" style={{ color: "white" }} />
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 6 }}>Drop your photo here</p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>JPG, PNG, WEBP</p>
                  </div>
                ) : (
                  <div>
                    {/* Canvas editor */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                      <div style={{ position: "relative" }}>
                        <canvas ref={previewRef} width={CANVAS_SIZE} height={CANVAS_SIZE}
                          style={{ borderRadius: activeTool === "profile" ? "50%" : 8, cursor: dragging ? "grabbing" : "grab", display: "block", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
                          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
                          onWheel={onWheel} />
                        {activeTool === "profile" && (
                          <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "3px solid transparent", background: "linear-gradient(#000,#000) padding-box, linear-gradient(135deg,#833ab4,#fcb045) border-box", pointerEvents: "none" }} />
                        )}
                      </div>
                    </div>
                    <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
                      🖱 Drag to reposition · Scroll to zoom
                    </p>
                    <input type="range" min="0.3" max="4" step="0.05" value={scale}
                      onChange={e => setScale(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#833ab4", marginBottom: 12 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => fileRef.current?.click()} className="btn-secondary" style={{ flex: 1, padding: "10px", borderRadius: 12, fontSize: 13 }}>Change photo</button>
                      <button onClick={exportImage} className="btn-primary" style={{ flex: 2, padding: "10px", borderRadius: 12, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Download size={14} /> Download {tool.size}
                      </button>
                    </div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" style={{ display: "none" }} onChange={e => loadImage(e.target.files)} />
              </div>

              {/* Username/bio for profile */}
              {activeTool === "profile" && (
                <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 20, padding: 20 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Customize preview</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder="your.username"
                      style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14 }} />
                    <input value={bio} onChange={e => setBio(e.target.value)} placeholder="Your bio..."
                      style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14 }} />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Preview */}
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, textAlign: "center" }}>
                Live Preview
              </h3>

              {activeTool === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Instagram profile mockup */}
                  <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
                    {/* IG header */}
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 22, color: "#000", fontFamily: "'Billabong', cursive", fontWeight: 400 }}>Instagram</span>
                      <div style={{ display: "flex", gap: 16, color: "#000" }}>
                        <span style={{ fontSize: 20 }}>+</span>
                        <span style={{ fontSize: 20 }}>☰</span>
                      </div>
                    </div>
                    {/* Profile section */}
                    <div style={{ padding: "20px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                        {/* Profile photo */}
                        <ProfileCircle canvasRef={previewRef} size={80} hasImage={!!imgSrc} />
                        {/* Stats */}
                        <div style={{ display: "flex", gap: 20 }}>
                          {[["0", "Posts"], ["128", "Followers"], ["96", "Following"]].map(([n, l]) => (
                            <div key={l} style={{ textAlign: "center" }}>
                              <p style={{ fontWeight: 700, color: "#000", fontSize: 16 }}>{n}</p>
                              <p style={{ color: "#000", fontSize: 12 }}>{l}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p style={{ fontWeight: 700, color: "#000", fontSize: 14, marginBottom: 4 }}>{username}</p>
                      <p style={{ color: "#000", fontSize: 13, marginBottom: 12 }}>{bio}</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ flex: 1, padding: "7px 0", background: "#efefef", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#000" }}>Edit profile</button>
                        <button style={{ flex: 1, padding: "7px 0", background: "#efefef", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#000" }}>Archive</button>
                      </div>
                    </div>
                    {/* Highlights placeholder */}
                    <div style={{ padding: "8px 16px 12px", display: "flex", gap: 16, overflowX: "auto" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 22 }}>+</div>
                        <span style={{ fontSize: 11, color: "#000" }}>New</span>
                      </div>
                    </div>
                    {/* Grid placeholder */}
                    <div style={{ borderTop: "1px solid #efefef", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, padding: 2 }}>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{ aspectRatio: "1", background: "#f0f0f0" }} />
                      ))}
                    </div>
                  </div>

                  {/* Mini previews */}
                  <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 20, padding: 20 }}>
                    <p style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>How it looks in other places</p>
                    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ textAlign: "center" }}>
                        <ProfileCircle canvasRef={previewRef} size={56} hasImage={!!imgSrc} />
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Profile</p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <ProfileCircle canvasRef={previewRef} size={32} hasImage={!!imgSrc} />
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Comment</p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <ProfileCircle canvasRef={previewRef} size={24} hasImage={!!imgSrc} />
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Notification</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTool === "post" && (
                <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.4)", maxWidth: 380, margin: "0 auto" }}>
                  {/* Post header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #833ab4, #fcb045)" }} />
                    <span style={{ fontWeight: 600, fontSize: 13, color: "#000" }}>{username}</span>
                  </div>
                  {/* Post image */}
                  <PostImagePreview canvasRef={previewRef} hasImage={!!imgSrc} ratio={1} />
                  {/* Actions */}
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 14, marginBottom: 8, fontSize: 22 }}>
                      <span>🤍</span><span>💬</span><span>📤</span>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#000" }}>128 likes</p>
                    <p style={{ fontSize: 13, color: "#000" }}><strong>{username}</strong> {bio}</p>
                  </div>
                </div>
              )}

              {activeTool === "story" && (
                <div style={{ maxWidth: 220, margin: "0 auto" }}>
                  <div style={{ background: "#000", borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.6)", aspectRatio: "9/16", position: "relative" }}>
                    <PostImagePreview canvasRef={previewRef} hasImage={!!imgSrc} ratio={9 / 16} fill />
                    {/* Story UI overlay */}
                    <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", gap: 4 }}>
                      <div style={{ flex: 1, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.6)" }} />
                    </div>
                    <div style={{ position: "absolute", top: 20, left: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid white", background: "linear-gradient(135deg, #833ab4, #fcb045)" }} />
                      <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>{username}</span>
                    </div>
                  </div>
                  <p style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>Story preview (9:16)</p>
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

function ProfileCircle({ canvasRef, size, hasImage }: { canvasRef: React.RefObject<HTMLCanvasElement | null>; size: number; hasImage: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const src = canvasRef.current;
    const dst = ref.current;
    if (!src || !dst) return;
    const ctx = dst.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    if (hasImage) ctx.drawImage(src, 0, 0, size, size);
    else { ctx.fillStyle = "#e0e0e0"; ctx.fill(); }
    ctx.restore();
  });

  return (
    <canvas ref={ref} width={size} height={size}
      style={{ borderRadius: "50%", display: "block", border: "2px solid rgba(255,255,255,0.2)" }} />
  );
}

function PostImagePreview({ canvasRef, hasImage, ratio, fill }: { canvasRef: React.RefObject<HTMLCanvasElement | null>; hasImage: boolean; ratio: number; fill?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const W = 380;
  const H = fill ? W / ratio : W;

  useEffect(() => {
    const src = canvasRef.current;
    const dst = ref.current;
    if (!src || !dst) return;
    const ctx = dst.getContext("2d")!;
    ctx.clearRect(0, 0, W, H);
    if (hasImage) ctx.drawImage(src, 0, 0, W, H);
    else { ctx.fillStyle = "#f0f0f0"; ctx.fillRect(0, 0, W, H); }
  });

  return <canvas ref={ref} width={W} height={H} style={{ display: "block", width: "100%", height: "auto" }} />;
}
