import { existsSync } from "node:fs";
import { join } from "node:path";

const assetFiles = {
  "talking-optimized.mp4": ["character/talking-optimized.mp4"],
  "talking.webm": ["character/talking.webm"],
  "talking-poster.webp": ["character/talking-poster.webp"],
  "portrait.webp": ["character/portrait.webp"],
  "portrait.jpg": ["character/portrait.jpg"],
  "resume.pdf": ["resume.pdf"],
} as const;

type AssetName = keyof typeof assetFiles;

export type CharacterMedia = {
  mp4: string | null;
  webm: string | null;
  poster: string | null;
};

function mediaUrl(name: AssetName) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const file = assetFiles[name].find((candidate) => existsSync(join(process.cwd(), "public", candidate)));
  return file ? `${basePath}/${file}` : null;
}

export function getPortfolioMedia(): { character: CharacterMedia | null; portrait: string | null; resume: string | null } {
  const mp4 = mediaUrl("talking-optimized.mp4");
  const webm = mediaUrl("talking.webm");
  const poster = mediaUrl("talking-poster.webp");
  return {
    character: mp4 || webm || poster ? { mp4, webm, poster } : null,
    portrait: mediaUrl("portrait.webp") ?? mediaUrl("portrait.jpg"),
    resume: mediaUrl("resume.pdf"),
  };
}
