# Motion upgrade

Branch: `motion-upgrade`. Nothing here is deployed. Run it, look at it, then merge
or tell me what to change.

```bash
npm install
npm run dev
```

---

## The finding that drove everything else

`next.config.ts` had a `beforeFiles` rewrite serving `public/demos/kumail-sphere.html`
at `/`. Its comment said the React homepage was "retired".

The effect was that the entire React app was unreachable. The work grid, skills,
experience, contact form and every `/demos/*` route were built, tested and deployed, and
could only be found by typing the URL. A recruiter landing on the domain saw one static
screen and had no path to any of it.

The static file also brought its own problems: Playfair Display and Inter loaded from
Google Fonts, which the rest of the app does not use, and 1.7MB of JPEGs for thumbnails
that never render wider than about 180px.

The sphere was the good part. So it has been rebuilt properly and made the hero of the
real homepage, and the rewrite is gone. The original file still serves at
`/demos/kumail-sphere.html` if you want them side by side.

---

## What changed

### The sphere is real WebGL now

`src/components/project-sphere.tsx`, built on the `@react-three/fiber` and `three` that
were already in your dependencies.

The old one was 29 `<img>` tags on CSS `preserve-3d`. That reads convincingly but cannot
do the things that actually sell the effect. The new one gets, essentially for free:

- **Depth fade.** Faces on the far side drop to 16% opacity. This is the single cheapest
  thing that makes it read as a sphere rather than stickers on glass. The old version had
  the back half at full strength competing with the front half, which is why the headline
  was fighting for attention.
- **Hover isolation.** The hovered screenshot scales to 1.32 and goes fully opaque while
  every other face drops to 35%. You can actually look at one thing.
- **Click through.** Each face maps to its project route, so the sphere is navigation.
- **Drag with inertia**, with the throw carried and then damped.
- **Scroll coupling.** Scrolling the page rotates the sphere, which is the reason to
  scroll past the hero slowly instead of jumping it.

Points are distributed with a golden-angle Fibonacci spiral, so spacing is even rather
than clustering at the poles the way naive lat/long does.

Drag state and scroll progress live in refs and are read inside `useFrame`. Neither ever
touches React state, so dragging and scrolling never re-render the tree.

### Smooth scroll and one animation loop

`src/components/smooth-scroll.tsx`, mounted once in the root layout.

Lenis wraps native scroll, so sticky positioning, anchor links and keyboard scrolling
keep working. It is stepped from the GSAP ticker rather than its own
`requestAnimationFrame`, and `lagSmoothing(0)` is set, so the page has exactly one
animation loop. Two independent loops is the usual reason scroll work stutters.

`ScrollTrigger.refresh()` fires on `document.fonts.ready`, because anything pinned or
scrubbed measures wrong if it is laid out before the webfonts reflow the text.

### The hero contrast failure is fixed

The headline was white Playfair absolutely positioned over the busiest part of the
sphere, defended by a `text-shadow`. A text-shadow is not a scrim, and where a light
screenshot drifted underneath it the headline partly disappeared.

It now sits on a real gradient scrim: opaque behind the copy column, clearing to nothing
on the right so the sphere still reads. On mobile the column is full width, so the
gradient runs bottom-to-top instead of left-to-right.

### Mobile

- The headline used fixed breakpoint sizes and overflowed at 375px, clipping its last
  character. It is now `clamp(2rem, 7vw, 3.75rem)` and never exceeds the column.
- The bio paragraph disappeared entirely on mobile in the old static page. The value
  proposition is now in the normal document flow and always present.
- The giant ghost "SPIN" watermark that collided with the headline is gone.

### Images

19 screenshots, resized to 512px wide and converted to WebP at q82, in `public/projects`.

| | before | after |
|---|---|---|
| sphere imagery | 1,717 KB | 217 KB |

87% smaller. They were 420x280 JPEGs rendering at roughly 140x92.

### Fonts

Moved from `next/font/google` to `@fontsource-variable/geist` and `geist-mono`.

Both approaches self-host the files. The difference is that `next/font/google` downloads
them from `fonts.googleapis.com` at build time, so the build needs network access to
Google and fails in an offline or restricted CI environment. The fontsource packages ship
the woff2 files in `node_modules`, which makes the build hermetic. Same two families,
same CSS variable names, nothing downstream changed.

The built output emits 11 woff2 files locally and contains no runtime Google Fonts
request.

---

## Cost, stated honestly

The sphere pulls in three.js, which is roughly 240KB gzipped. It is dynamically imported
with `ssr: false`, so it is not in the initial bundle and loads after the headline has
painted, but it is a real cost and worth knowing.

Net against the old homepage: 1,500KB less imagery, 240KB more JavaScript. The JS caches
across visits and across routes; the images did not. Still a clear win, and the thing it
buys is the part people remember.

---

## What I could not verify

I have no headless browser in this environment and the preview pane cannot reach a dev
server I start, so **I have not seen this render**. The build compiles, TypeScript passes
clean, and all 13 routes generate. Everything about the visual result is reasoned from
the code, not observed.

Run `npm run dev` and look at it before merging. Three things to check first:

1. The sphere at 375px. `viewport.width / 8.2` should keep it inside the frame, but that
   constant is the kind of thing that wants a real device.
2. Whether the scroll coupling feels right. It is `0.015` per unit of viewport scrolled
   in `project-sphere.tsx`. Easy to dial.
3. Hover on a trackpad. The 1.32 scale and 35% dim are a judgement call.

---

## Not done

- **The 3D work stops at the hero.** The sections below it (work grid, skills,
  experience, contact) have no scroll-driven motion yet. Lenis and GSAP are wired and
  ready, so pinned case studies or a horizontal pan through the projects are
  straightforward from here.
- **`/demos/kumail-sphere.html` is still in `public`.** Kept deliberately for comparison.
  Delete it once you have decided, along with `public/demos/kumail-sphere-img/`, which
  is the 1.8MB of originals and is no longer referenced by anything.
