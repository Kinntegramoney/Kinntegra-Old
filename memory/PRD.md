# Kinntegra Wealth — Emergent Migration PRD

## Original problem statement
Project handover (Google Drive). Existing enterprise **wealth-management platform**
built in **Angular 17 (frontend)** + **Node/Express (backend)** + **socket.io realtime
service**, connected to **Microsoft SQL Server on Azure** (`kinntegra.database.windows.net`).
Goal: bring it onto Emergent. Phase 1 = **lift-and-shift** (run as-is, connected to the
live Azure SQL DB). Phase 2 (later) = rewrite module-by-module to **React + FastAPI**, then
eventually migrate DB to MongoDB.

## Decisions (from user)
- Approach: **Lift-and-shift first**, then rewrite.
- DB: keep the **existing Azure SQL Server** for now (NOT MongoDB yet).
- First rewrite slice (future): Login/Auth + dashboard + layout.
- Secrets from handover treated as active/as-is.

## App scale
- Frontend: Angular 17 — 174 view modules, 126 services.
- Backend: Node/Express — 58 controllers (~64k LOC), 57 routes, all mounted under `/api/*`.
- Realcomm: socket.io service.
- Integrations: BSE Star MF, MFU, Lendbox, Pulselabs, IMAP email, payment gateway,
  Puppeteer PDF, Excel exports, canvas/sharp image processing.

## Architecture on Emergent (lift-and-shift)
Emergent ingress: `/api/*` -> :8001, everything else -> :3000. Supervisor slots for
backend (uvicorn) and frontend (yarn start) are READONLY.
- **/app/kinntegra-api** — original Node/Express API. Runs on **127.0.0.1:8080** via
  supervisor program `kinntegra-api` (conf: `/etc/supervisor/conf.d/kinntegra.conf`,
  backup at `/app/deploy/kinntegra.conf`). Native modules (canvas, sharp) were rebuilt
  for linux-arm64. index.js patched to listen immediately + retry DB connect.
- **/app/backend/server.py** — FastAPI reverse proxy on :8001 -> forwards all requests
  to the Node API on :8080 (httpx streaming). Replaces the default Mongo app.
- **/app/frontend/server.js** — zero-dep static server on :3000 serving the Angular
  production build with SPA fallback. `package.json` start -> `node server.js`.
- **/app/kinntegra-webapp** — Angular app. `environment.ts` BASE_API_URL set to `''`
  (relative `/api/...`), REAL_COMM_URL `''`. Built with `ng build` (linux-arm64 deps
  reinstalled via `npm install --legacy-peer-deps`). Output: dist/kinntegrawebapp/browser.
- **/app/kinntegra-realcomm** — socket.io service on :3001 via supervisor
  program `kinntegra-realcomm`. (Browser socket wiring deferred.)

## Status (2026-06 / session 1)
- DONE: Full lift-and-shift wired end-to-end. Angular login page ("Login to Kinntegra")
  renders on the preview URL. Node API + FastAPI proxy verified
  (`/` -> "Welcome to Kinntegra!", `/api/appuser/authenticateuser` reachable).
- BLOCKER: **Azure SQL firewall** blocks this environment's outbound IP. API auto-retries
  the DB connection every 15s and will connect the moment the IP is whitelisted.
  - Preview egress IP observed: `34.16.56.64`, then `34.170.12.145` (changes across pod
    restarts; Google Cloud 34.x range).
  - Azure admin account (`admin@kinntegraazur.onmicrosoft.com` / `Laksh@0208`) is valid
    but now enforces **MFA via Microsoft Authenticator app** (no SMS fallback offered),
    which the user does not have -> cannot add the firewall rule programmatically.

## Next action items
- Unblock Azure SQL firewall for the current egress IP (needs Azure access that passes MFA,
  or someone with the authenticator to add the rule / reset MFA to add a phone number).
- After DB reachable: full end-to-end login + module testing via testing_agent.
- Wire realcomm socket.io through the proxy (path-based) for realtime order progress.
- Handle Node static asset routes (/images, /doc/report, /download/doc) through the proxy.
- Phase 2: begin React+FastAPI rewrite (Login + dashboard first).

## NOT verified yet
- Login and any DB-backed flow (blocked on Azure SQL firewall).
