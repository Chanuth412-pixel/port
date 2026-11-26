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

Run Chrome DevTools Lighthouse in mobile mode. The portfolio targets at least 90 for performance and 95 for accessibility. Record the actual scores from the production export. Confirm keyboard navigation, the ID card, toolkit, project disclosures, diagram buttons, copied email, and résumé download. Check the smallest supported viewport for horizontal scrolling. On desktop and mobile, verify the talking loop, muted autoplay fallback, and keyboard sound control. Scroll until less than 35% of the hero is visible and confirm playback pauses. Scroll back to confirm it resumes from the same point. Check the poster with reduced motion enabled.

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

Next.js serves `public/character/` as static files and prefixes the media URLs with `/port` in production.

| File in `public/character/` | Role |
| --- | --- |
| `talking.mp4` | Original 1280 × 720 source video |
| `talking.webm` | VP9 and Opus delivery copy |
| `talking-optimized.mp4` | Fast-start H.264 and AAC fallback |
| `talking-poster.webp` | Matching frame for startup and reduced motion |
| `portrait.jpg` | Developer ID photograph |

The hero plays the video inline with sound when the browser allows it. If sound is blocked, the video starts muted and the sound button pulses until the visitor enables audio. A click, tap, or keypress can enable audio until the visitor explicitly mutes it. Playback pauses in a hidden tab or below 35% hero visibility. Reduced motion uses the poster.

The delivery clips use a 480 × 720 center crop that preserves the full body through the gestures. The studio backdrop is normalized to white so it blends into the hero gradient. The 7.46-second loop keeps the original speech at its recorded speed. The opening and closing edits fall in silence, and a short fade brings the ending pose back to the opening pose. When replacing the clip, regenerate both delivery versions and the poster from the same crop and confirm the silhouette and loop at desktop and mobile sizes.

## Deploy to GitHub Pages

1. Include `package-lock.json` in the repository. If needed, run `npm install` locally to generate it. The workflow uses `npm ci` on Node.js 24.
2. In the repository settings, open **Pages** and select **GitHub Actions** as the source under **Build and deployment**.
3. Push the project files to `main`. The workflow builds and publishes the `out/` directory, including `public/character/` and `public/resume.pdf`.
4. Once the workflow succeeds, open the [portfolio on GitHub Pages](https://chanuth412-pixel.github.io/port/) and verify the talking video, résumé download, and fonts.

Next.js applies `/port` to production framework assets. The same base path prefixes the local media URLs. Development uses the root path.
