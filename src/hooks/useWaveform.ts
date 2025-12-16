import { useState, useCallback } from "react";

export const useWaveform = () => {
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeAudio = useCallback(async (file: File): Promise<number[]> => {
    setIsAnalyzing(true);
    
    return new Promise((resolve) => {
      const audioContext = new AudioContext();
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const channelData = audioBuffer.getChannelData(0);
          
          // Downsample to 200 points for visualization
          const samples = 200;
          const blockSize = Math.floor(channelData.length / samples);
          const waveform: number[] = [];
          
          for (let i = 0; i < samples; i++) {
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
              sum += Math.abs(channelData[i * blockSize + j]);
            }
            waveform.push(sum / blockSize);
          }
          
          // Normalize
          const max = Math.max(...waveform);
          const normalized = waveform.map((v) => v / max);
          
          setWaveformData(normalized);
          setIsAnalyzing(false);
          resolve(normalized);
        } catch {
          // Generate placeholder waveform on error
          const placeholder = Array.from({ length: 200 }, () => Math.random() * 0.5 + 0.3);
          setWaveformData(placeholder);
          setIsAnalyzing(false);
          resolve(placeholder);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }, []);

  return { waveformData, isAnalyzing, analyzeAudio, setWaveformData };
};
