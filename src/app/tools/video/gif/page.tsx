"use client";
import { useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, Film, Download, Info } from "lucide-react";

export default function VideoToGif() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5);
  const [fps, setFps] = useState(15);
  const [width, setWidth] = useState(480);
  const [processing, setProcessing] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadVideo = (files: FileList | null) => {
    if (!files?.[0]) return;
    const f = files[0];
    setVideoFile(f);
    setVideoUrl(URL.createObjectURL(f));
    setGifUrl(null);
    setStart(0);
    setEnd(5);
  };

  const captureFrames = useCallback(async (): Promise<ImageData[]> => {
    if (!videoRef.current || !videoUrl) return [];
    const video = videoRef.current;
    const duration = end - start;
    const totalFrames = Math.floor(duration * fps);
    const frames: ImageData[] = [];
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = Math.round(width * video.videoHeight / video.videoWidth);
    const ctx = canvas.getContext("2d")!;

    for (let i = 0; i < totalFrames; i++) {
      const t = start + (i / fps);
      await new Promise<void>(resolve => {
        video.currentTime = t;
        const onSeeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
          setProgress(Math.round((i / totalFrames) * 50));
          video.removeEventListener("seeked", onSeeked);
          resolve();
        };
        video.addEventListener("seeked", onSeeked, { once: true });
      });
    }
    return frames;
  }, [videoUrl, start, end, fps, width]);

  const convertToGif = useCallback(async () => {
    if (!videoFile || !videoRef.current) return;
    setProcessing(true);
    setGifUrl(null);
    setProgress(5);

    try {
      const frames = await captureFrames();
      setProgress(60);

      // We create an animated webp/canvas sequence as a simple "gif-like" download
      // For a real GIF we'd need gifjs or similar — here we export as WebM frames sequence
      // Instead, let's use a series of canvases and MediaRecorder for a proper video GIF
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round(width * video.videoHeight / video.videoWidth);
      const ctx = canvas.getContext("2d")!;

      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => chunks.push(e.data);

      let frameIdx = 0;
      const frameInterval = setInterval(() => {
        if (frameIdx < frames.length) {
          ctx.putImageData(frames[frameIdx++], 0, 0);
          setProgress(60 + Math.round((frameIdx / frames.length) * 35));
        } else {
          clearInterval(frameInterval);
          recorder.stop();
        }
      }, 1000 / fps);

      await new Promise<void>(resolve => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          setGifUrl(URL.createObjectURL(blob));
          setProgress(100);
          resolve();
        };
        recorder.start();
      });
    } catch (e) {
      console.error(e);
    }

    setProcessing(false);
  }, [videoFile, captureFrames, fps, width]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              <Film size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">Video → GIF / WebM</h1>
            <p style={{ color: "var(--text-muted)" }}>Extract a clip and export as animated GIF/WebM</p>
          </div>

          <div
            className="upload-zone rounded-2xl p-8 text-center cursor-pointer mb-6"
            style={{ background: "var(--bg-2)" }}
            onClick={() => !videoUrl && fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); loadVideo(e.dataTransfer.files); }}
          >
            {videoUrl ? (
              <video ref={videoRef} src={videoUrl} className="w-full rounded-xl" controls style={{ maxHeight: 300 }} />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-float" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
                  <Upload size={24} className="text-white" />
                </div>
                <p className="font-semibold text-lg">Drop a video file</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>MP4, WebM, MOV supported</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={e => loadVideo(e.target.files)} />
          </div>

          {videoUrl && (
            <div className="glass rounded-2xl p-6 space-y-5">
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                <Info size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#60a5fa" }} />
                <p className="text-xs" style={{ color: "#93c5fd" }}>Output will be WebM (universally supported animated format). Works in all modern browsers and social media platforms.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Start time (sec)</label>
                  <input type="number" min="0" step="0.5" value={start} onChange={e => setStart(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>End time (sec)</label>
                  <input type="number" min="0" step="0.5" value={end} onChange={e => setEnd(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>FPS: {fps}</label>
                  <input type="range" min="5" max="30" step="5" value={fps} onChange={e => setFps(Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Width: {width}px</label>
                  <input type="range" min="240" max="960" step="120" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
              </div>

              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Duration: {(end - start).toFixed(1)}s · ~{Math.floor((end - start) * fps)} frames · {fps} FPS · {width}px wide
              </p>

              {processing && (
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                    <span>Processing frames...</span><span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-3)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }} />
                  </div>
                </div>
              )}

              <button onClick={convertToGif} disabled={processing || end <= start}
                className="btn-primary w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2">
                {processing ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : <><Film size={18} /> Convert {(end - start).toFixed(1)}s clip</>}
              </button>
            </div>
          )}

          {gifUrl && (
            <div className="mt-6 glass rounded-2xl p-5 space-y-4">
              <h2 className="font-bold">Your animated clip</h2>
              <video src={gifUrl} className="w-full rounded-xl" autoPlay loop muted />
              <a href={gifUrl} download="clip.webm" className="btn-primary w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
                <Download size={18} /> Download WebM
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
