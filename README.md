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

Run Chrome DevTools Lighthouse in mobile mode. The portfolio targets at least 90 for performance and 95 for accessibility. Record the actual scores from the production export. Confirm keyboard navigation, the ID card, toolkit, project disclosures, diagram buttons, copied email, and résumé download. Check the smallest supported viewport for horizontal scrolling. On desktop and mobile, confirm that scrolling away and back keeps the character in the final pose or idle loop without replaying the entrance. Check the static portrait with reduced motion enabled.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Page layout, metadata, and site styles |
| `src/components/` | Hero playback, navigation, ID card, toolkit, work showcase, diagrams, and contact controls |
| `src/content/portfolio.ts` | Typed biography, skills, projects, contribution snapshots, timeline, and contact links |
| `src/content/media.ts` | Source media discovery and browser URL mapping |
| `public/character/` | Supplied images and videos, plus optional web encodes |
| `public/resume.pdf` | The original PDF offered by the résumé download link |

## Update content

Edit `src/content/portfolio.ts` and rebuild. Project entries support repository, live-site, and write-up links. Architecture diagrams are optional. Each diagram connection references a node ID, and each illustrative diagram carries a visible label.

Pull request states are recorded as verified snapshots. Update `status` and `verifiedOn` after checking the original pull request. The website uses the saved data at build time and links to GitHub for the live state. Technology marks use pinned Devicon assets in their original colors with a local icon fallback when the asset is unavailable.

## Character assets

Next.js serves `public/character/` and `public/resume.pdf` as static files. The player requests `/character/entrance-optimized.mp4` and `/character/idle-loop-optimized.mp4` in development. The production build adds `/port` to both URLs.

| File in `public/character/` | Role |
| --- | --- |
| `idle.mp4` | Original standing animation used to make the ping-pong loop |
| `entrance.mp4`, `idle-loop.mp4` | Source footage and the eased ping-pong master |
| `entrance-optimized.mp4`, `idle-loop-optimized.mp4` | Silent H.264 Main Profile, YUV420p, fast-start delivery copies |
| `entrance-poster.jpg`, `idle-poster.jpg` | Matching stills for loading and autoplay fallback |
| `character-still.webp` | Optional final-frame portrait for visitors who start with reduced motion |
| `portrait.webp` | Smaller version of the developer ID photograph |

The entrance plays once at 1.25×. Idle preloading begins after the entrance starts and the page's load event has fired. The last entrance frame remains visible until the browser starts looping the idle at normal speed. Autoplay rejection displays the matching poster and retries the active clip on a trusted tap, click, or keypress. Both clips pause offscreen or in a hidden tab. Reduced motion shows a static portrait. The ping-pong master skips the abrupt first frame of `idle.mp4` and eases both reversals. When it changes, regenerate the delivery copy and review the handoff in browser playback.

If FFmpeg is available, these optional commands generate assets from the supplied files. Run them from `public/` so the paths resolve. Compare the output to the original at desktop and mobile display sizes before replacing the source.

```sh
ffmpeg -i character/entrance.mp4 -map 0:v:0 -an -c:v libx264 -preset slow -crf 19 -profile:v main -level:v 3.1 -pix_fmt yuv420p -movflags +faststart character/entrance-optimized.mp4
ffmpeg -i character/idle-loop.mp4 -map 0:v:0 -an -c:v libx264 -preset slow -crf 19 -profile:v main -level:v 3.1 -pix_fmt yuv420p -movflags +faststart character/idle-loop-optimized.mp4
ffmpeg -i character/entrance-optimized.mp4 -frames:v 1 -q:v 3 character/entrance-poster.jpg
ffmpeg -i character/idle-loop-optimized.mp4 -frames:v 1 -q:v 3 character/idle-poster.jpg
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

The hero uses a vertical gradient sampled from the studio backdrop. The frame edges feather into that gradient without color filters. Match the existing 1280 × 720 canvas, subject scale, frame rate, crossed-arm pose, and soft contact shadow when preparing a new delivery clip. Extract a fresh JPEG poster from each revised delivery copy so the still and video align.

## Deploy to GitHub Pages

1. Include `package-lock.json` in the repository. If needed, run `npm install` locally to generate it. The workflow uses `npm ci` on Node.js 24.
2. In the repository settings, open **Pages** and select **GitHub Actions** as the source under **Build and deployment**.
3. Push the project files to `main`. The workflow builds and publishes the `out/` directory, including `public/character/` and `public/resume.pdf`.
4. Once the workflow succeeds, open the [portfolio on GitHub Pages](https://chanuth412-pixel.github.io/port/) and verify the entrance video, résumé download, and fonts.

Next.js applies `/port` to production framework assets. The same base path prefixes the local media URLs. Development uses the root path.
