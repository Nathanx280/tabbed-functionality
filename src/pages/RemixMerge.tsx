import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AudioDropzone } from "@/components/audio/AudioDropzone";
import { WaveformVisualizer } from "@/components/audio/WaveformVisualizer";
import { ProcessingOverlay } from "@/components/audio/ProcessingOverlay";
import { useWaveform } from "@/hooks/useWaveform";
import { GitMerge, Plus, Trash2, Sparkles, Download } from "lucide-react";
import { toast } from "sonner";

interface TrackSlot {
  id: string;
  file: File | null;
  waveform: number[];
  volume: number;
  offset: number;
}

const Index = () => {
  const [tracks, setTracks] = useState<TrackSlot[]>([
    { id: "1", file: null, waveform: [], volume: 100, offset: 0 },
    { id: "2", file: null, waveform: [], volume: 100, offset: 0 },
  ]);
  const [processing, setProcessing] = useState({ status: "idle", progress: 0, message: "" });
  const { analyzeAudio } = useWaveform();

  const handleFileAccepted = async (trackId: string, file: File) => {
    const waveform = await analyzeAudio(file);
    setTracks(prev =>
      prev.map(t => (t.id === trackId ? { ...t, file, waveform } : t))
    );
    toast.success(`Track ${trackId} loaded!`);
  };

  const handleTrackUpdate = (trackId: string, updates: Partial<TrackSlot>) => {
    setTracks(prev =>
      prev.map(t => (t.id === trackId ? { ...t, ...updates } : t))
    );
  };

  const addTrack = () => {
    if (tracks.length >= 4) {
      toast.error("Maximum 4 tracks allowed");
      return;
    }
    setTracks(prev => [
      ...prev,
      { id: String(Date.now()), file: null, waveform: [], volume: 100, offset: 0 },
    ]);
  };

  const removeTrack = (trackId: string) => {
    if (tracks.length <= 2) {
      toast.error("Minimum 2 tracks required");
      return;
    }
    setTracks(prev => prev.filter(t => t.id !== trackId));
  };

  const handleMerge = async () => {
    const loadedTracks = tracks.filter(t => t.file);
    if (loadedTracks.length < 2) {
      toast.error("Please load at least 2 tracks");
      return;
    }

    setProcessing({ status: "remixing", progress: 0, message: "Analyzing tracks..." });
    
    for (let i = 0; i <= 100; i += 4) {
      await new Promise(r => setTimeout(r, 80));
      const message = i < 30 ? "Aligning beats..." : i < 60 ? "Mixing frequencies..." : "Finalizing merge...";
      setProcessing({ status: "remixing", progress: i, message });
    }

    setProcessing({ status: "idle", progress: 0, message: "" });
    toast.success("Tracks merged successfully!", { description: "Your mashup is ready" });
  };

  return (
    <Layout>
      <ProcessingOverlay {...processing} />
      
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold neon-text flex items-center justify-center gap-3">
            <GitMerge className="w-10 h-10 text-primary" />
            Remix Merge
          </h1>
          <p className="text-muted-foreground">
            Blend multiple tracks together into a seamless mashup
          </p>
        </div>

        <div className="space-y-4">
          {tracks.map((track, index) => (
            <Card key={track.id} className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Track {index + 1}</h3>
                {tracks.length > 2 && (
                  <Button variant="ghost" size="sm" onClick={() => removeTrack(track.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>

              {!track.file ? (
                <AudioDropzone
                  onFileAccepted={(file) => handleFileAccepted(track.id, file)}
                  className="h-32"
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate max-w-[200px]">{track.file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTrackUpdate(track.id, { file: null, waveform: [] })}
                    >
                      Change
                    </Button>
                  </div>
                  
                  <WaveformVisualizer
                    data={track.waveform}
                    currentTime={0}
                    duration={1}
                    color={index % 2 === 0 ? "primary" : "accent"}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Volume</span>
                        <span>{track.volume}%</span>
                      </div>
                      <Slider
                        value={[track.volume]}
                        max={100}
                        onValueChange={([v]) => handleTrackUpdate(track.id, { volume: v })}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Offset</span>
                        <span>{track.offset}ms</span>
                      </div>
                      <Slider
                        value={[track.offset]}
                        max={2000}
                        onValueChange={([v]) => handleTrackUpdate(track.id, { offset: v })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="outline" onClick={addTrack} disabled={tracks.length >= 4}>
            <Plus className="w-4 h-4 mr-2" />
            Add Track
          </Button>
          <Button size="lg" className="neon-glow" onClick={handleMerge}>
            <Sparkles className="w-5 h-5 mr-2" />
            Merge Tracks
          </Button>
          <Button variant="outline" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
