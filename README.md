# Chanuth Abeynayake · Engineering Portfolio

A static Next.js portfolio built with TypeScript, Tailwind CSS, Motion, and Lucide. The site can be deployed from the `out/` directory.

## Run locally

Use Node.js 20.9 or later. Install with `npm ci` when `package-lock.json` exists, or use `npm install` to create it on the first install.

```sh
npm run dev
```

Open `http://localhost:3000` for development. Build and serve the production export for browser and Lighthouse checks.

```sh
npm run build
npm run typecheck
```

The production build expects a `/port/` URL prefix. To preview it locally, copy the contents of `out/` into a `port/` subdirectory of a temporary preview directory. From that temporary parent directory, run `npx --yes serve . --listen 4173` and open `http://localhost:4173/port/`.

Run Chrome DevTools Lighthouse in mobile mode. The portfolio targets at least 90 for performance and 95 for accessibility. Record the actual scores from the production export. Confirm keyboard navigation, the ID card, toolkit, project disclosures, diagram buttons, copied email, and résumé download. Check the smallest supported viewport for horizontal scrolling. On desktop and mobile, confirm that scrolling away and back leaves the entrance at its final frame. Check the static portrait with reduced motion enabled.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Page layout, metadata, site styles, and static media route |
| `src/components/` | Hero playback, navigation, ID card, toolkit, work showcase, diagrams, and contact controls |
| `src/content/portfolio.ts` | Typed biography, skills, projects, contribution snapshots, timeline, and contact links |
| `src/content/media.ts` | Source media discovery and browser URL mapping |
| `character/` | Supplied images and videos, plus optional web encodes |
| `resume.pdf` | The original PDF offered by the résumé download link |

## Update content

Edit `src/content/portfolio.ts` and rebuild. Project entries support repository, live-site, and write-up links. Architecture diagrams are optional. Each diagram connection references a node ID, and each illustrative diagram carries a visible label.

Pull request states are recorded as verified snapshots. Update `status` and `verifiedOn` after checking the original pull request. The website uses the saved data at build time and links to GitHub for the live state. Technology marks use pinned Devicon assets in their original colors with a local icon fallback when the asset is unavailable.

## Character assets

The project reads the supplied `character/entrance.mp4`, `character/character.png`, and `character/portrait.jpg` during the build. The `/media` route copies their responses into the static export. Optional encodes are discovered by filename during the next build.

| Optional file in `character/` | Role |
| --- | --- |
| `entrance-white.mp4` | Pure-white entrance fallback |
| `entrance-transparent.webm` | Transparent entrance fallback with an alpha channel |
| `entrance.webm` | Preferred entrance with the studio backdrop |
| `entrance-optimized.mp4` | Replaces the original MP4 as the compatibility source |
| `entrance-poster.webp` | First decoded frame of the delivered entrance clip, used as the native video poster |
| `entrance-corrected-poster.webp` | Matching first frame for a corrected entrance, with a transparent or pure-white background |
| `character-still.webp` | Optional final-frame portrait for visitors who start with reduced motion |
| `portrait.webp` | Smaller version of the developer ID photograph |

The entrance uses one video element from its first frame through its final pose. The native poster is used when the matching first-frame file exists. Without it, the video surface starts white and shows the first frame once it has decoded. The original character image is reserved for the reduced-motion or missing-video fallback. A pause button appears during clips longer than five seconds.

If FFmpeg is available, these optional commands generate assets from the supplied files. Compare the output to the original at desktop and mobile display sizes before replacing the source.

```sh
ffmpeg -i character/entrance.mp4 -an -vf "scale=-2:'min(trunc(ih/2)*2,960)':flags=lanczos" -c:v libvpx-vp9 -crf 29 -b:v 0 -row-mt 1 -pix_fmt yuv420p character/entrance.webm
ffmpeg -i character/entrance.mp4 -an -vf "scale=-2:'min(trunc(ih/2)*2,960)':flags=lanczos" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart character/entrance-optimized.mp4
ffmpeg -i character/entrance.mp4 -frames:v 1 -c:v libwebp -quality 90 character/entrance-poster.webp
ffmpeg -sseof -0.15 -i character/entrance.mp4 -frames:v 1 -vf "scale=-2:'min(ih,960)':flags=lanczos" -c:v libwebp -quality 87 character/character-still.webp
ffmpeg -i character/portrait.jpg -frames:v 1 -vf "scale=480:-2:flags=lanczos" -c:v libwebp -quality 88 character/portrait.webp
```

### Reframe or correct the video source

The hero can display the frame up to 55% wider than its desktop column, capped by the available height. This trims the sides around a centered subject and preserves the full vertical frame. Check that the head, elbows, and shoes remain visible throughout the walk at each layout size.

To reduce blank space baked into the clip, inspect the full sequence and use a single fixed crop that clears the head, elbows, and shoes in every frame. Measure the height of the final standing figure. A crop height near that measurement divided by `0.875` targets 85–90% figure coverage in the frame. Increase that height if the person needs more clearance anywhere during the walk. Keep clear space between the shoes and the bottom edge so the narrow edge feather affects the floor only.

For FFmpeg, replace `WIDTH`, `HEIGHT`, `LEFT`, and `TOP` with measured pixel values. Use even values for the H.264 export.

```sh
ffmpeg -i character/entrance.mp4 -vf "crop=WIDTH:HEIGHT:LEFT:TOP" -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart character/entrance-optimized.mp4
```

The hero uses a vertical gradient sampled from the studio backdrop. The frame edges feather into that gradient without color filters. For a transparent or pure-white fallback export, isolate the person with a tracked mask in a video editor. Refine the mask around the hair, clothing, fingers, and shoes. Keep the same canvas, subject scale and position, frame rate, and full crossed-arm pose as the entrance currently used on the site. Preserve the soft contact shadow.

Export a separate `entrance-transparent.webm` with alpha, or composite the person and shadow over pure `#ffffff` and export `entrance-white.mp4`. Place the export in `character/` alongside the original. The studio WebM and MP4 sources take priority, followed by the transparent WebM and white MP4. The transparent format uses its own alpha channel for the edges. If a fallback format is the primary source, save its matching first frame as `entrance-corrected-poster.webp` to show it while the video loads.

After cropping a clip that still uses the original backdrop, extract `entrance-poster.webp` from `entrance-optimized.mp4` using the first-frame command above with the adjusted input. If `entrance.webm` is present, regenerate it from the same cropped source. This keeps the poster and both original-background variants aligned.

## Deploy to GitHub Pages

1. Include `package-lock.json` in the repository. If needed, run `npm install` locally to generate it. The workflow uses `npm ci` on Node.js 24.
2. In the repository settings, open **Pages** and select **GitHub Actions** as the source under **Build and deployment**.
3. Push the project files to `main`. The workflow builds and publishes the `out/` directory. Keep the source files in `character/` and `resume.pdf` in the repository so the build can export them.
4. Once the workflow succeeds, open the [portfolio on GitHub Pages](https://chanuth412-pixel.github.io/port/) and verify the entrance video, résumé download, and fonts.

Next.js applies `/port` to production framework assets. The same base path prefixes the local media URLs. Development uses the root path.
