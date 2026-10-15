# QuickFix — IT Help Desk & Incident Management System
*Problems happen. Solutions start here.*

A React + Vite frontend with a fully dark "Cyberpunk Orchid" theme. It runs entirely in **demo mode** (localStorage); no backend is needed.

## Features
Role-based demo (Employee / Agent / Administrator), dashboard with Recharts, My Tickets, All Incidents, ticket creation and details (comments, internal notes, assign, accept, resolve, reopen, escalate), Agent Workspace, simulated SLA monitoring, reports with CSV export, knowledge base, user management and settings.

## Prerequisites (Windows + VS Code)
Install Node.js 18 or newer (LTS) and VS Code. Open the project folder in VS Code, then use **Terminal > New Terminal**.

## Commands
```
npm install
npm run dev      # http://localhost:5173
npm test
npm run build
```

## Demo accounts
Use the Employee / Agent / Administrator buttons on the login page, or switch role from the topbar. Typed logins accept any password of 4+ characters with a seeded email, for example `priya.sharma@quickfix.demo`. **This is not authentication.**

## Data and persistence
Keys in localStorage: `qf_tickets`, `qf_users`, `qf_session` (a user id only), `qf_prefs`, `qf_kb_votes`. Corrupt data falls back to seed data. Settings > Reset demo data restores everything. Ticket timestamps are generated relative to first load, then kept.

## Folder structure
`src/components` (layout, common, tickets, charts, dashboard), `src/pages`, `src/context` (Auth, Ticket), `src/services` (API layer), `src/utils` (SLA, tickets, reports, validation, permissions), `src/data` (seed data, articles), `src/test`.

## Connecting Spring Boot
1. Copy `.env.example` to `.env`, set `VITE_DATA_MODE=api` and `VITE_API_BASE_URL=http://localhost:8080/api`.
2. Implement the endpoints below and enable CORS for `http://localhost:5173`.
3. `src/services/*` already contain the Axios calls. The pages still read tickets from `TicketContext` in this version, so the next step is to make `TicketContext` call `ticketService` and refetch after each action.
4. Use Spring Security with httpOnly session cookies or short-lived tokens, and enforce roles on the server.

## Proposed API contract (not an existing backend)
`POST /auth/login` · `GET/POST /tickets` · `GET/PATCH /tickets/{id}` · `POST /tickets/{id}/comments` · `POST /tickets/{id}/assign` · `POST /tickets/{id}/resolve` · `POST /tickets/{id}/escalate` · `GET /reports/summary` · `GET /sla/overview` · `GET/POST /users` · `PATCH /users/{id}` · `GET /knowledge-base/articles`

## Known limitations
- Frontend role checks are for demonstration only; real authorization must be done by Spring Security.
- Attachments stay in the browser (only name and size are saved); no real upload.
- SLA states are simulated in the browser; real SLA timers, notifications and emails need backend jobs.
- Not built: bulk actions in All Incidents, subcategory and severity form fields, related articles on ticket details, a topbar profile menu, a notification dropdown (the bell opens your queue), and component tests beyond utility tests.
- Service-layer API mode is untested because no backend exists yet.
