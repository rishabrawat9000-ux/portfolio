# Rishab Rawat — Portfolio

A responsive React portfolio inspired by the Framer template, featuring selected GitHub projects, education, skills, contact links, a print-ready student resume, slower scroll reveals, lifted project cards, animated organic blobs throughout the page, brain and lightbulb illustrations aligned with their section labels, an interactive pin that swings the profile card, an upright clickable takeoff rocket, and a pen that draws an animated accent.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check the production build and lint the source:

```sh
npm run build
npm run lint
```

## Production deployment

Build the static site with `npm run build`. The deployable files are written to `dist/`; upload that directory to your static hosting provider. Run `npm run preview` to inspect the production build locally before publishing.

## Resume

Use **Save as PDF** in the Resume section and choose “Save to PDF” in the browser’s print dialog. The print stylesheet limits the printed page to the resume.

## Updating content

Edit the project details, skills, education, and contact links in `src/App.tsx`. The profile avatar is loaded from the public GitHub profile; replace its image URL if you want to use a different photo.
