Project screenshots, written here by `npm run capture` (see scripts/capture/README.md).

Each project's "images" list in src/data/projects.json names files from this folder:

  "images": ["mass-1.webp", "mass-2.webp", "mass-3.webp"],
  "orientation": "portrait"

One filename = a single picture. Two or more = a carousel (arrows, dots, swipe,
keyboard left/right). "orientation" is "portrait" for phone screenshots and
"landscape" for everything else. Leave the list empty to fall back to "image".

radar-1, ai-bot-1 and homelab-1 are stock photos from Unsplash (Unsplash licence,
free to use), standing in until there are real photos of those projects.
