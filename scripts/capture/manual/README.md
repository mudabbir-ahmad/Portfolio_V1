# Hand-taken screenshots

For projects that can't be driven by a browser (Android, Java Swing, hardware),
drop images into a folder named after the project id, then run `npm run capture`:

    scripts/capture/manual/routines/   -> Routines App
    scripts/capture/manual/mass/       -> MASS (phone screenshots)
    scripts/capture/manual/radar/      -> 240 GHz Doppler Radar
    scripts/capture/manual/ai-bot/     -> AI Discord Bot

Files are copied in filename order (1.png, 2.png, ...). Use PNG, JPG or WebP.
Folder contents are gitignored, so only the processed copies in public/images/projects/ get committed.
