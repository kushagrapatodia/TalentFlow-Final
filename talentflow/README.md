# TalentFlow – Mini Hiring Platform (Front-end Only)

Stack
- React + Vite + TypeScript
- React Router, TanStack Query
- MSW (mock REST) + Dexie (IndexedDB persistence)
- DnD Kit, TanStack Virtual
- Zod + React Hook Form

Dev
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview build

Data & API
- MSW mocks the REST API with latency and random write failures.
- All writes go to IndexedDB via Dexie; state restores on refresh.

Features
- Jobs: list, filter/search, sort, create/edit, archive/unarchive, drag-to-reorder with optimistic rollback.
- Candidates: virtualized list with search/filter; profile timeline; kanban stage moves.
- Assessments: builder with sections/questions, conditional questions, live preview, local submission.

Design
- Sticky gradient header, compact inputs and tables, cards, and toasts.
- View toggle for Candidates (List/Kanban), smooth drag and drop.

Troubleshooting
- If MSW worker fails to load, ensure `public/mockServiceWorker.js` exists: `npx msw init public --save`.
