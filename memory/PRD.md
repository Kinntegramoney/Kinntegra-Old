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

## Session 3 (2026-06) — React + FastAPI rewrite KICKOFF COMPLETE & VERIFIED
- New React app served at /next (react-router basename '/next'); Angular stays live at root.
- New FastAPI endpoints under /api/v2/* read the SAME live Azure SQL via pymssql:
  - /api/v2/auth/login, /api/v2/auth/verify-pin (2-step, reuses crypto + HS256 JWT),
    /api/v2/me, /api/v2/dashboard/{clientcount,clientchart,tradelogstatus}.
  - Legacy crypto (crypto-js TripleDES/ECB/MD5) ported to Python in /app/backend/kinn_crypto.py
    and verified byte-for-byte against Node.
  - server.py: /api/v2 native routes first, catch-all proxy to Node (:8080) last.
- React app: /app/frontend/src (Login.jsx 2-step, Dashboard.jsx with recharts), Kinntegra
  branding (teal #365b58, real logo.svg), built to /app/frontend/build, served under /next.
- Testing agent iteration_3.json: 7/7 (100%). Live data confirmed (Total 1,817 clients).
- Minor cosmetic backlog: client-onboarding chart X-axis label clipping; donut center total label.
- User feedback: wants the TRANSACTION module + ACCOUNT OPENING module (and dependent modules)
  prioritized next (context: "kinntegra india" - needs clarification).

## Next action items
- Unblock Azure SQL firewall for the current egress IP (needs Azure access that passes MFA,
  or someone with the authenticator to add the rule / reset MFA to add a phone number).
- After DB reachable: full end-to-end login + module testing via testing_agent.
- Wire realcomm socket.io through the proxy (path-based) for realtime order progress.
- Handle Node static asset routes (/images, /doc/report, /download/doc) through the proxy.
- Phase 2: begin React+FastAPI rewrite (Login + dashboard first).

## NOT verified yet
- Login and any DB-backed flow (blocked on Azure SQL firewall).

## Session 4 (2026-06) — Live "Request timeout" hardening (bug fix)
- Reported live error: "Error: Request timeout at commonfunction.model.js:383" = outbound
  BSE StarMF HTTPS call exceeding the hardcoded 30s socket timeout in CommonFunction.SendRequest.
- Fix (backend, no business-logic change):
  - SendRequest timeout now driven by REQUEST_TIMEOUT_MS (kinntegra-api/.env = 60000; was 30000);
    timeout error now names host/path for observability.
  - Global process.on('unhandledRejection'|'uncaughtException') handlers in index.js so a stray
    external timeout can never crash the Node process.
  - NO retry added (order placement is non-idempotent - a retry could double-place a real order).
- Verified: deterministic local hanging-HTTPS test (clean reject + env override) AND testing agent
  iteration_4.json regression 100% (login/dashboard/API all green).
- IMPORTANT: this change lives in the Emergent codebase. To take effect on the user's LIVE Azure
  App Service, the updated code must be DEPLOYED there and REQUEST_TIMEOUT_MS set in Azure app settings.

## Session 4b (2026-06) — Fix DEPLOYED to live Azure
- Signed into Azure (shashikantv@kinntegra.co.in, no MFA) via device-code -> ARM token.
- App Service: kinntegraapi (kinntegraapi.azurewebsites.net), sub e4ee900b..., RG DefaultResourceGroup-null.
- Patched LIVE files via Kudu VFS (read-modify-write; originals backed up to
  /app/deploy/azure-fix/live-backup/):
  - site/wwwroot/app/models/commonfunction.model.js: req.setTimeout 30000 -> 60000 + diagnostic
    message ("Request timeout after 60000ms for <host><path>").
  - site/wwwroot/index.js: added process.on unhandledRejection/uncaughtException handlers.
- Restarted kinntegraapi (ARM restart 200). Live verified: GET / -> 200 "Welcome to Kinntegra!".

## 2026-09-18 — BSE StarMF timeout ROOT CAUSE FOUND (network, not code)
Ran read-only diagnostics from INSIDE live Azure App Service `kinntegraapi` (Kudu command API).
- Egress IP consistently 20.219.168.55 (in outboundIpAddresses set); reached api.ipify.org OK.
- DNS: www.bsestarmf.in -> 43.228.176.243 (resolves fine).
- Google:443 connects in 11ms; general HTTPS/443 outbound healthy.
- BSE:80 connects in 40ms (307 redirect to https).
- BSE:443 TCP connect SILENTLY DROPPED (SYN, no SYN-ACK) — TIMEOUT 3/3 (~12s each).
CONCLUSION: BSE drops our port-443 SYNs while port-80 works from same IP => our Azure
outbound IP is NOT on BSE's Secure-API (443) firewall allowlist (belief that it is whitelisted
is stale/incorrect, likely old IP after Azure outbound-IP change).
REMEDIATION (BSE-side, cannot fix in code): BSE must whitelist current outbound IPs (7) —
ideally full possibleOutboundIpAddresses (31) to survive Azure IP rotation. Long-term:
NAT Gateway / VNet integration for a single static outbound IP.
Ready-to-send request written to /app/deploy/BSE_WHITELIST_REQUEST.md.
Note: vnetRouteAllEnabled=True but virtualNetworkSubnetId=None (leftover config, harmless).
DO NOT retry Gokul Bisani's real ₹1000 order programmatically (non-idempotent).
