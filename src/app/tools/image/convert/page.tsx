"use client";
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadZone from "@/components/UploadZone";
import { Download, Settings2, Image as ImageIcon } from "lucide-react";

const formats = ["webp", "jpeg", "png", "avif", "gif", "bmp"];
const qualityOptions = [100, 90, 80, 70, 60, 50];

interface ConvertedFile { name: string; url: string; size: string; format: string; }

export default function ImageConvert() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(90);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [converting, setConverting] = useState(false);

  const convert = useCallback(async () => {
    if (!files.length) return;
    setConverting(true);
    setResults([]);
    const converted: ConvertedFile[] = [];

    for (const file of files) {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>(resolve => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          if (format === "jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
          ctx.drawImage(img, 0, 0);
          const mime = format === "jpg" ? "image/jpeg" : `image/${format}`;
          canvas.toBlob(blob => {
            if (!blob) { resolve(); return; }
            const outUrl = URL.createObjectURL(blob);
            const ext = format === "jpeg" ? "jpg" : format;
            const baseName = file.name.replace(/\.[^.]+$/, "");
            converted.push({ name: `${baseName}.${ext}`, url: outUrl, size: `${(blob.size / 1024).toFixed(1)} KB`, format: format.toUpperCase() });
            resolve();
          }, mime, quality / 100);
          URL.revokeObjectURL(url);
        };
        img.src = url;
      });
    }

    setResults(converted);
    setConverting(false);
  }, [files, format, quality]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              <ImageIcon size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">Image Converter</h1>
            <p style={{ color: "var(--text-muted)" }}>Convert images to any format instantly in your browser</p>
          </div>

          <UploadZone
            onFiles={setFiles}
            accept="image/*"
            multiple
            label="Drop images here"
            sublabel="JPG, PNG, WEBP, AVIF, GIF — up to 50MB each"
          />

          {files.length > 0 && (
            <div className="mt-6 glass rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 size={16} style={{ color: "#a78bfa" }} />
                <span className="font-semibold">Conversion Settings</span>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: "var(--text-muted)" }}>Output Format</label>
                <div className="flex flex-wrap gap-2">
                  {formats.map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all uppercase"
                      style={{ background: format === f ? "linear-gradient(135deg, #8b5cf6, #ec4899)" : "rgba(139,92,246,0.1)", color: format === f ? "white" : "#a78bfa", border: `1px solid ${format === f ? "transparent" : "rgba(139,92,246,0.2)"}` }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: "var(--text-muted)" }}>Quality: {quality}%</label>
                <input type="range" min="10" max="100" step="5" value={quality} onChange={e => setQuality(Number(e.target.value))}
                  className="w-full accent-purple-500" />
              </div>

              <button onClick={convert} disabled={converting}
                className="btn-primary w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2">
                {converting ? (
                  <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Converting...</>
                ) : (
                  <><ImageIcon size={18} /> Convert {files.length} {files.length === 1 ? "image" : "images"}</>
                )}
              </button>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6 space-y-3">
              <h2 className="font-bold text-lg">Ready to download</h2>
              {results.map((r, i) => (
                <div key={i} className="glass rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "white" }}>
                    {r.format}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{r.name}</p>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>{r.size}</p>
                  </div>
                  <a href={r.url} download={r.name}
                    className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                    <Download size={14} /> Download
                  </a>
                </div>
              ))}
              {results.length > 1 && (
                <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  Tip: Right-click each file to save, or download them one by one.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
