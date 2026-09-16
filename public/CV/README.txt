CV FOLDER
=========

Drop your CV PDF in this folder (public/CV/).

It will be served at:  /CV/<your-file>.pdf

The download button on the site links to the path set in ONE place:
    src/content.js  ->  profile.cvUrl  (currently "/CV/Bob-CV.pdf")

So either:
  1. name your file exactly "Bob-CV.pdf", or
  2. change profile.cvUrl in src/content.js to match your filename.

No build config changes needed — Vite serves everything in public/ as-is,
in dev and in the production build (and inside a container later).
