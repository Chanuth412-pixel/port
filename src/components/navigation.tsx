"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const links = [
  { id: "about", label: "About" },
  { id: "toolkit", label: "Toolkit" },
  { id: "open-source", label: "Open Source" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

function EntranceMotionControl() {
  const [motion, setMotion] = useState<{ video: HTMLVideoElement; paused: boolean } | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const videoId = "hero-entrance-video";
    const events = ["playing", "pause", "ended", "error"];

    function update() {
      const video = document.getElementById(videoId);
      if (!(video instanceof HTMLVideoElement) || preference.matches || video.ended || video.error ||
          !(video.duration / video.playbackRate > 5) || (video.paused && video.currentTime === 0)) {
        setMotion(null);
        return;
      }
      setMotion({ video, paused: video.paused });
    }

    function onMediaEvent(event: Event) {
      if (event.target instanceof HTMLVideoElement && event.target.id === videoId) update();
    }

    update();
    for (const event of events) document.addEventListener(event, onMediaEvent, true);
    preference.addEventListener("change", update);
    return () => {
      for (const event of events) document.removeEventListener(event, onMediaEvent, true);
      preference.removeEventListener("change", update);
    };
  }, []);

  if (!motion) return null;

  return (
    <button
      className="site-motion-control"
      type="button"
      aria-label={`${motion.paused ? "Resume" : "Pause"} hero animation`}
      onClick={() => {
        if (motion.video.ended) return;
        if (motion.video.paused) void motion.video.play().catch(() => undefined);
        else motion.video.pause();
      }}
    >
      {motion.paused ? "Resume" : "Pause"}
    </button>
  );
}

export function Navigation({ mark, name }: { mark: string; name: string | null }) {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.getElementById("home");
    const sections = ["home", ...links.map(({ id }) => id)].flatMap((id) => {
      const section = document.getElementById(id);
      return section ? [section] : [];
    });
    let frame = 0;
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      const marker = Math.min(window.innerHeight * 0.3, 240);
      const visible = sections.findLast((section) => section.getBoundingClientRect().top <= marker);
      setActive((ratio >= 0.995 ? sections.at(-1) : visible)?.id ?? "home");
      if (progress.current) progress.current.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
      if (hero && header.current) {
        header.current.dataset.studio = String(hero.getBoundingClientRect().bottom > header.current.offsetHeight);
      }
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : null;
    observer?.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 800px)");
    function dismiss(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggle.current?.focus();
    }
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setMenuOpen(false);
    }
    function closeDesktop(event: MediaQueryListEvent) {
      if (event.matches) setMenuOpen(false);
    }
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeDesktop);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeDesktop);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" data-studio="true" ref={header} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
    }}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="shell header-inner">
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)} aria-label={`${name ?? "Engineering Portfolio"} home`}>
          <span className="brand-mark" aria-hidden="true">{mark}</span>
          <span className="brand-name">{name ?? "Engineering Portfolio"}</span>
        </a>
        <EntranceMotionControl />
        <button ref={toggle} type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          <span className="sr-only">{menuOpen ? "Close navigation" : "Open navigation"}</span>
        </button>
        <nav className="site-nav" id="site-navigation" aria-label="Main navigation" data-open={menuOpen}>
          {links.map(({ id, label }) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => {
              if (menuOpen) document.getElementById(id)?.focus({ preventScroll: true });
              setMenuOpen(false);
            }}>{label}</a>
          ))}
        </nav>
      </div>
      <div className="scroll-progress" ref={progress} aria-hidden="true" />
    </header>
  );
}
