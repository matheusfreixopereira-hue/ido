export type ToolCategory = "image" | "video" | "audio" | "social";

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  category: ToolCategory;
  icon: string;
  badge?: string;
  popular?: boolean;
}

export const tools: Tool[] = [
  // Image
  { id: "img-convert", name: "Convert Image", description: "JPG, PNG, WEBP, AVIF and more", href: "/tools/image/convert", category: "image", icon: "🖼️", popular: true },
  { id: "img-compress", name: "Compress Image", description: "Reduce file size without quality loss", href: "/tools/image/compress", category: "image", icon: "🗜️" },
  { id: "img-resize", name: "Resize Image", description: "Custom dimensions in seconds", href: "/tools/image/resize", category: "image", icon: "↔️" },
  // Social
  { id: "social-resize", name: "Social Media Resizer", description: "Perfect sizes for every platform", href: "/tools/social/resize", category: "social", icon: "📱", popular: true, badge: "HOT" },
  { id: "grid-cutter", name: "Instagram Grid Cutter", description: "Split image into 3x3, 3x4, 3x5 grids", href: "/tools/social/grid-cutter", category: "social", icon: "⊞", badge: "VIRAL" },
  // Video
  { id: "video-gif", name: "Video to GIF", description: "Convert clips to animated GIFs", href: "/tools/video/gif", category: "video", icon: "🎬", popular: true },
  { id: "video-mute", name: "Mute Video", description: "Remove audio from any video", href: "/tools/video/mute", category: "video", icon: "🔇" },
  // Audio
  { id: "audio-convert", name: "Convert Audio", description: "MP3, WAV, OGG and more", href: "/tools/audio/convert", category: "audio", icon: "🎵" },
];

export const categories = [
  { id: "image", label: "Images", emoji: "🖼️" },
  { id: "social", label: "Social Media", emoji: "📱" },
  { id: "video", label: "Video", emoji: "🎬" },
  { id: "audio", label: "Audio", emoji: "🎵" },
] as const;

export const socialPresets = [
  { platform: "Instagram", type: "Post", width: 1080, height: 1080, icon: "📷", color: "#E1306C" },
  { platform: "Instagram", type: "Story", width: 1080, height: 1920, icon: "📷", color: "#E1306C" },
  { platform: "Instagram", type: "Profile", width: 320, height: 320, icon: "📷", color: "#E1306C" },
  { platform: "YouTube", type: "Thumbnail", width: 1280, height: 720, icon: "▶️", color: "#FF0000" },
  { platform: "YouTube", type: "Banner", width: 2560, height: 1440, icon: "▶️", color: "#FF0000" },
  { platform: "TikTok", type: "Video", width: 1080, height: 1920, icon: "🎵", color: "#000000" },
  { platform: "Facebook", type: "Cover", width: 820, height: 312, icon: "👥", color: "#1877F2" },
  { platform: "Facebook", type: "Post", width: 1200, height: 630, icon: "👥", color: "#1877F2" },
  { platform: "Twitter/X", type: "Post", width: 1200, height: 675, icon: "𝕏", color: "#000000" },
  { platform: "LinkedIn", type: "Post", width: 1200, height: 627, icon: "💼", color: "#0A66C2" },
];
