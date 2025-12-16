import { useState, useRef, useCallback, useEffect } from "react";

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoaded: boolean;
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoaded: false,
  });

  const loadAudio = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    if (audioRef.current) {
      URL.revokeObjectURL(audioRef.current.src);
    }
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration,
        isLoaded: true,
      }));
    });

    audio.addEventListener("timeupdate", () => {
      setState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    });

    audio.addEventListener("ended", () => {
      setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
    });

    return audio;
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play();
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((prev) => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState((prev) => ({ ...prev, volume }));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  return {
    ...state,
    audioRef,
    loadAudio,
    play,
    pause,
    toggle,
    seek,
    setVolume,
  };
};
