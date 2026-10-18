# The Hill: film concept preview

Concept preview, not affiliated with The Hill (Hudson Valley Weddings at The Hill), 65 Bells Pond Rd, Hudson, NY.

## Motion: illustrative, generated from the venue's photos, not filmed
The three scroll-scrubbed film sequences in `film/` are **AI-generated motion** made from The Hill's own photos (image-to-video, first/last-frame mode). Every film carries the on-screen label "Illustrative motion generated from The Hill's photos, not filmed". Small generated details can differ from the real place, so a visit or call is the way to confirm anything you see.

v4 (this version): only clean stretches of the generated clips are used. Each place is its own shot, and shots are joined by a short dip through dark (a cut under black), so **no frame shows two scenes at once**: no crossfades and no double exposures. Where a shot holds still, the camera move (a slow push or sideways truck) is a crop of the 2x frames, i.e. a real continuous move, never a dissolve. The dip is also drawn by an overlay that follows the scroll position, so it shows even before its frames have loaded.

| Sequence | Frames | Shots (source clip, frames at 24 fps) |
|---|---|---|
| film/hero (arrival) | 57 | The walk up to the Palladian Barn, ending before the ground-floor doors open onto the interior (c1 0–63) → dark → upstairs, the reception floor, captioned "Upstairs" (c1 141–192 + c2 1–18, slow push) |
| film/grounds | 57 | The field arch (c4 0–96) → dark → the hilltop ceremony lawn toward the pines (c3 0–60) → dark → the Art Barn (c3 150–192, slow push) |
| film/night ("the last song") | 47 | String lights (c2 72–102) → dark → the lanterns (c2 171–192 + c5 1–12) → dark → outside, the barn front where the couple dances (c5 150–192, slow push) |

The moves that misrepresented the building were cut: the upstairs hall is never seen through the ground-floor doors, and the barn front is never seen from inside the barn.

Frames come from the clips' 2x upscales (an AI video upscaler, 2560×1440), sampled at 10 fps (hero, night) and 6.5 fps (grounds), with sampling evened out by measured motion so the door push doesn't lurch. `m/` is a 1080×1440 crop for portrait screens and `d/` is 1920×1080 for landscape, so frames are never drawn above 1.0x at common sizes. Frames are **AVIF**: each frame gets the lowest quality that still matches its lossless master closely (luma SSIM target per film, quality never below 32). A **WebP** copy (q70) of every frame is served to browsers without AVIF. Totals: m/ AVIF about 5.3 MB, d/ AVIF about 7.8 MB. Frame indices map linearly to scroll progress.

Loading: `poster-m` / `poster-d` (a copy of frame 0) is painted first. No frame is requested until the first scroll. The frames at the edges of each dip load first, then every 8th and every 4th frame, then the frames just ahead of the scroll position, and each film starts loading only as it nears the screen. The nearest loaded frame from the same shot is always drawn. With Save-Data or a 2G connection no frames load, and each film shows its poster under the captions. With reduced motion or JavaScript off, the page shows the hero poster (portrait on phones), the real photos and all of the copy. The recut and encode scripts are `film-work/build_v4.py` and `film-work/encode.py`, not deployed.

## Photos
All photos come from The Hill's own website, hudsonvalleyweddings.net, retrieved Oct 12, 2026. Photographers aren't named on the site.
Each was resized locally to JPG, WebP and AVIF, never larger than the source.

| Local file(s) | Shows | Source URL | Page |
|---|---|---|---|
| img/barn-front.* | Palladian Barn front | https://images.squarespace-cdn.com/content/v1/578645158419c25970ad739f/…/The-Hill-Hudson-Valley-Weddings.jpg | /your-wedding |
| img/palladian-barn.* | Palladian Barn exterior | https://images.squarespace-cdn.com/content/v1/578645158419c25970ad739f/…/Palladian_Barn.76140249.jpg | /about |
| img/barn-tables.* | Reception tables in barn | …/Courtney-Viren-The-Hill(89of175)-min.jpg | /photos |
| img/barn-lanterns.* | Lanterns in barn (800px source) | …/TheHill.JPG | /photos |
| img/art-barn.* | The Art Barn | https://images.squarespace-cdn.com/content/v1/578645158419c25970ad739f/2e8a4abc-df43-4235-9519-31f9631e7f32/the-art-barn.jpg | /photos |
| img/hilltop-ceremony.* | Hilltop ceremony chairs | …/Hudson-Valley-Hill-Grounds.jpg | /photos |
| img/horses.* | Horses at fence | …/horses.jpg | /photos |
| img/field-ceremony.* | Field ceremony with arch (800px source) | …/TheHill2.jpg | /photos |
| img/wagon-bar.* | Wagon bar | …/The-art-barn-outdoor-furniture+.jpg | /photos |

Full source URLs are listed in `sources.txt`.

- img/favicon.png: a simple shape drawn for this concept. It isn't their logo.
- No photo of the fire pit was found, so it appears only in the text.

## Facts
All facts are from hudsonvalleyweddings.net (/, /about, /your-wedding, /contact), retrieved Oct 12, 2026. They cover the season, capacity, inclusions, music times, the 22-a-year limit, history and contact details. The date-checker logic is reused unchanged from the QA-passed "next" concept; the copy is that QA-passed copy with v3 edits (officiant line, train line, story heading, de-duplicated film captions).

## Code
GSAP 3 and ScrollTrigger, self-hosted in `js/`. Fonts: Fraunces and Mulish (SIL Open Font License), self-hosted in `fonts/` (latin subset). `src/styles.css` is inlined into `index.html` by a small build script kept outside this repo (`film-work/the-hill-film-tools/build.py`, not deployed); edit `src/` and rebuild.
