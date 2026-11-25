import { readFile } from "node:fs/promises";
import { getMediaAssetNames, getMediaFile } from "@/content/media";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getMediaAssetNames().map((asset) => ({ asset }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params;
  const file = getMediaFile(asset);
  if (!file) return new Response(null, { status: 404 });

  const bytes = await readFile(file.path);
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": file.type, "Content-Length": String(bytes.byteLength) },
  });
}
