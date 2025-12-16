import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AudioDropzone } from "@/components/audio/AudioDropzone";
import { WaveformVisualizer } from "@/components/audio/WaveformVisualizer";
import { ProcessingOverlay } from "@/components/audio/ProcessingOverlay";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useWaveform } from "@/hooks/useWaveform";
import { Layers, Play, Pause, Download, Mic, Drum, Guitar, Piano, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReconstructedStem {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
  volume: number;
  pan: number;
  waveform: number[];
}

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState({ status: "idle", progress: 0, message: "" });
  const [stems, setStems] = useState<ReconstructedStem[]>([
    { id: "vocals", name: "Vocals", icon: Mic, color: "hsl(280, 100%, 70%)", enabled: true, volume: 100, pan: 0, waveform: [] },
    { id: "drums", name: "Drums", icon: Drum, color: "hsl(330, 100%, 65%)", enabled: true, volume: 100, pan: 0, waveform: [] },
    { id: "bass", name: "Bass", icon: Guitar, color: "hsl(180, 100%, 50%)", enabled: true, volume: 100, pan: 0, waveform: [] },
    { id: "other", name: "Melody", icon: Piano, color: "hsl(150, 100%, 50%)", enabled: true, volume: 100, pan: 0, waveform: [] },
  ]);

  const { isPlaying, currentTime, duration, isLoaded, loadAudio, toggle, seek } = useAudioPlayer();
  const { waveformData, analyzeAudio } = useWaveform();

  const handleFileAccepted = async (file: File) => {
    setAudioFile(file);
    setProcessing({ status: "separating", progress: 0, message: "Loading audio..." });

    loadAudio(file);
    const waveform = await analyzeAudio(file);

    // Simulate stem separation with different waveform variations
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 100));
      const message = i < 25 ? "Isolating vocals..." : i < 50 ? "Extracting drums..." : i < 75 ? "Separating bass..." : "Finalizing stems...";
      setProcessing({ status: "separating", progress: i, message });
    }

    // Generate fake stem waveforms
    setStems(prev =>
      prev.map(stem => ({
        ...stem,
        waveform: waveform.map(v => v * (0.5 + Math.random() * 0.5)),
      }))
    );

    setProcessing({ status: "idle", progress: 0, message: "" });
    toast.success("Stems separated!", { description: "4 stems extracted from your track" });
  };

  const updateStem = (id: string, updates: Partial<ReconstructedStem>) => {
    setStems(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleReconstruct = async () => {
    setProcessing({ status: "remixing", progress: 0, message: "Reconstructing audio..." });
    
    for (let i = 0; i <= 100; i += 4) {
      await new Promise(r => setTimeout(r, 60));
      setProcessing({ status: "remixing", progress: i, message: "Mixing stems..." });
    }

    setProcessing({ status: "idle", progress: 0, message: "" });
    toast.success("Audio reconstructed!", { description: "Your custom mix is ready" });
  };

  return (
    <Layout>
      <ProcessingOverlay {...processing} />
      
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold neon-text flex items-center justify-center gap-3">
            <Layers className="w-10 h-10 text-primary" />
            Stem Reconstruct
          </h1>
          <p className="text-muted-foreground">
            Separate and reconstruct audio stems with precise control
          </p>
        </div>

        {!audioFile ? (
          <AudioDropzone onFileAccepted={handleFileAccepted} className="max-w-2xl mx-auto" />
        ) : (
          <div className="space-y-6">
            {/* Master Track */}
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{audioFile.name}</h2>
                  <p className="text-sm text-muted-foreground">Master Track</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setAudioFile(null)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New File
                </Button>
              </div>

              <WaveformVisualizer
                data={waveformData}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
              />

              <div className="flex justify-center mt-4">
                <Button
                  size="lg"
                  onClick={toggle}
                  disabled={!isLoaded}
                  className="w-14 h-14 rounded-full neon-glow"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
              </div>
            </Card>

            {/* Stem Controls */}
            <div className="grid md:grid-cols-2 gap-4">
              {stems.map(stem => {
                const Icon = stem.icon;
                return (
                  <Card
                    key={stem.id}
                    className={cn(
                      "p-4 transition-all",
                      stem.enabled ? "bg-card/50" : "bg-card/20 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${stem.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stem.color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{stem.name}</h3>
                      </div>
                      <Switch
                        checked={stem.enabled}
                        onCheckedChange={(enabled) => updateStem(stem.id, { enabled })}
                      />
                    </div>

                    <WaveformVisualizer
                      data={stem.waveform}
                      currentTime={currentTime}
                      duration={duration}
                      className="h-12 mb-4"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Volume</span>
                          <span>{stem.volume}%</span>
                        </div>
                        <Slider
                          value={[stem.volume]}
                          max={100}
                          disabled={!stem.enabled}
                          onValueChange={([v]) => updateStem(stem.id, { volume: v })}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Pan</span>
                          <span>{stem.pan > 0 ? `R${stem.pan}` : stem.pan < 0 ? `L${-stem.pan}` : "C"}</span>
                        </div>
                        <Slider
                          value={[stem.pan + 50]}
                          max={100}
                          disabled={!stem.enabled}
                          onValueChange={([v]) => updateStem(stem.id, { pan: v - 50 })}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center gap-4">
              <Button size="lg" className="neon-glow" onClick={handleReconstruct}>
                <RefreshCw className="w-5 h-5 mr-2" />
                Reconstruct
              </Button>
              <Button size="lg" variant="outline">
                <Download className="w-5 h-5 mr-2" />
                Export Stems
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
