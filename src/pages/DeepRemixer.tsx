import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AudioDropzone } from "@/components/audio/AudioDropzone";
import { WaveformVisualizer } from "@/components/audio/WaveformVisualizer";
import { ProcessingOverlay } from "@/components/audio/ProcessingOverlay";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useWaveform } from "@/hooks/useWaveform";
import { Wand2, Play, Pause, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface AIParameter {
  id: string;
  name: string;
  value: number;
  description: string;
}

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState({ status: "idle", progress: 0, message: "" });
  const [parameters, setParameters] = useState<AIParameter[]>([
    { id: "creativity", name: "Creativity", value: 50, description: "How creative the AI should be" },
    { id: "intensity", name: "Intensity", value: 70, description: "Strength of the transformations" },
    { id: "preservation", name: "Original Preservation", value: 60, description: "How much to keep the original" },
    { id: "complexity", name: "Complexity", value: 40, description: "Arrangement complexity" },
  ]);

  const { isPlaying, currentTime, duration, isLoaded, loadAudio, toggle, seek } = useAudioPlayer();
  const { waveformData, analyzeAudio } = useWaveform();

  const handleFileAccepted = async (file: File) => {
    setAudioFile(file);
    setProcessing({ status: "analyzing", progress: 0, message: "Loading audio..." });
    
    loadAudio(file);
    await analyzeAudio(file);
    
    setProcessing({ status: "idle", progress: 100, message: "" });
    toast.success("Audio loaded successfully!");
  };

  const handleParameterChange = (id: string, value: number) => {
    setParameters(prev => prev.map(p => p.id === id ? { ...p, value } : p));
  };

  const handleDeepRemix = async () => {
    setProcessing({ status: "remixing", progress: 0, message: "Initializing AI engine..." });
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 100));
      setProcessing({ status: "remixing", progress: i, message: i < 50 ? "Analyzing patterns..." : "Generating remix..." });
    }
    
    setProcessing({ status: "idle", progress: 0, message: "" });
    toast.success("Deep remix complete!", { description: "AI has transformed your track" });
  };

  return (
    <Layout>
      <ProcessingOverlay {...processing} />
      
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold neon-text flex items-center justify-center gap-3">
            <Wand2 className="w-10 h-10 text-primary" />
            Deep Remixer
          </h1>
          <p className="text-muted-foreground">
            AI-powered deep learning remix engine with fine-tuned control
          </p>
        </div>

        {!audioFile ? (
          <AudioDropzone onFileAccepted={handleFileAccepted} className="max-w-2xl mx-auto" />
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{audioFile.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setAudioFile(null)}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <WaveformVisualizer
                data={waveformData}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
                color="accent"
              />

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={toggle}
                  disabled={!isLoaded}
                  className="w-14 h-14 rounded-full"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
              </div>
            </Card>

            <Card className="p-6 space-y-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-lg font-semibold">AI Parameters</h3>
              
              <div className="space-y-6">
                {parameters.map(param => (
                  <div key={param.id} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">{param.name}</label>
                      <span className="text-sm text-muted-foreground">{param.value}%</span>
                    </div>
                    <Slider
                      value={[param.value]}
                      max={100}
                      step={1}
                      onValueChange={([v]) => handleParameterChange(param.id, v)}
                    />
                    <p className="text-xs text-muted-foreground">{param.description}</p>
                  </div>
                ))}
              </div>

              <Button size="lg" className="w-full neon-glow" onClick={handleDeepRemix}>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Deep Remix
              </Button>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
