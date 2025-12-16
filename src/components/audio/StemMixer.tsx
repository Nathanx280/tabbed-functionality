import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Mic, Drum, Guitar, Piano } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Stem {
  id: string;
  name: string;
  icon: "vocals" | "drums" | "bass" | "other";
  volume: number;
  muted: boolean;
  color: string;
}

interface StemMixerProps {
  stems: Stem[];
  onStemChange: (id: string, updates: Partial<Stem>) => void;
}

const iconMap = {
  vocals: Mic,
  drums: Drum,
  bass: Guitar,
  other: Piano,
};

export const StemMixer = ({ stems, onStemChange }: StemMixerProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Stem Mixer</h3>
      <div className="grid gap-3">
        {stems.map((stem) => {
          const Icon = iconMap[stem.icon];
          return (
            <div
              key={stem.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                stem.muted
                  ? "bg-secondary/30 border-border/50 opacity-60"
                  : "bg-secondary/50 border-border"
              )}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stem.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: stem.color }} />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">{stem.name}</p>
                <Slider
                  value={[stem.volume]}
                  max={100}
                  step={1}
                  disabled={stem.muted}
                  onValueChange={([value]) => onStemChange(stem.id, { volume: value })}
                  className="w-full"
                />
              </div>
              
              <div className="text-right min-w-[3rem]">
                <span className="text-sm text-muted-foreground">{stem.volume}%</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStemChange(stem.id, { muted: !stem.muted })}
                className={cn(stem.muted && "text-destructive")}
              >
                {stem.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
