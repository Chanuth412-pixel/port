"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterMedia } from "@/content/media";

type Phase = "entrance" | "idle";
type Retry = "automatic" | "gesture" | "unavailable";

function configureVideo(video: HTMLVideoElement, speed: number) {
  video.defaultMuted = true;
  video.muted = true;
  video.defaultPlaybackRate = speed;
  video.playbackRate = speed;
}

export function Character({ media, name }: { media: CharacterMedia; name: string | null }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mountVideo, setMountVideo] = useState(false);
  const [entrancePlayed, setEntrancePlayed] = useState(false);
  const [idleRequested, setIdleRequested] = useState(false);
  const [display, setDisplay] = useState<Phase | "entrance-poster" | "idle-poster">("entrance");
  const entranceRef = useRef<HTMLVideoElement>(null);
  const idleRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const phaseRef = useRef<Phase>("entrance");
  const retryRef = useRef<Retry>("automatic");
  const pendingPlayRef = useRef<HTMLVideoElement | null>(null);
  const inViewportRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const showVideo = mountVideo && Boolean(media.entrance);
  const showStill = reducedMotion || !media.entrance;
  const showPoster = showStill || display.endsWith("-poster");
  const posterSource = showStill ? media.still ?? media.poster :
    (display === "idle-poster" ? media.idlePoster : media.poster) ?? media.still;
  const description = name ? `Full-length character portrait of ${name}` : "Full-length character portrait";

  const motionAllowed = useCallback(() => {
    return inViewportRef.current && !reducedMotionRef.current && !document.hidden;
  }, []);

  const syncPlayback = useCallback((fromGesture = false) => {
    const phase = phaseRef.current;
    const video = phase === "entrance" ? entranceRef.current : idleRef.current;
    if (!video?.getAttribute("src")) return;

    if (!motionAllowed()) {
      video.autoplay = false;
      video.pause();
      return;
    }
    if ((phase === "entrance" && video.ended) || !video.paused || pendingPlayRef.current === video ||
        retryRef.current === "unavailable" || (retryRef.current === "gesture" && !fromGesture)) return;

    configureVideo(video, phase === "entrance" ? media.entranceSpeed : 1);
    video.autoplay = retryRef.current === "automatic";
    pendingPlayRef.current = video;
    void video.play().catch((error: unknown) => {
      const name = typeof error === "object" && error !== null && "name" in error ? error.name : "";
      if (phase !== phaseRef.current || name === "AbortError") return;
      video.autoplay = false;
      retryRef.current = name === "NotAllowedError" ? "gesture" : "unavailable";
      setDisplay(phase === "entrance" ? "entrance-poster" : "idle-poster");
      if (retryRef.current === "unavailable") console.warn("Hero video playback unavailable", error);
    }).finally(() => {
      if (pendingPlayRef.current === video) pendingPlayRef.current = null;
    });
  }, [media.entranceSpeed, motionAllowed]);

  const attachEntrance = useCallback((video: HTMLVideoElement | null) => {
    entranceRef.current = video;
    if (video) {
      configureVideo(video, media.entranceSpeed);
      video.autoplay = motionAllowed();
    }
  }, [media.entranceSpeed, motionAllowed]);

  useEffect(() => {
    syncPlayback();
  }, [mountVideo, idleRequested, syncPlayback]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.getElementById("home");
    const poster = posterRef.current;
    let mountFrame = 0;

    function syncActivity() {
      if (motionAllowed() && media.entrance && !entranceRef.current?.getAttribute("src") && (!poster || poster.complete)) {
        cancelAnimationFrame(mountFrame);
        // Let the lightweight poster paint before starting the video request.
        mountFrame = requestAnimationFrame(() => {
          mountFrame = requestAnimationFrame(() => {
            if (motionAllowed()) setMountVideo(true);
          });
        });
      }
      syncPlayback();
    }

    function syncPreference() {
      reducedMotionRef.current = preference.matches;
      setReducedMotion(preference.matches);
      syncActivity();
    }

    function setInViewport(visible: boolean) {
      if (visible === inViewportRef.current) return;
      inViewportRef.current = visible;
      syncActivity();
    }

    function measureViewport() {
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      setInViewport(bounds.bottom > 0 && bounds.top < window.innerHeight);
    }

    function retryOnInteraction(event: Event) {
      if (event.isTrusted && retryRef.current === "gesture") syncPlayback(true);
    }

    const gestures = ["click", "touchend", "keydown"];
    syncPreference();
    measureViewport();
    const observer = hero && typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting))
      : null;
    if (observer && hero) observer.observe(hero);
    else {
      window.addEventListener("scroll", measureViewport, { passive: true });
      window.addEventListener("resize", measureViewport);
    }
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncActivity);
    poster?.addEventListener("load", syncActivity);
    poster?.addEventListener("error", syncActivity);
    for (const event of gestures) document.addEventListener(event, retryOnInteraction, true);

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(mountFrame);
      window.removeEventListener("scroll", measureViewport);
      window.removeEventListener("resize", measureViewport);
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncActivity);
      poster?.removeEventListener("load", syncActivity);
      poster?.removeEventListener("error", syncActivity);
      for (const event of gestures) document.removeEventListener(event, retryOnInteraction, true);
    };
  }, [media.entrance, motionAllowed, syncPlayback]);

  useEffect(() => {
    if (!entrancePlayed || idleRequested || reducedMotion || !media.idle) return;

    let cancelScheduled: (() => void) | undefined;
    function schedule() {
      if (typeof window.requestIdleCallback === "function") {
        const request = window.requestIdleCallback(() => setIdleRequested(true), { timeout: 1000 });
        cancelScheduled = () => window.cancelIdleCallback(request);
      } else {
        const timer = window.setTimeout(() => setIdleRequested(true), 250);
        cancelScheduled = () => window.clearTimeout(timer);
      }
    }
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelScheduled?.();
      window.removeEventListener("load", schedule);
    };
  }, [entrancePlayed, idleRequested, media.idle, reducedMotion]);

  function handlePlaying(phase: Phase) {
    if (phaseRef.current !== phase) return;
    if (!motionAllowed()) {
      syncPlayback();
      return;
    }
    retryRef.current = "automatic";
    setDisplay(phase);
    if (phase === "entrance") setEntrancePlayed(true);
  }

  function handleError(phase: Phase) {
    if (phaseRef.current !== phase) return;
    retryRef.current = "unavailable";
    setDisplay(phase === "entrance" ? "entrance-poster" : "idle-poster");
  }

  function handleEntranceEnded() {
    if (entranceRef.current) entranceRef.current.autoplay = false;
    if (phaseRef.current === "idle" || !media.idle) return;
    phaseRef.current = "idle";
    retryRef.current = "automatic";
    setIdleRequested(true);
    syncPlayback();
  }

  return (
    <div className="character">
      <div className="character-media" data-backdrop="studio">
        {media.entrance && (!reducedMotion || mountVideo) && (
          <video
            id="hero-entrance-video"
            className="character-frame character-video"
            data-active={!showPoster && display === "entrance"}
            ref={attachEntrance}
            src={showVideo ? media.entrance : undefined}
            poster={media.poster ?? undefined}
            preload={showVideo ? "metadata" : "none"}
            autoPlay={showVideo}
            muted
            playsInline
            loop={false}
            controls={false}
            tabIndex={-1}
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            onCanPlay={() => syncPlayback()}
            onPlaying={() => handlePlaying("entrance")}
            onEnded={handleEntranceEnded}
            onError={() => handleError("entrance")}
          />
        )}
        {showVideo && idleRequested && media.idle && (
          <video
            id="hero-idle-video"
            className="character-frame character-video"
            data-active={!showPoster && display === "idle"}
            ref={idleRef}
            src={media.idle}
            poster={media.idlePoster ?? undefined}
            preload="auto"
            muted
            playsInline
            loop
            controls={false}
            tabIndex={-1}
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            onCanPlay={() => syncPlayback()}
            onPlaying={() => handlePlaying("idle")}
            onError={() => handleError("idle")}
          />
        )}
        {posterSource && (
          <picture className="character-poster">
            {media.still && <source media="(prefers-reduced-motion: reduce)" srcSet={media.still} />}
            <img ref={posterRef} className={showStill ? "character-frame" : "character-frame character-video"} data-active={showPoster} src={posterSource} alt={description} fetchPriority="high" />
          </picture>
        )}
      </div>
    </div>
  );
}
