import { cn } from "@/lib/utils";
import { Sparkles, Zap, Cloud, Flame, Wind, Waves } from "lucide-react";

export interface RemixStyle {
  id: string;
  name: string;
  description: string;
  icon: "sparkles" | "zap" | "cloud" | "flame" | "wind" | "waves";
  color: string;
}

const styles: RemixStyle[] = [
  { id: "edm", name: "EDM", description: "High-energy electronic drops", icon: "zap", color: "hsl(280, 100%, 70%)" },
  { id: "lofi", name: "Lo-Fi", description: "Chill, relaxed vibes", icon: "cloud", color: "hsl(180, 100%, 50%)" },
  { id: "trap", name: "Trap", description: "Heavy bass and hi-hats", icon: "flame", color: "hsl(330, 100%, 65%)" },
  { id: "house", name: "House", description: "Four-on-the-floor groove", icon: "waves", color: "hsl(220, 100%, 60%)" },
  { id: "ambient", name: "Ambient", description: "Atmospheric soundscapes", icon: "wind", color: "hsl(150, 100%, 50%)" },
  { id: "custom", name: "Custom", description: "Create your own style", icon: "sparkles", color: "hsl(45, 100%, 60%)" },
];

const iconMap = {
  sparkles: Sparkles,
  zap: Zap,
  cloud: Cloud,
  flame: Flame,
  wind: Wind,
  waves: Waves,
};

interface RemixStyleSelectorProps {
  selected: string | null;
  onSelect: (style: RemixStyle) => void;
}

export const RemixStyleSelector = ({ selected, onSelect }: RemixStyleSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Remix Style</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {styles.map((style) => {
          const Icon = iconMap[style.icon];
          const isSelected = selected === style.id;
          
          return (
            <button
              key={style.id}
              onClick={() => onSelect(style)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/10 neon-glow"
                  : "border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${style.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: style.color }} />
              </div>
              <div className="text-center">
                <p className="font-medium">{style.name}</p>
                <p className="text-xs text-muted-foreground">{style.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
