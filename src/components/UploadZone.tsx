"use client";
import { useCallback, useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
}

export default function UploadZone({ onFiles, accept, multiple = false, label = "Drop your file here", sublabel = "or click to browse" }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);
    setFiles(arr);
    onFiles(arr);
  }, [onFiles]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (i: number) => {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onFiles(next);
  };

  return (
    <div className="space-y-3">
      <div
        className={`upload-zone rounded-2xl p-10 text-center cursor-pointer ${dragging ? "dragging" : ""}`}
        style={{ background: "var(--bg-2)" }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-float" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
            <Upload size={24} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-lg">{label}</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{sublabel}</p>
          </div>
          <p className="text-xs px-4 py-1.5 rounded-full" style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
            Files are processed locally — never uploaded to any server
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
                <File size={14} style={{ color: "#a78bfa" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{(f.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={e => { e.stopPropagation(); removeFile(i); }} className="p-1 rounded-lg transition-colors hover:bg-red-500/20">
                <X size={14} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
