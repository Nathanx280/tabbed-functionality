import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  status: string;
  progress: number;
  message: string;
}

export const ProcessingOverlay = ({ status, progress, message }: ProcessingOverlayProps) => {
  if (status === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 rounded-2xl glass border border-border neon-glow">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
              <Loader2 className="w-10 h-10 text-background animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold capitalize">{status.replace("-", " ")}</h3>
            <p className="text-muted-foreground">{message}</p>
          </div>
          
          <div className="w-full space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">{progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
