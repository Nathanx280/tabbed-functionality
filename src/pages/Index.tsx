import { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { AudioDropzone } from "@/components/audio/AudioDropzone";
import { WaveformVisualizer } from "@/components/audio/WaveformVisualizer";
import { StemMixer, Stem } from "@/components/audio/StemMixer";
import { RemixStyleSelector, RemixStyle } from "@/components/audio/RemixStyleSelector";
import { ProcessingOverlay } from "@/components/audio/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useWaveform } from "@/hooks/useWaveform";
import { Play, Pause, Download, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ProcessingState {
  status: "idle" | "uploading" | "analyzing" | "separating" | "remixing" | "exporting";
  progress: number;
  message: string;
}

const defaultStems: Stem[] = [
  { id: "vocals", name: "Vocals", icon: "vocals", volume: 100, muted: false, color: "hsl(280, 100%, 70%)" },
  { id: "drums", name: "Drums", icon: "drums", volume: 100, muted: false, color: "hsl(330, 100%, 65%)" },
  { id: "bass", name: "Bass", icon: "bass", volume: 100, muted: false, color: "hsl(180, 100%, 50%)" },
  { id: "other", name: "Other", icon: "other", volume: 100, muted: false, color: "hsl(150, 100%, 50%)" },
];

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [stems, setStems] = useState<Stem[]>(defaultStems);
  const [selectedStyle, setSelectedStyle] = useState<RemixStyle | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
    message: "",
  });

  const { isPlaying, currentTime, duration, isLoaded, loadAudio, toggle, seek } = useAudioPlayer();
  const { waveformData, analyzeAudio } = useWaveform();

  const simulateProgress = async (target: number, message: string) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setProcessing((prev) => {
          const newProgress = Math.min(prev.progress + 3, target);
          if (newProgress >= target) {
            clearInterval(interval);
            resolve();
          }
          return { ...prev, progress: newProgress, message };
        });
      }, 50);
    });
  };

  const handleFileAccepted = useCallback(async (file: File) => {
    setAudioFile(file);
    setProcessing({ status: "uploading", progress: 0, message: "Reading audio file..." });

    await simulateProgress(20, "Uploading audio data...");
    loadAudio(file);

    setProcessing({ status: "analyzing", progress: 20, message: "Analyzing waveform..." });
    await analyzeAudio(file);
    await simulateProgress(50, "Detecting tempo and key...");

    setProcessing({ status: "separating", progress: 50, message: "Separating stems..." });
    await simulateProgress(90, "Isolating audio tracks...");

    setStems(defaultStems);
    setProcessing({ status: "idle", progress: 100, message: "Ready!" });

    toast.success("Audio processed successfully!", {
      description: `${file.name} is ready to remix`,
    });
  }, [loadAudio, analyzeAudio]);

  const handleStemChange = useCallback((id: string, updates: Partial<Stem>) => {
    setStems((prev) =>
      prev.map((stem) => (stem.id === id ? { ...stem, ...updates } : stem))
    );
  }, []);

  const handleRemix = useCallback(async () => {
    if (!selectedStyle) {
      toast.error("Please select a remix style first");
      return;
    }

    setProcessing({ status: "remixing", progress: 0, message: "Initializing remix engine..." });
    await simulateProgress(40, "Applying stem transformations...");
    await simulateProgress(70, "Processing effects chains...");
    await simulateProgress(100, "Generating new arrangement...");

    setProcessing({ status: "idle", progress: 0, message: "" });
    toast.success(`${selectedStyle.name} remix created!`, {
      description: "Your track has been transformed",
    });
  }, [selectedStyle]);

  const handleExport = useCallback(async () => {
    setProcessing({ status: "exporting", progress: 0, message: "Rendering audio..." });
    await simulateProgress(100, "Preparing download...");

    setProcessing({ status: "idle", progress: 0, message: "" });
    toast.success("Export complete!", {
      description: "Your remix is ready to download",
    });
  }, []);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Layout>
      <ProcessingOverlay {...processing} />

      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold neon-text">Remix Studio</h1>
          <p className="text-muted-foreground">
            Upload your track and transform it with AI-powered remixing
          </p>
        </div>

        {!audioFile ? (
          <AudioDropzone onFileAccepted={handleFileAccepted} className="max-w-2xl mx-auto" />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Player */}
            <Card className="lg:col-span-2 p-6 space-y-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{audioFile.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAudioFile(null);
                    setStems(defaultStems);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Track
                </Button>
              </div>

              <WaveformVisualizer
                data={waveformData}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
              />

              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={toggle}
                  disabled={!isLoaded}
                  className="w-16 h-16 rounded-full neon-glow"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>
              </div>

              <StemMixer stems={stems} onStemChange={handleStemChange} />
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <RemixStyleSelector
                  selected={selectedStyle?.id || null}
                  onSelect={setSelectedStyle}
                />
              </Card>

              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleRemix}
                  disabled={!selectedStyle}
                  className="neon-glow"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Remix
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleExport}
                  className="border-accent text-accent hover:bg-accent/10"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export Remix
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
