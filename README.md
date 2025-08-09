# Brand & Web PM — Web App (Netlify-ready)

This project is a LocalStorage-first project manager web app with:
- Boards (Kanban) with inline editing
- Timeline (Gantt) with drag-to-update
- My Day view
- Settings with Firebase sync toggle (placeholder), export/import JSON
- Sample data preloaded

## Run locally
1. npm install
2. npm run dev
3. Open http://localhost:5173

## Deploy to Netlify
1. Create a new site on Netlify and connect the repo (or drag-and-drop the `dist/` folder after `npm run build`)
2. Netlify will run `npm run build` and publish `dist/`

Notes:
- Firebase sync is not configured. The Settings screen has a toggle placeholder.
- No .env or API keys are included.
