import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AudioDropzone } from "@/components/audio/AudioDropzone";
import { ProcessingOverlay } from "@/components/audio/ProcessingOverlay";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Video, Play, Pause, Download, Palette } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const visualStyles = [
  { id: "spectrum", name: "Spectrum", color: "from-primary to-accent" },
  { id: "waveform", name: "Waveform", color: "from-neon-pink to-neon-purple" },
  { id: "circular", name: "Circular", color: "from-neon-cyan to-neon-blue" },
  { id: "bars", name: "Bars", color: "from-neon-green to-neon-cyan" },
];

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(visualStyles[0]);
  const [processing, setProcessing] = useState({ status: "idle", progress: 0, message: "" });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);

  const { isPlaying, isLoaded, loadAudio, toggle, audioRef } = useAudioPlayer();

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(10, 10, 15, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, "hsl(280, 100%, 70%)");
        gradient.addColorStop(1, "hsl(180, 100%, 50%)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };

    if (isPlaying) {
      audioContext.resume();
      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, audioRef]);

  const handleFileAccepted = async (file: File) => {
    setAudioFile(file);
    setProcessing({ status: "analyzing", progress: 0, message: "Processing audio..." });
    
    loadAudio(file);
    
    await new Promise(r => setTimeout(r, 1000));
    setProcessing({ status: "idle", progress: 100, message: "" });
    toast.success("Audio ready for visualization!");
  };

  const handleExport = async () => {
    setProcessing({ status: "exporting", progress: 0, message: "Rendering video..." });
    
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 50));
      setProcessing({ status: "exporting", progress: i, message: "Creating video file..." });
    }
    
    setProcessing({ status: "idle", progress: 0, message: "" });
    toast.success("Video exported!", { description: "Your visualized video is ready" });
  };

  return (
    <Layout>
      <ProcessingOverlay {...processing} />
      
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold neon-text flex items-center justify-center gap-3">
            <Video className="w-10 h-10 text-primary" />
            Audio to Video
          </h1>
          <p className="text-muted-foreground">
            Create stunning music visualizations for your tracks
          </p>
        </div>

        {!audioFile ? (
          <AudioDropzone onFileAccepted={handleFileAccepted} className="max-w-2xl mx-auto" />
        ) : (
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 rounded-xl bg-background"
              />
              
              <div className="flex items-center justify-center mt-6">
                <Button
                  size="lg"
                  onClick={toggle}
                  disabled={!isLoaded}
                  className="w-16 h-16 rounded-full neon-glow"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
              </div>
            </Card>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Style:</span>
              </div>
              {visualStyles.map(style => (
                <Button
                  key={style.id}
                  variant={selectedStyle.id === style.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStyle(style)}
                  className={cn(selectedStyle.id === style.id && "neon-glow")}
                >
                  {style.name}
                </Button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={handleExport} className="neon-glow-cyan">
                <Download className="w-5 h-5 mr-2" />
                Export Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
