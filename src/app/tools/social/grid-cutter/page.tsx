"use client";
import { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Download, Upload, Grid } from "lucide-react";

type GridConfig = { cols: number; rows: number; label: string };
const GRIDS: GridConfig[] = [
  { cols: 3, rows: 3, label: "3×3 (9 posts)" },
  { cols: 3, rows: 4, label: "3×4 (12 posts)" },
  { cols: 3, rows: 5, label: "3×5 (15 posts)" },
];

interface Tile { url: string; index: number; col: number; row: number; }

export default function GridCutter() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [grid, setGrid] = useState<GridConfig>(GRIDS[0]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [cutting, setCutting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = (files: FileList | null) => {
    if (!files?.[0]) return;
    setImageUrl(URL.createObjectURL(files[0]));
    setTiles([]);
  };

  const cutGrid = useCallback(async () => {
    if (!imageUrl) return;
    setCutting(true);
    setTiles([]);

    const img = new window.Image();
    await new Promise<void>(resolve => {
      img.onload = async () => {
        const { cols, rows } = grid;
        const tileW = Math.floor(img.naturalWidth / cols);
        const tileH = Math.floor(img.naturalHeight / rows);
        const result: Tile[] = [];
        let idx = 0;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const canvas = document.createElement("canvas");
            canvas.width = tileW;
            canvas.height = tileH;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, c * tileW, r * tileH, tileW, tileH, 0, 0, tileW, tileH);
            await new Promise<void>(res => {
              canvas.toBlob(blob => {
                if (blob) result.push({ url: URL.createObjectURL(blob), index: idx++, col: c, row: r });
                res();
              }, "image/jpeg", 0.92);
            });
          }
        }
        setTiles(result);
        resolve();
      };
      img.src = imageUrl;
    });

    setCutting(false);
  }, [imageUrl, grid]);

  const downloadAll = () => {
    tiles.forEach((t, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = t.url;
        a.download = `grid_${t.row + 1}_${t.col + 1}.jpg`;
        a.click();
      }, i * 150);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #ec4899, #f97316)" }}>
              <Grid size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">Instagram Grid Cutter</h1>
            <p style={{ color: "var(--text-muted)" }}>Split one image into a perfect Instagram feed grid</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(236,72,153,0.15)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)" }}>
              🔥 Going viral on Instagram
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div
                className="upload-zone rounded-2xl p-8 text-center cursor-pointer"
                style={{ background: "var(--bg-2)" }}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); loadFile(e.dataTransfer.files); }}
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="Source" className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }} />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-float" style={{ background: "linear-gradient(135deg, #ec4899, #f97316)" }}>
                      <Upload size={20} className="text-white" />
                    </div>
                    <p className="font-semibold">Drop your image here</p>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>Best with square or wide images</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => loadFile(e.target.files)} />
              </div>

              <div className="glass rounded-2xl p-5 space-y-3">
                <h3 className="font-semibold">Grid size</h3>
                <div className="space-y-2">
                  {GRIDS.map(g => (
                    <button key={g.label} onClick={() => { setGrid(g); setTiles([]); }}
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-left transition-all"
                      style={{
                        background: grid.label === g.label ? "linear-gradient(135deg, #8b5cf6, #ec4899)" : "rgba(139,92,246,0.08)",
                        color: grid.label === g.label ? "white" : "#a78bfa",
                        border: `1px solid ${grid.label === g.label ? "transparent" : "rgba(139,92,246,0.2)"}`,
                      }}>
                      ⊞ {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {imageUrl && (
                <button onClick={cutGrid} disabled={cutting}
                  className="btn-primary w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2">
                  {cutting ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Cutting...</> : <><Grid size={18} /> Cut into {grid.cols * grid.rows} tiles</>}
                </button>
              )}
            </div>

            <div>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Preview & Export</h3>
                  {tiles.length > 0 && (
                    <button onClick={downloadAll} className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                      <Download size={14} /> Download all
                    </button>
                  )}
                </div>

                {tiles.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}>
                      {tiles.map((t) => (
                        <div key={t.index} className="relative group aspect-square rounded-sm overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.url} alt={`tile ${t.index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <a href={t.url} download={`grid_${t.row + 1}_${t.col + 1}.jpg`}
                              className="opacity-0 group-hover:opacity-100 transition-all btn-primary p-2 rounded-lg">
                              <Download size={14} />
                            </a>
                          </div>
                          <div className="absolute bottom-1 left-1 text-xs font-bold px-1 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
                            {t.row + 1},{t.col + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                      Post in reverse order (bottom-right to top-left) for feed effect
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-xl" style={{ background: "var(--bg)", minHeight: 200 }}>
                    <div className="text-center" style={{ color: "var(--text-muted)" }}>
                      <div className="text-5xl mb-3">⊞</div>
                      <p className="text-sm">Grid preview here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
