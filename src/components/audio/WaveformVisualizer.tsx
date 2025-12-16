import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface WaveformVisualizerProps {
  data: number[];
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  className?: string;
  color?: "primary" | "accent" | "cyan";
}

export const WaveformVisualizer = ({
  data,
  currentTime,
  duration,
  onSeek,
  className,
  color = "primary",
}: WaveformVisualizerProps) => {
  const progress = duration > 0 ? currentTime / duration : 0;

  const colorClasses = {
    primary: "bg-primary",
    accent: "bg-accent",
    cyan: "bg-neon-cyan",
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    onSeek(percent * duration);
  };

  const bars = useMemo(() => {
    if (data.length === 0) {
      return Array.from({ length: 100 }, (_, i) => ({
        height: Math.random() * 30 + 10,
        index: i,
      }));
    }
    return data.map((value, index) => ({
      height: Math.max(value * 60, 4),
      index,
    }));
  }, [data]);

  return (
    <div
      className={cn(
        "relative h-20 flex items-center gap-[2px] cursor-pointer rounded-lg overflow-hidden bg-secondary/30 p-2",
        className
      )}
      onClick={handleClick}
    >
      {bars.map(({ height, index }) => {
        const isPlayed = index / bars.length < progress;
        return (
          <div
            key={index}
            className={cn(
              "flex-1 rounded-full transition-all duration-75",
              isPlayed ? colorClasses[color] : "bg-muted-foreground/30"
            )}
            style={{ height: `${height}px` }}
          />
        );
      })}
      
      {/* Progress indicator */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-foreground shadow-lg"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
};
