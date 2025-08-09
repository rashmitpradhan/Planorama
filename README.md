# Planorama

Planorama is a local-first project manager for branding & website projects. Built with **React + Vite** and **Material UI v5** with drag-and-drop Kanban, a Gantt-style timeline, and a focused **My Day** view.

## Quick start (Local)

```bash
npm install
npm run dev
# open http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Netlify Deploy

1. Create a new site on Netlify and link this repo or drag-and-drop the folder.
2. Ensure the build settings are:
   - **Build command:** `npm ci && npm run build`
   - **Publish directory:** `dist`
3. Deploy.

## Features

- **Boards (Kanban):** Backlog → In Progress → Review → Completed. Drag & drop tasks across columns.
- **Timeline (Gantt):** Drag bars to adjust start/end; changes persist to LocalStorage.
- **My Day:** See tasks due **today** across all projects + add personal My Day tasks.
- **CRUD:** Create/edit/delete projects and tasks.
- **Local-first:** Everything is stored in `localStorage`.
- **Settings:** toggle (placeholder) Firebase sync, Export/Import JSON (merge or replace).

## Firebase Sync (optional & off by default)

- See `src/utils/firebaseSync.js` for commented hooks. No keys or deps required to run locally.
- Later, add Firebase SDK, fill config, and enable calls in `storage.js`.

## Data
Data schema stored under `planorama_state` in LocalStorage:
```ts
type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'Backlog'|'In Progress'|'Review'|'Completed';
  dueDate?: string; // YYYY-MM-DD
  start?: string;   // YYYY-MM-DD
  end?: string;     // YYYY-MM-DD
  myDay?: boolean;
}
type Project = {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
type AppState = {
  projects: Project[];
  myDayOnly: { id: string; title: string; done: boolean; }[]
}
```

## Import & Export
- **Export** creates a file named `planorama_export_YYYYMMDD.json`.
- **Import** validates the shape and merges (default) or replaces (toggle).

## Versions (pinned)
- React 18.3.1
- Vite 5.4.2 / @vitejs/plugin-react 4.3.1
- MUI 5.15.14 (+ Emotion 11.14.x)
- @dnd-kit/core 6.3.1 & @dnd-kit/sortable 10.0.0
- gantt-task-react 0.3.9

> If `npm ci` complains about the simulated lockfile, delete `package-lock.json` and run `npm install` to regenerate, then commit the new lockfile.
