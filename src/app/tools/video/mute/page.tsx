"use client";
import { useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, VolumeX, Download } from "lucide-react";

export default function MuteVideo() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadVideo = (files: FileList | null) => {
    if (!files?.[0]) return;
    setVideoFile(files[0]);
    setVideoUrl(URL.createObjectURL(files[0]));
    setResult(null);
  };

  const muteVideo = useCallback(async () => {
    if (!videoFile || !videoUrl) return;
    setProcessing(true);
    try {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.muted = true;
      await new Promise<void>(r => { video.onloadedmetadata = () => r(); });

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      recorder.start(100);
      video.play();

      await new Promise<void>(resolve => {
        const draw = () => {
          if (video.ended || video.paused) { recorder.stop(); return; }
          ctx.drawImage(video, 0, 0);
          requestAnimationFrame(draw);
        };
        video.onended = () => { recorder.stop(); };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          setResult(URL.createObjectURL(blob));
          resolve();
        };
        draw();
      });
    } catch (e) { console.error(e); }
    setProcessing(false);
  }, [videoFile, videoUrl]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              <VolumeX size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">Mute Video</h1>
            <p style={{ color: "var(--text-muted)" }}>Remove audio track from any video instantly</p>
          </div>

          <div className="upload-zone rounded-2xl p-8 text-center cursor-pointer mb-6" style={{ background: "var(--bg-2)" }}
            onClick={() => !videoUrl && fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); loadVideo(e.dataTransfer.files); }}>
            {videoUrl ? (
              <video src={videoUrl} className="w-full rounded-xl" controls style={{ maxHeight: 300 }} />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-float" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
                  <Upload size={20} className="text-white" />
                </div>
                <p className="font-semibold">Drop a video file</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={e => loadVideo(e.target.files)} />
          </div>

          {videoUrl && !result && (
            <button onClick={muteVideo} disabled={processing}
              className="btn-primary w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2">
              {processing ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing (plays in real time)...</> : <><VolumeX size={18} /> Remove Audio</>}
            </button>
          )}

          {result && (
            <div className="glass rounded-2xl p-5 space-y-4">
              <h2 className="font-bold">Muted video ready</h2>
              <video src={result} className="w-full rounded-xl" controls />
              <a href={result} download="muted-video.webm" className="btn-primary w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
                <Download size={18} /> Download Muted Video
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
