# TalentFlow – A Mini Hiring Platform (Front-End Only)

## Overview
TalentFlow is a React application for HR teams to manage jobs, candidates, and assessments—all running fully in the browser with no backend. The app uses MSW (Mock Service Worker) to simulate a REST API and Dexie (IndexedDB) for local persistence. All data and state are local to the user’s browser.

---

## Features

### 1. Jobs
- List with server-like pagination & filtering (title, status, tags)
- Create/Edit job in a modal or route (title required, unique slug)
- Archive/Unarchive jobs
- Reorder jobs via drag-and-drop (optimistic updates, rollback on failure)
- Deep link to a job: `/jobs/:jobId`

### 2. Candidates
- Virtualized list (1000+ seeded candidates) with client-side search (name/email) and server-like filter (stage)
- Candidate profile route: `/candidates/:id` with timeline of status changes
- Move candidates between stages with a kanban board (drag-and-drop)
- Attach notes with @mentions (rendered, suggestions from local list)

### 3. Assessments
- Assessment builder per job: add sections and questions (single-choice, multi-choice, short text, long text, numeric with range, file upload stub)
- Live preview pane renders the assessment as a fillable form
- Persist builder state and candidate responses locally
- Form runtime with validation rules (required, numeric range, max length) and conditional questions (e.g., show Q3 only if Q1 === “Yes”)

---

## Data & API (No Real Server)
- Uses MSW to simulate a REST API:
  - `GET /jobs?search=&status=&page=&pageSize=&sort=`
  - `POST /jobs`
  - `PATCH /jobs/:id`
  - `PATCH /jobs/:id/reorder` (occasionally returns 500 to test rollback)
  - `GET /candidates?search=&stage=&page=`
  - `POST /candidates`
  - `PATCH /candidates/:id` (stage transitions)
  - `GET /candidates/:id/timeline`
  - `GET /assessments/:jobId`
  - `PUT /assessments/:jobId`
  - `POST /assessments/:jobId/submit` (store response locally)
- All persistence is local (IndexedDB via Dexie)
- On refresh, the app restores state from IndexedDB
- Artificial latency (200–1200ms) and 5–10% error rate on write endpoints

---

## Seed Data
- 25 jobs (mixed active/archived)
- 1,000 candidates randomly assigned to jobs and stages
- At least 3 assessments with 10+ questions each

---

## Setup & Running Locally
1. **Clone the repo:**
	```sh
	git clone <https://github.com/kushagrapatodia/TalentFlow-Final.git>
	cd talentflow
	```
2. **Install dependencies:**
	```sh
	npm install
	```
3. **Start the app:**
	```sh
	npm run dev
	```
4. **Open in browser:**
	Visit [http://localhost:5173](http://localhost:5173)

---

## Deployment
- Deployed as a static SPA (no backend/serverless functions)
- All data and logic run in the browser
- [https://talent-flow-final-70qn5gqiw-kushagrapatodias-projects.vercel.app/](#)
- [https://github.com/kushagrapatodia/TalentFlow-Final.git](#) 

---

## Architecture & Technical Decisions
- **React + Vite** for fast development and modern build
- **MSW** for API mocking in all environments (dev & production)
- **Dexie (IndexedDB)** for local persistence
- **React Query** for data fetching and caching
- **Component-based structure** for maintainability
- **All state and data are local to the browser** (no cross-user data)
- **Service worker** is started in all environments for full mock API support
- **Recommended browser:** Chrome (best service worker support)

---

## Known Issues / Limitations
- Data is not shared between users or devices
- Clearing browser storage will erase all data
- Some browsers (e.g., Opera, Safari) may have quirks with service workers/MSW
- For best results, use Chrome

---

## Bonus Features
- Drag-and-drop reordering for jobs and candidates
- Optimistic UI with rollback on API error
- Conditional logic in assessment forms
- Virtualized candidate lists for performance

---

## License
MIT
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
