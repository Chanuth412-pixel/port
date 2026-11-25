"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterMedia } from "@/content/media";

export function Character({ media, name }: { media: CharacterMedia; name: string | null }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mountVideo, setMountVideo] = useState(false);
  const [backdrop, setBackdrop] = useState(media.entrance[0]?.backdrop ?? "studio");
  const entrance = useRef<HTMLVideoElement>(null);
  const autoplayAttempted = useRef(false);
  const showVideo = mountVideo && media.entrance.length > 0;
  const showStill = !showVideo && (reducedMotion || media.entrance.length === 0);
  const stillSource = media.still ?? media.poster;
  const description = name ? `Full-length character portrait of ${name}` : "Full-length character portrait";

  const playVideo = useCallback((video: HTMLVideoElement) => {
    video.muted = true;
    video.playbackRate = media.playbackRate;
    void video.play().catch(() => undefined);
  }, [media.playbackRate]);

  const startWhenReady = useCallback((video: HTMLVideoElement) => {
    if (autoplayAttempted.current || video.ended || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoplayAttempted.current = true;
    playVideo(video);
  }, [playVideo]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function sync() {
      setReducedMotion(preference.matches);
      const video = entrance.current;
      if (preference.matches) {
        video?.pause();
        return;
      }
      setMountVideo(true);
      if (video && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) startWhenReady(video);
    }
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, [startWhenReady]);

  return (
    <div className="character">
      <div className="character-media" data-backdrop={showVideo ? backdrop : "studio"}>
        {showVideo && (
          <video
            id="hero-entrance-video"
            className="character-frame character-video"
            ref={entrance}
            poster={media.poster ?? undefined}
            preload="auto"
            muted
            playsInline
            tabIndex={-1}
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            onCanPlay={({ currentTarget }) => startWhenReady(currentTarget)}
            onLoadedMetadata={({ currentTarget: video }) => {
              const source = media.entrance.find(({ src }) => new URL(src, video.baseURI).href === video.currentSrc);
              setBackdrop(source?.backdrop ?? "studio");
              if (video.videoWidth && video.videoHeight) {
                video.style.setProperty("--frame-ratio", String(video.videoWidth / video.videoHeight));
              }
            }}
          >
            {media.entrance.map(({ src, type }) => <source key={src} src={src} type={type} />)}
          </video>
        )}
        {showStill && stillSource && (
          <img className="character-frame" src={stillSource} alt={description} />
        )}
      </div>
    </div>
  );
}
