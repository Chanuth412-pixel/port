import { existsSync } from "node:fs";
import { join } from "node:path";

const assetFiles = {
  "entrance.mp4": ["character/entrance-optimized.mp4", "character/entrance.mp4"],
  "entrance.webm": ["character/entrance.webm"],
  "entrance-white.mp4": ["character/entrance-white.mp4"],
  "entrance-transparent.webm": ["character/entrance-transparent.webm"],
  "entrance-poster.webp": ["character/entrance-poster.webp"],
  "entrance-corrected-poster.webp": ["character/entrance-corrected-poster.webp"],
  "character-still.webp": ["character/character-still.webp"],
  "character.png": ["character/character.png"],
  "portrait.webp": ["character/portrait.webp"],
  "portrait.jpg": ["character/portrait.jpg"],
  "resume.pdf": ["resume.pdf"],
} as const;

type AssetName = keyof typeof assetFiles;
type VideoType = "video/webm" | "video/mp4";
type VideoBackdrop = "studio" | "transparent" | "white";
type VideoSource = { src: string; type: VideoType; backdrop: VideoBackdrop };

const entrancePlaybackRate = 1.25;

const entranceAssets = [
  { file: "entrance.webm", type: "video/webm", backdrop: "studio" },
  { file: "entrance.mp4", type: "video/mp4", backdrop: "studio" },
  { file: "entrance-transparent.webm", type: "video/webm", backdrop: "transparent" },
  { file: "entrance-white.mp4", type: "video/mp4", backdrop: "white" },
] as const satisfies readonly { file: AssetName; type: VideoType; backdrop: VideoBackdrop }[];

export type CharacterMedia = {
  poster: string | null;
  still: string | null;
  entrance: VideoSource[];
  playbackRate: number;
};

const assetTypes = {
  mp4: "video/mp4",
  webm: "video/webm",
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  pdf: "application/pdf",
} as const;

function isAssetName(name: string): name is AssetName {
  return Object.hasOwn(assetFiles, name);
}

export function getMediaFile(name: string) {
  if (!isAssetName(name)) return null;
  const path = assetFiles[name]
    .map((file) => join(process.cwd(), file))
    .find((file) => existsSync(file));
  if (!path) return null;
  const extension = name.split(".").at(-1) as keyof typeof assetTypes;
  return { path, type: assetTypes[extension] };
}

export function getMediaAssetNames() {
  return Object.keys(assetFiles).filter((name) => getMediaFile(name));
}

function mediaUrl(name: AssetName) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return getMediaFile(name) ? `${basePath}/media/${name}` : null;
}

export function getPortfolioMedia(): { character: CharacterMedia | null; portrait: string | null; resume: string | null } {
  const still = mediaUrl("character-still.webp") ?? mediaUrl("character.png");
  const entrance = entranceAssets.flatMap(({ file, type, backdrop }) => {
    const src = mediaUrl(file);
    return src ? [{ src, type, backdrop }] : [];
  });
  const backdrop = entrance[0]?.backdrop ?? "studio";
  const poster = mediaUrl(backdrop === "studio" ? "entrance-poster.webp" : "entrance-corrected-poster.webp");
  return {
    character: entrance.length || still || poster ? {
      still,
      poster,
      entrance,
      playbackRate: entrancePlaybackRate,
    } : null,
    portrait: mediaUrl("portrait.webp") ?? mediaUrl("portrait.jpg"),
    resume: mediaUrl("resume.pdf"),
  };
}
