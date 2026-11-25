import { existsSync } from "node:fs";
import { join } from "node:path";

const assetFiles = {
  "entrance-optimized.mp4": ["character/entrance-optimized.mp4"],
  "idle-loop-optimized.mp4": ["character/idle-loop-optimized.mp4"],
  "entrance-poster.jpg": ["character/entrance-poster.jpg"],
  "idle-poster.jpg": ["character/idle-poster.jpg"],
  "character-still.webp": ["character/character-still.webp"],
  "character.png": ["character/character.png"],
  "portrait.webp": ["character/portrait.webp"],
  "portrait.jpg": ["character/portrait.jpg"],
  "resume.pdf": ["resume.pdf"],
} as const;

type AssetName = keyof typeof assetFiles;

export type CharacterMedia = {
  poster: string | null;
  still: string | null;
  entrance: string | null;
  entranceSpeed: number;
  idle: string | null;
  idlePoster: string | null;
};

function mediaUrl(name: AssetName) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const file = assetFiles[name].find((candidate) => existsSync(join(process.cwd(), "public", candidate)));
  return file ? `${basePath}/${file}` : null;
}

export function getPortfolioMedia(): { character: CharacterMedia | null; portrait: string | null; resume: string | null } {
  const still = mediaUrl("character-still.webp") ?? mediaUrl("character.png");
  const entrance = mediaUrl("entrance-optimized.mp4");
  const poster = mediaUrl("entrance-poster.jpg");
  return {
    character: entrance || still || poster ? {
      still,
      poster,
      entrance,
      entranceSpeed: 1.25,
      idle: mediaUrl("idle-loop-optimized.mp4"),
      idlePoster: mediaUrl("idle-poster.jpg"),
    } : null,
    portrait: mediaUrl("portrait.webp") ?? mediaUrl("portrait.jpg"),
    resume: mediaUrl("resume.pdf"),
  };
}
