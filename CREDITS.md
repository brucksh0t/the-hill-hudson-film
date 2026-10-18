# The Hill: film concept preview

Concept preview, not affiliated with The Hill (Hudson Valley Weddings at The Hill), 65 Bells Pond Rd, Hudson, NY.

## Motion: AI-generated from the venue's photos
The three scroll-scrubbed film sequences in `film/` are **AI-generated motion**. Each clip was made with an image-to-video model in first/last-frame mode, so it starts and ends on one of The Hill's own photos (listed below, cropped to 16:9). The motion between those photos (camera moves, the doors opening, the light and bokeh dissolves) is generated, not filmed. No buildings were added on purpose. Small generated details can differ from the real place, so a visit or call is the way to confirm anything you see.

| Sequence | Clips (first photo → last photo) |
|---|---|
| film/hero (arrival) | palladian-barn → barn-tables (push through the center doors); barn-tables → barn-lanterns (string lights dissolve into lanterns) |
| film/grounds | field-ceremony → hilltop-ceremony (through the arch); hilltop-ceremony → art-barn (through the pines) |
| film/night | barn-lanterns → barn-front (out through the doorway to the dusk facade) |

Chained clips share a photo as the last frame of one and the first frame of the next, with a 0.5 s soft blend at each join. Frames are WebP (quality 85), cut from the 720p clips after a 2× upscale with Topaz Video AI (Proteus) to 2560×1440: `d/` 1920×1080 for wider screens and `m/` 1080×1440 (the same center crop as before) for phones. The frame selection, joins and colour match the earlier 1120×630 / 450×600 sets. `poster-d.webp` / `poster-m.webp` are light copies of frame 0 for first paint. They stream in coarse-to-fine as you approach each sequence. With reduced motion or JavaScript off, the page shows the real photos and all of the copy instead.

## Photos
All photos come from The Hill's own website, hudsonvalleyweddings.net, retrieved Oct 12, 2026. Photographers aren't named on the site.
Each was resized locally to JPG and WebP, never larger than the source.

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
All facts are from hudsonvalleyweddings.net (/, /about, /your-wedding, /contact), retrieved Oct 12, 2026. They cover the season, capacity, inclusions, music times, the 22-a-year limit, history and contact details. The copy and the date-checker logic are reused unchanged from the QA-passed "next" concept.

## Code
GSAP 3 and ScrollTrigger, self-hosted in `js/`.
