"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CharacterMedia } from "@/content/media";

const HERO_VISIBILITY_THRESHOLD = 0.35;
type Sound = "pending" | "blocked" | "muted" | "enabled";

export function Character({ media, name }: { media: CharacterMedia; name: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [sound, setSound] = useState<Sound>("pending");
  const [unavailable, setUnavailable] = useState(false);
  const hasVideo = Boolean(media.webm || media.mp4);
  const description = name ? `Full-length character portrait of ${name}` : "Full-length character portrait";

  useEffect(() => {
    const video = videoRef.current;
    const button = buttonRef.current;
    const hero = video?.closest("#home");
    if (!video || !button || !hero) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lastSource = video.lastElementChild;
    let heroVisible = false;
    let canPlay = false;
    let failed = false;
    let soundMode: Sound = "pending";
    let playAttempt = 0;

    const updateSound = (next: Sound) => {
      soundMode = next;
      setSound(next);
    };

    const handleError = () => {
      failed = true;
      ++playAttempt;
      video.pause();
      setUnavailable(true);
    };

    const play = (withSound: boolean) => {
      const attempt = ++playAttempt;
      video.muted = !withSound;
      if (!withSound && !video.paused) return;

      // Call play() synchronously so unmuting can use the visitor's activation.
      void video.play().then(() => {
        if (attempt === playAttempt && withSound) updateSound("enabled");
      }, (error: DOMException) => {
        if (attempt !== playAttempt || error.name === "AbortError") return;
        if (error.name === "NotAllowedError") {
          if (withSound) {
            updateSound("blocked");
            play(false);
          }
        } else {
          handleError();
        }
      });
    };

    const syncPlayback = () => {
      const allowed = heroVisible && !motion.matches && !document.hidden && !failed;
      if (canPlay === allowed) return;
      canPlay = allowed;
      if (allowed) {
        play(soundMode === "pending" || soundMode === "enabled");
      } else {
        ++playAttempt;
        video.pause();
      }
    };

    const setHeroVisible = (visible: boolean) => {
      heroVisible = visible;
      syncPlayback();
    };

    const measureVisibility = () => {
      const bounds = hero.getBoundingClientRect();
      const width = Math.max(0, Math.min(bounds.right, document.documentElement.clientWidth) - Math.max(0, bounds.left));
      const height = Math.max(0, Math.min(bounds.bottom, document.documentElement.clientHeight) - Math.max(0, bounds.top));
      setHeroVisible(width > 0 && height > 0 && width * height >= HERO_VISIBILITY_THRESHOLD * bounds.width * bounds.height);
    };

    const enableSound = () => {
      updateSound("pending");
      if (canPlay && !failed) play(true);
    };

    const enableOnInteraction = (event: Event) => {
      if (!event.isTrusted || motion.matches || failed || soundMode === "enabled" || soundMode === "muted") return;
      if (event.target instanceof Node && button.contains(event.target)) return;
      enableSound();
    };

    const toggleSound = () => {
      if (soundMode === "enabled") {
        updateSound("muted");
        if (canPlay) play(false);
        else video.muted = true;
      } else {
        enableSound();
      }
    };

    const observer = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([entry]) => setHeroVisible(
        entry.isIntersecting && entry.intersectionRatio >= HERO_VISIBILITY_THRESHOLD,
      ), { threshold: HERO_VISIBILITY_THRESHOLD })
      : null;
    if (observer) observer.observe(hero);
    else {
      window.addEventListener("scroll", measureVisibility, { passive: true });
      window.addEventListener("resize", measureVisibility);
    }

    video.addEventListener("error", handleError);
    lastSource?.addEventListener("error", handleError);
    button.addEventListener("click", toggleSound);
    motion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    document.addEventListener("click", enableOnInteraction, true);
    document.addEventListener("keydown", enableOnInteraction, true);
    measureVisibility();

    return () => {
      ++playAttempt;
      video.pause();
      observer?.disconnect();
      window.removeEventListener("scroll", measureVisibility);
      window.removeEventListener("resize", measureVisibility);
      video.removeEventListener("error", handleError);
      lastSource?.removeEventListener("error", handleError);
      button.removeEventListener("click", toggleSound);
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      document.removeEventListener("click", enableOnInteraction, true);
      document.removeEventListener("keydown", enableOnInteraction, true);
    };
  }, [media.mp4, media.webm]);

  const soundEnabled = sound === "enabled";

  return (
    <div className="character">
      <div className="character-media">
        <div className="character-frame">
          {media.poster && <img src={media.poster} alt={description} width={480} height={720} fetchPriority="high" />}
          {hasVideo && !unavailable && (
            <video
              id="hero-talking-video"
              ref={videoRef}
              poster={media.poster ?? undefined}
              preload="none"
              playsInline
              loop
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden="true"
            >
              {media.webm && <source src={media.webm} type={'video/webm; codecs="vp9, opus"'} />}
              {media.mp4 && <source src={media.mp4} type="video/mp4" />}
            </video>
          )}
        </div>
        {hasVideo && !unavailable && (
          <button
            className="character-sound"
            ref={buttonRef}
            type="button"
            data-blocked={sound === "blocked"}
            aria-controls="hero-talking-video"
            aria-label={soundEnabled ? "Mute character audio" : "Enable character audio"}
          >
            {soundEnabled ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
