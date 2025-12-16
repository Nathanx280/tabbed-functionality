import { useCallback, useState } from "react";
import { Upload, Music, FileAudio } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioDropzoneProps {
  onFileAccepted: (file: File) => void;
  className?: string;
}

export const AudioDropzone = ({ onFileAccepted, className }: AudioDropzoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("audio/")) {
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  return (
    <label
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300",
        isDragOver
          ? "border-primary bg-primary/10 neon-glow"
          : "border-border hover:border-primary/50 hover:bg-secondary/30",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileInput}
      />
      
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          {isDragOver ? (
            <FileAudio className="w-10 h-10 text-primary animate-pulse" />
          ) : (
            <Music className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Upload className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold">
          {isDragOver ? "Drop your audio file" : "Drop audio here or click to upload"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Supports MP3, WAV, FLAC, AAC, OGG
        </p>
      </div>
    </label>
  );
};
