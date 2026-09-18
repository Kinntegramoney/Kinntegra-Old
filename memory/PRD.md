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

## Status (2026-06 / session 1) — COMPLETE & VERIFIED
- DONE: Full lift-and-shift wired end-to-end and VERIFIED by testing agent (5/5, 100%).
  - Angular login (`/signin`) renders on the preview URL.
  - End-to-end login verified: SUPERADMIN / Password@123 / PIN 123456 -> lands on `/leads`
    with REAL production data (leads list, sidebar, Super Admin badge, notifications).
  - Invalid credentials correctly rejected.
  - Chain verified: browser -> ingress -> FastAPI proxy (:8001) -> Node API (:8080) -> Azure SQL.
- DB CONNECTED: Azure SQL `kinntegra`, 208 tables, 2098 users. Firewall rule for the
  preview egress IP `34.170.12.145` was added (via the shashikantv@kinntegra.co.in Azure
  portal account, which has portal access without authenticator MFA).
  - NOTE: `admin@kinntegraazur.onmicrosoft.com` is locked behind Microsoft Authenticator MFA.
  - CAVEAT: the preview egress IP can change on environment restart (observed 34.16.56.64 ->
    34.170.12.145). If the DB starts rejecting again, re-add the new IP to the Azure SQL
    firewall. At deployment the production egress IP will also need whitelisting.

## Session 2 (2026-06) — Live-app enhancements COMPLETE & VERIFIED
- Realtime Alerts: socket.io relay folded into the frontend server (/app/frontend/server.js)
  on :3000 same-origin (/socket.io). Node API connects as client via REAL_COMM_LINK
  (http://localhost:3000). Standalone kinntegra-realcomm supervisor program removed.
  Verified in browser: socket connects through ingress + deterministic echo
  (emit reportorderprogress -> receive receiveorderprogress ~1s).
- Document Downloads: frontend server reverse-proxies /images, /doc, /download to the
  Node API (:8080). Verified: /images/bse-logo.png (png 48KB) and /doc/report/*.tiff
  (2.8MB) return real files through the public URL.
- Testing agent: iteration_2.json = 4/4 (100%).
- socket.io@4.8.1 added to /app/frontend (yarn).

## Deferred / Next
- Phase 2: React + FastAPI rewrite (Login + dashboard first), matching current Kinntegra
  branding; new FastAPI reads the same live Azure SQL. (User chose to do this AFTER the
  live-app enhancements, which are now done.)
- GitHub handover: user triggers via "Save to Github" button (self-serve).

## Next action items
- Unblock Azure SQL firewall for the current egress IP (needs Azure access that passes MFA,
  or someone with the authenticator to add the rule / reset MFA to add a phone number).
- After DB reachable: full end-to-end login + module testing via testing_agent.
- Wire realcomm socket.io through the proxy (path-based) for realtime order progress.
- Handle Node static asset routes (/images, /doc/report, /download/doc) through the proxy.
- Phase 2: begin React+FastAPI rewrite (Login + dashboard first).

## NOT verified yet
- Login and any DB-backed flow (blocked on Azure SQL firewall).
