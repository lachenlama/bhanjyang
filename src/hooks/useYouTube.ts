import { useCallback, useEffect, useRef, useState } from "react";
import type { Song } from "../data/songs";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// YT.PlayerState
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;

let apiPromise: Promise<any> | null = null;

function loadApi(): Promise<any> {
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      if (window.YT?.Player) return resolve(window.YT);
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

/**
 * Drives a hidden-ish YouTube iframe as an audio source.
 * Mount `hostRef` on an empty div — the player is created as a child of it.
 */
export function useYouTube(songs: Song[], startIndex = 0) {
  const hostRef = useRef<HTMLDivElement>(null);
  const player = useRef<any>(null);
  const loadedIndex = useRef(startIndex);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(startIndex);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // An object, not a string: two songs blocked in a row must read as two distinct
  // errors so callers can react to each one.
  const [error, setError] = useState<{ code: number } | null>(null);

  useEffect(() => {
    let dead = false;
    const host = hostRef.current!;
    // YT replaces the element it's given with an iframe, so hand it a throwaway
    // child rather than a React-owned node (also survives StrictMode double-mount).
    const slot = document.createElement("div");
    host.appendChild(slot);

    loadApi().then((YT) => {
      if (dead) return;
      player.current = new YT.Player(slot, {
        videoId: songs[startIndex].yt,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: any) => {
            setDuration(e.target.getDuration());
            setReady(true);
          },
          onStateChange: (e: any) => {
            if (e.data === PLAYING) {
              setPlaying(true);
              setDuration(e.target.getDuration());
              setError(null);
            }
            if (e.data === PAUSED) setPlaying(false);
            if (e.data === ENDED) setIndex((i) => (i + 1) % songs.length);
          },
          onError: (e: any) => setError({ code: e.data }),
        },
      });
    });

    return () => {
      dead = true;
      player.current?.destroy?.();
      player.current = null;
      host.replaceChildren();
    };
  }, [songs]);

  // Track change → load and autoplay. Skips the initial render (already loaded).
  useEffect(() => {
    if (!ready || loadedIndex.current === index) return;
    loadedIndex.current = index;
    setTime(0);
    setDuration(0);
    player.current?.loadVideoById(songs[index].yt);
  }, [index, ready, songs]);

  // The iframe API has no timeupdate event, so poll while playing.
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      const p = player.current;
      if (!p?.getCurrentTime) return;
      setTime(p.getCurrentTime());
      const d = p.getDuration();
      if (d) setDuration(d);
    }, 500);
    return () => clearInterval(t);
  }, [playing]);

  const play = useCallback(() => player.current?.playVideo(), []);
  const pause = useCallback(() => player.current?.pauseVideo(), []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);

  const seek = useCallback((s: number) => {
    player.current?.seekTo(s, true);
    setTime(s);
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % songs.length), [songs.length]);

  const prev = useCallback(() => {
    // Standard transport behaviour: restart the track unless you're near the top.
    if ((player.current?.getCurrentTime?.() ?? 0) > 3) return seek(0);
    setIndex((i) => (i - 1 + songs.length) % songs.length);
  }, [songs.length, seek]);

  const setVolume = useCallback((v: number) => player.current?.setVolume(v), []);

  return {
    hostRef,
    ready,
    playing,
    index,
    song: songs[index],
    time,
    duration,
    error,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    jumpTo: setIndex,
  };
}
