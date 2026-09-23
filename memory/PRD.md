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

## 2026-09-18 — Azure cost/perf optimization (safe changes APPLIED)
Plan: ASP-DefaultResourceGroupnull-8391 (hosts 4 apps).
- Enabled HTTP/2 (http20Enabled=true) on all 4 apps: kinntegraapi, kinntegrarcomm,
  kinntegrawebsite, kinntegrawebapp. Verified curl --http2 negotiates h2 on api + webapp.
- Downsized App Service plan P2v3 -> P1V3 (PremiumV3, capacity 1). Verified all apps
  Running; kinntegraapi GET / -> 200 in ~1s. Est. saving ~US$140-150/mo.
DEFERRED (do carefully): SQL S2->S1 or vCore Serverless; index tuning for the 100% DTU
spikes (the real page-speed fix); optionally delete Stopped app kinntegrawebsite (no
compute saving since plan shared). Reversible: bump plan back to P2v3 if peaks grow.

## 2026-09-18 — SQL index tuning APPLIED (read-only analysis -> lean indexes)
Analyzed live Azure SQL (kinntegra) via DMVs. Root cause of 100% DTU spikes: hot tables
missing indexes, forcing full scans. Biggest: ClientTransactionSellTaxFreeAllocation
(579k rows/540MB) had only PK on Id; queries/deletes filter by ClientTransactionId -> full
540MB scan (138k logical reads each).
Applied 8 LEAN additive indexes ONLINE=ON (no downtime, fully reversible via DROP INDEX):
  IX_CTSTFA_ClientTransactionId  (ClientTransactionSellTaxFreeAllocation: ClientTransactionId,SellPriority) PAGE-compressed
  IX_FTPR_RedemptionId           (FeedTransactionsPurchaseRedemption: RedemptionId INCLUDE Profit)
  IX_ClientAccount_UCC           (ClientAccount: UCC)
  IX_ClientTransaction_TradeStatus (ClientTransaction: TradeStatus INCLUDE TransactionDate)
  IX_CTP_ClientTransactionId     (ClientTransactionPayment: ClientTransactionId)
  IX_CAM_ClientAccountId         (ClientAccountMandate: ClientAccountId)
  IX_CTCSIP_SIPReg_TradeStatus   (ClientTransactionCancelSIP: SIPRegistrationId,TradeStatus)
  IX_CTSTP_ClientTransactionId   (ClientTransactionSTPSwitchAllocation: ClientTransactionId)
Deliberately did NOT create the giant "INCLUDE every column" versions Azure recommends (storage bloat).
Verified: IX_CTSTFA_ClientTransactionId now served by seeks (usage stats), scan eliminated.
Scripts: /app/backend/_sql_perf_scan.py, _sql_apply_indexes.py, _sql_verify.py (read env AZURE_SQL_*).
DEFERRED - SQL right-sizing: OBSERVE DTU for 1-2 days first; then S2->S1 (~US$45/mo saved).
DO NOT use vCore Serverless auto-pause: app has constant traffic (NAV insert 14133 execs) so it
won't pause and may cost more. S1 downgrade is the right move once spikes confirmed gone.

## 2026-09-18 — Transaction/Trade-Log page SLOWNESS fixed (proc rewrite + indexes)
Endpoint GetTradeLog (applog.controller.js line 23) calls proc GetClientTransactionList.
Baseline: 1mo=16.9s, 6mo=69.6s, 1yr=130s (unpaginated).
Root cause: predicate `convert(date,DATEADD(MINUTE,330,TransactionDate)) between @FromDate and @ToDate`
was NON-SARGable, repeated ~21x -> 12 full scans of ClientTransaction + repeated aggregations.
FIX (applied LIVE, reversible):
- Rewrote all 21 predicates to SARGable equivalent:
    TransactionDate >= DATEADD(MINUTE,-330,CONVERT(datetime,@FromDate))
    AND TransactionDate < DATEADD(MINUTE,-330,DATEADD(DAY,1,CONVERT(datetime,@ToDate)))
  (preserved the 1 hardcoded '2026-05-15' branch verbatim). VALIDATED byte-for-byte identical
  output (rowcount+md5) vs original across 3 ranges incl the literal-date branch = ALL_MATCH.
  Swapped via CREATE OR ALTER; original body saved at /app/deploy/GetClientTransactionList.sql,
  optimized at /app/deploy/GetClientTransactionList_v2.sql.
- Added indexes ONLINE: IX_ClientTransaction_TxnDate (TransactionDate INCLUDE TransactionTypeId,
  TransactionPlanId,TradeStatus); IX_FeedCamsWbr2a_traddate (traddate);
  IX_CTP_ClientTransactionId_cover (ClientTransactionPortfolio: ClientTransactionId INCLUDE
  SubTransactionType,Amount,SIPAmount,SWPAmount) PAGE-compressed.
RESULT (warm): 1mo 16.9->2.5s, 6mo 69.6->11.5s, 1yr 130->13s. App co-located in Azure => faster.
REVERT if ever needed: re-run /app/deploy/GetClientTransactionList.sql (original body) + DROP the 3 indexes.
BACKLOG: page is unpaginated (returns up to 82k rows/yr) - add server-side paging for further gains.

## 2026-09-18 (later) — BSE 443 REVISED diagnosis: BSE-side BLOCK of our Azure IP, not whitelist
User: issue started ~2 days ago; BSE says no whitelisting change. DIFFERENTIAL TEST settled it:
- From Azure app (IP 20.219.168.55): BSE:443 TIMEOUT (even raw IP 43.228.176.243:443), BSE:80 OK 78ms, Google:443 OK 7ms.
- From an unrelated non-whitelisted host (this pod): BSE:443 OK 0.25s, BSE:80 OK.
=> BSE:443 is PUBLIC (not whitelist-gated). Our Azure outbound IPs are UNCHANGED; no VNet/network change our side.
CONCLUSION: BSE's edge/GSLB/WAF (www.gslb.bsestarmf.in) selectively DROPS our Azure IP on port 443
(a block/blacklist/geo-or-ASN rule), started ~2 days ago. This is a BLOCK, not a missing whitelist -
consistent with BSE saying "whitelisting is fine". ACTION: BSE must remove the port-443 block on our
IP / Azure range. Updated /app/deploy/BSE_WHITELIST_EMAIL.md with this precise proof (remove-block ask).

## 2026-09-18 (later) — NAT Gateway workaround for BSE 443 block: DEPLOYED to live API
Proved BSE:443 is NOT whitelist-gated (a random pod IP + a fresh Azure NAT IP both connect). BSE
is BLOCKING our old shared App Service outbound IP 20.219.168.55 specifically. Same issue recurred
months ago; likely "fixed" then by an outbound-IP rotation (redeploy/scale) dodging the block.
WORKAROUND (live): created dedicated static egress IP via NAT Gateway.
  Resources (RG DefaultResourceGroup-null, Central India):
    - VNet kinn-vnet 10.20.0.0/16, subnet appsvc-subnet 10.20.1.0/24 (delegated Microsoft.Web/serverFarms, NAT-associated)
    - Public IP kinn-bse-natip = 20.219.13.245 (Standard, static)
    - NAT Gateway kinn-natgw
  Validated safely on STOPPED app kinntegrawebsite first (egress=20.219.13.245, BSE:443 OK 30ms).
  SQL firewall: added explicit rule kinn-natgw-ip=20.219.13.245 (plus existing AllowAllWindowsAzureIps 0.0.0.0).
  Cutover: VNet-integrated kinntegraapi into appsvc-subnet + vnetRouteAllEnabled=true (app restarted).
  VERIFIED on LIVE kinntegraapi: egress=20.219.13.245, BSE:443 OK 28ms, SQL:1433 OK 8ms,
  root=200, /api/appuser/getuserlist=200 with real data (DB queries work through NAT). test app re-stopped.
COST: NAT GW ~US$32/mo + Standard PIP ~US$3.6/mo + data processing ~$0.045/GB.
ROLLBACK: az webapp vnet-integration remove -g <RG> -n kinntegraapi (reverts to old outbound IPs).
STILL SEND BSE EMAIL: ask BSE to remove the block on old IPs AND confirm they won't block the new
NAT IP (if BSE blocked whole Azure ASN, this NAT IP could get blocked too - but it connects now).
NEXT: user to place ONE small live transaction via normal UI; monitor live logs for BSE order result.

## 2026-09-18 (later) — Trade-log DATE shown in IST (frontend fix, DEPLOYED to live kinntegra.co.in)
Issue: trade log DATE column rendered TransactionDate in the VIEWER's browser timezone, so a trade
at 00:20 IST Sep19 (18:50 UTC Sep18) showed as 18-Sep for users in a country still on the 18th.
Filter already uses IST (+330 in proc); display did not -> mismatch. User: must always be IST.
Fix: /app/kinntegra-webapp/src/app/views/trade-log/trade-log.component.html line 39
  {{ row.TransactionDate | date:'dd-MMM-yyyy' }} -> add ':'+0530'  (force IST display).
Frontend host: kinntegrawebapp (Azure, Linux NODE|18-lts, startup 'pm2 serve /home/site/wwwroot --spa --no-daemon',
custom domains kinntegra.co.in + www). API via BASE_API_URL=https://api.kinntegra.co.in (NOT same-origin).
IMPORTANT for future builds: production src/environments/environment.ts must set
  BASE_API_URL='https://api.kinntegra.co.in', REAL_COMM_URL='https://rcomm.kinntegra.co.in'
  (handoff copy had empty strings; live build embeds the real URLs). Set these before `ng build --configuration production`.
Build verified == live + only the 8-byte date change (3 lazy chunks + styles byte-identical to live).
Deploy: uploaded ONLY 3 changed files via Kudu VFS PUT to wwwroot (index.html 204, main-LE64JCU5.js 201,
polyfills-RT5I6R6G.js 201). Left assets/media/chunks/styles/web.config untouched. Old bundles remain as orphans.
Verified live: kinntegra.co.in serves new main, IST fix present in served JS, API url correct, HTTP 200, login renders.
ROLLBACK (instant): restore old index.html from /app/deploy/kinntegrawebapp-live-backup/wwwroot-backup.zip
  (old main-R6JJOGPT.js + polyfills-BJX5WH5B.js still present in wwwroot).
NOTE: users may need a hard refresh (Ctrl+F5) to drop cached old index.html.

## 2026-09-18 (later) — Trade-log DEFAULT "last 7 days" range now IST (frontend fix, DEPLOYED)
Root cause: trade-log.component.ts fields used this.calendar.getToday() (BROWSER timezone) for the
default range: fromDate=getPrev(today,'d',6), toDate=today. For a user west of IST, today=Sep18 so
range=Sep12-18 EXCLUDED the IST-Sep19 trade. (onRefresh already used Asia/Kolkata for asOnDate.)
Fix: added static istDate(offset){ DateTime.now().setZone('Asia/Kolkata').plus({days:offset}) -> NgbDate }
  fromDate=istDate(-6), toDate=istDate(0). Now default range = IST last 7 days (includes IST today).
Rebuilt production (main-LKMNZ5M3.js) with env URLs api./rcomm.kinntegra.co.in; verified API url,
IST display fix (+0530), 7x Asia/Kolkata, no localhost. Deployed index.html+main via Kudu VFS PUT to
kinntegrawebapp wwwroot (polyfills-RT5I6R6G already live). Live serves new main, HTTP 200, login renders.
Combined with earlier display fix, trade-log now fully IST (both filter range AND date column).
Backup/rollback unchanged: /app/deploy/kinntegrawebapp-live-backup/wwwroot-backup.zip (old index.html+bundles still in wwwroot).
Users may need hard refresh (Ctrl+F5).

## 2026-09-18 (later) — Browser tab title + favicon (live kinntegrawebapp)
- Title: index.html <title>Kinntegrawebapp</title> -> "Kinntegra Wealth" (source + live).
- Favicon was generic. Rendered proper favicon.ico (multi-size 16/32/48/64) + favicon-256.png from
  src/assets/images/logo.svg (teal circle + cream K) via cairosvg+Pillow.
- index.html favicon links: svg (assets/images/logo.svg) + favicon.ico?v=2 + apple-touch-icon favicon-256.png.
- Deployed via Kudu VFS PUT to kinntegrawebapp wwwroot: favicon.ico(204), assets/images/favicon-256.png(201), index.html(204).
- Verified live: title=Kinntegra Wealth, favicon.ico size 9489, logo.svg 200. Users need hard refresh (favicons cache hard).

## 2026-09-18 (later) — Hid Dashboard & Client from live nav (not yet built)
File: src/app/layouts/app-layout/app-layout.component.html — commented out the <li> nav blocks for
href="dashboard" and href="client" (file is CRLF; used python regex to wrap in <!-- -->).
Login lands on 'leads' (not dashboard), so no auto-landing on unbuilt pages.
Routes still exist in app.routes.ts (dashboard/client) -> direct URL still works; NOT blocked (can add
a redirect guard later if wanted). Rebuilt prod (main-4JVV46XX.js) + deployed main+index.html to
kinntegrawebapp wwwroot. Verified live HTTP 200. Title/favicon/IST fixes all carried through.

## 2026-09-18 (later) — Corrected: login->leads (already worked); reverted dashboard/client redirect
User clarified: wanted LOGIN to land on lead management (it already does: login.component.ts PIN success
-> router.navigate(['leads'])), and did NOT want /dashboard & /client redirected to leads.
The redirect edit (app.routes.ts) was NEVER deployed to live (only build4 in dist, discarded).
Reverted source: dashboard/client routes back to their components. Live bundle = main-4JVV46XX.js
(menu items hidden, NO redirects, login->leads) — verified live has navigate(["leads"]) and no redirectTo.
Net live state: Dashboard & Client hidden from sidebar; login lands on Leads; URLs still resolve to
their (unbuilt) components if typed directly (user did NOT want them redirected).
Transaction URL param e.g. /transaction/414E2B5048745659672B513D = encrypted AssociateId (crypto engine), not a raw id.

## 2026-09-18 (later) — Transactions menu now uses CLEAN URL /transaction (live)
Menu href was hardcoded transaction/414E2B5048745659672B513D (a GLOBAL constant, same for all users;
used as clientTransactionId -> GetClientTransactionById; associate already read from session
AppGlobalService.CurrentAssociate). Changed to behave like leads/tradelog (clean URL):
 - app-layout.component.html: <a href="transaction"> (removed encrypted param)
 - app.routes.ts: added { path: 'transaction', component: TransactionComponent, canActivate:[AuthGuard] }
   alongside existing transaction/:transactionid
 - transaction.component.ts line 107: clientTransactionId = paramMap.get('transactionid') || '414E2B5048745659672B513D'
   (defaults to the SAME constant when no param -> identical backend behavior)
Rebuilt prod main-SRZMXFS2.js, deployed main+index.html to kinntegrawebapp wwwroot. Live HTTP 200,
login page renders. NOTE: could not log in to visually verify the transactions page itself; change is
behavior-preserving (same default value, associate from session). Sub-routes transaction/:transactionid still intact.

## 2026-09-18 (later) — Transaction clean URL COMPLETE (menu + all redirects)
414E2B5048745659672B513D = app's encrypted EMPTY/ZERO sentinel (used ~500x app-wide as "new/no id"
default), NOT the associate id (earlier note corrected). Transaction landing used it as clientTransactionId.
Fixed ALL transaction navigation to clean /transaction:
 - menu href (app-layout) -> transaction  (done earlier)
 - 10x this.router.navigate(['transaction/414E2B...']) across transaction sub-components -> ['transaction']
 - transaction.component.ts defaults clientTransactionId to sentinel when no param (behavior identical)
 - app.routes.ts has both 'transaction' and 'transaction/:transactionid'
Live bundle main-BTKCXEUW.js: 0 occurrences of transaction/414E2B (verified). Deployed, HTTP 200.
No forced cache headers + no CDN detected -> if user still sees old param URL it's BROWSER cache of
index.html; hard refresh / incognito loads new hashed bundle. Backup: /app/deploy/kinntegrawebapp-live-backup/.

## 2026-09-21 — One-time CAMS WBR9 + WBR2 feed run on LIVE (done, reverted)
User requested one-time processing of two ad-hoc CAMS feeds (daily scheduler uses fixed refs
185561564R9 / 180356975R2; these were one-off report Request Ids).
Mechanism: appscheduler endpoints -> feed.controller readCamsWbrXEmail searches INBOX (imap.gmail.com,
feeds@kinntegra.co.in) for UNSEEN email w/ hardcoded exact subject, extracts DownloadURL, unzips w/ Punit@0516, imports.
Steps done on live kinntegraapi (via Kudu VFS + az restart):
 1. Backed up feed.controller.js -> /app/deploy/azure-fix/feed-backup/feed.controller.js.orig
 2. Temporarily set subjects: WBR9 Request Id:225014898R9 (line 560), WBR2 Request Id:225015011R2 (line 5193). Restart.
 3. POST /api/appscheduler/camswbr9 -> Status true, 207s, email 225014898R9 marked \Seen (imported).
 4. POST /api/appscheduler/camswbr2 -> Status true, 114s, email 225015011R2 marked \Seen (imported).
 5. Verified via uploaded checkmail.js (imapflow) both emails total=1 unseen=0.
 6. REVERTED feed.controller.js to daily refs, deleted checkmail.js, restarted, health 200, verified only daily refs present.
Note: first WBR9 trigger returned in 7.5s (no-op, likely pre-warm/transient); 2nd run did full 11-step import.


## 2026-06 — $localize datepicker fix (LIVE, done)
Bug: DOB datepicker month/year nav broken; console `ReferenceError: $localize is not defined`.
Root cause: prod build polyfills only had `zone.js`; `@angular/localize/init` missing (a prior
rebuild dropped it — July backup bundle DID have it). ng-bootstrap datepicker nav uses $localize.
Fix: `npm i @angular/localize@17.2.1 --legacy-peer-deps`; added `@angular/localize/init` to
angular.json build.polyfills (CRLF file, edited via python). Did NOT add to tsconfig types
(typeRoots restricted -> TS2688; runtime polyfill alone is enough). Rebuilt, zip-deployed browser
dist to kinntegrawebapp (az webapp deploy --type zip --clean). Verified live polyfills define
globalThis.$localize on kinntegra.co.in + azurewebsites.

## 2026-06 — Sell Partial+Custom: per-scheme units-vs-amount (LIVE, done; user to validate w/ real order)
Requirement (ONLY for Custom allocation + Partial sell type): per scheme, typing in Units box ->
redeem by UNITS; typing in Amount box -> redeem by AMOUNT; ticking scheme/select-all -> redeem
that scheme by units (AllRedeem). Previously: only SellAll->units, everything else->amount.
Codes: SellFrom 'C'=Custom / 'R'=Recommended; CustomSellType 'A'=All 'P'=Partial 'E'=ExitFree
'T'=TaxFree 'L'=ExitFreeLongTerm.
Design (NO DB schema change): carry per-row intent in the otherwise-empty `CalculationType`
allocation field ('U'/'A'); only set for Custom+Partial non-selectAll rows; FundAmount+FundUnits
still stored for display/totals. CalculationType is safe: only buy-side `== 'P'` checks exist; no
sell/redemption consumer reads it ('TF' for tax-free sells is informational only).
Files:
 - FE transaction-allocation-sell.component.ts: set row.SellBy in onAllocationSellUnitsChanged('U')/
   SellAmountChanged('A')/SelectChanged/SelectAllChanged; onProceed 'L' block sets
   CalculationType = (SellFrom=='C' && CustomSellType=='P' && !IsSelected) ? (SellBy=='U'?'U':'A') : ''.
 - BE transaction.controller.js: added `CalculationType: orderItem.CalculationType,` to the 4 sell
   orderData blocks (5343/5476/18639/18762). getClientTransactionInfo already returns CalculationType.
 - BE bseservice.model.js PushSellTransaction (~2815): OrderVal = SellAll?0:(CalcType=='U'?0:Amount);
   Qty = SellAll?0:(CalcType=='U'?Units:0); AllRedeem = SellAll?Y:N. Backward-compatible (all other
   flows have CalcType ''/'TF' -> by amount as before).
Deploy: FE zip->kinntegrawebapp (main-TREMFVZE.js live). BE 2 files via Kudu VFS PUT (If-Match:*) to
kinntegraapi + az restart; diffed live-vs-local first (only intended edits differed). Live verified.
Backups: /app/deploy/azure-fix/live-backup/{bseservice.model.js,transaction.controller.js}.pre-sellunits.
NOT tested with a real BSE order (financial risk) — user validates with one tiny Partial+Custom sell.

## 2026-06 — Tax fund partial sell -> by UNITS (LIVE, backend-only, done; user validates)
Requirement (TAX funds only): when selling a tax/ELSS fund where sellable (exit-free, >3yr) units
!= total available units (e.g. 15 of 20), order must go by UNITS not by amount. System already
computes the exit-free sellable units correctly; problem was amount-based redemption could be
rejected as "Insufficient balance" if NAV drops (market value < requested amount). Units are NAV-safe.
Tax portfolio code = 'T' (Wealth='W', ShortTerm='ST'; from exportdata getHoldingSchemes('T',...)).
Portfolio object carries TransactionPortfolioTypeCode (getClientTransactionInfo line ~14785).
Fix (backend-only, builds on the CalculationType='U'->by-units mechanism from the Partial+Custom
change): in all 4 sell orderData blocks (5343/5476 transactionData; 18639/18762 clientTransactionData)
the CalculationType line now = (ClientTransactionPortfolios[i].TransactionPortfolioTypeCode=='T'
&& orderItem.SellAll != true) ? 'U' : orderItem.CalculationType. So Tax partial -> 'U' -> Qty=units,
OrderVal=0; Tax full-redeem -> SellAll -> AllRedeem=Y; Wealth/other & non-tax flows unchanged.
No frontend/DB change. Deployed transaction.controller.js via Kudu VFS PUT + az restart (diffed
live-vs-local: only the 4 lines changed). Live verified (4 rule lines), API 200.
Backup: /app/deploy/azure-fix/live-backup/transaction.controller.js.pre-taxunits.
NOT tested with a real BSE order — user validates with one small tax-fund partial sell.


## 2026-06 — Superadmin sell approval: per-scheme "Sell By" Units/Amount column (LIVE, done)
Requirement: on superadmin custom-sell approval screen (/transaction/admin-sell-verify/:id) show
per scheme whether it will be sold by units or by amount (previously indistinguishable).
Rule (mirrors backend BSE order outcome): label = 'Units' if portfolio Tax('T') OR CalculationType=='U'
OR AvailableUnits==SellUnits (full redeem); else 'Amount'.
Problem: admin screen uses GetClientTransactionAllocationSell endpoint whose SP + controller mapping
did NOT return CalculationType. Fixes:
 1. DB (LIVE): ALTER PROC dbo.GetClientTransactionAllocationSell — added a.CalculationType to the
    SELECT (additive; existing consumers map by field name so unaffected). Applied via mssql from
    kinntegra-api db.config (server kinntegra.database.windows.net). Backup of original CREATE text:
    /app/deploy/azure-fix/live-backup/GetClientTransactionAllocationSell.sql.pre-calctype.
 2. BE transaction.controller.js ~9181: added `CalculationType: sellDataItem.CalculationType` to the
    allocationAll.push mapping. Deployed via Kudu VFS (diffed live-vs-local = only this line).
    Backup: transaction.controller.js.pre-sellbylabel.
 3. FE transaction-admin-verify-sell: added getSellByLabel(portfolioItem,row) method + a "Sell By"
    ngx-datatable-column (LAST column, so footer total stays at colIdx==5). Badge teal=Units / slate=
    Amount, data-testid="sell-by-label". CRLF file -> edited via python.
Deploy: website main-SDYQUZU2.js live; API 200. Not screenshot-verified (needs real prod
pending-approval transaction + superadmin login on live real data) — user verifies visually.
DB connection note: kinntegra-api/app/configs/db.config.js has live Azure SQL creds (used for the
ALTER PROC). mssql available in kinntegra-api/node_modules.


## 2026-06 — Full-holding sell -> by UNITS + advisor remark (LIVE, done)
User rule: Recommended sells stay BY AMOUNT for partials, BUT when AvailableUnits == SoldUnits
(entire holding of a scheme) sell BY UNITS (NAV/price can vary between entry and execution; a
fixed-amount full sell can be rejected as insufficient balance). Applies to ALL funds. Show a
remark on frontend.
Backend (transaction.controller.js, 4 sell blocks 5343/5476/18640/18763): extended the CalculationType
ternary to also force 'U' when Number(orderItem.AvailableUnits.toFixed(3)) == Number(orderItem.FundUnits.toFixed(3)).
Note: PushSellTransaction gives SellAll precedence, so Custom "All" rows (SellAll=true) still use
AllRedeem=Y (equally NAV-safe); Recommended full-holding rows (SellAll=false) now go Qty=units.
Recommended non-full partials (Available != Sold, non-tax) remain by amount as before.
Frontend remark: confirm-order-sell (advisor pre-submit review) now has a "Sell By" column
(getSellByLabel: Units if portfolio 'T' OR CalculationType=='U' OR AvailableUnits==SellUnits; else
Amount) + a note "Schemes marked By Units ... won't cause insufficient-balance rejection"
(data-testid sell-by-label / sell-by-remark). Superadmin approval screen already had the column
(same label logic). Uses GetClientTransactionAllocationSell which now returns CalculationType.
Deploy: website main-XWKTPFLB.js; controller via Kudu (diff = only the 4 rule lines). API 200.
Backup: transaction.controller.js.pre-fullholding.
Live Azure SQL creds for ad-hoc SP work: kinntegra-api/app/configs/db.config.js.


## 2026-06 — Trade Details: "Trade Type" (Custom/Recommended) under Portfolio Details (LIVE, FE-only)
Trade Log -> row 3-dots -> "View Details" opens TradeDetailsModalComponent (fullscreen modal;
trade-log.component.ts onViewTrade line ~316 opens modal, NOT the /trade-details route).
Added a "Trade Type" field in each Portfolio Details block showing portfolioItem.SellFrom=='C'
? 'Custom' : 'Recommended'. Gated by *ngIf="portfolioItem.SellFrom" so it only renders for sells
(SellFrom is '' for buys). data-testid trade-type-block / trade-type-value.
Implementation: appended a col-xl-4 Trade Type column after the shared "Transaction Type" column.
That Transaction Type block appears 12x; 10 identical + 2 SIP/SWP variants. Inserted into the 10,
then REMOVED from the 4 Switch (SW/IS) sections which have NO portfolioItem loop (Amount commented
out) -> caused NG9 'portfolioItem does not exist' build error. Net: 6 blocks (sell+buy sections;
buys hide via *ngIf). SellFrom comes from GetClientTransactionDetails (no backend change).
Deploy: website main-KP2FOPHA.js live; verified bundle contains "Trade Type"/trade-type-value.
File: src/app/templates/trade-details-modal/trade-details-modal.component.html (CRLF).


## 2026-06 — Stale NAV for discontinued ISIN (Kotak ELSS IDCW Reinvestment) — data fix + daily sync (LIVE)
Symptom: sell allocation for VIVEK G JOSHI HUF showed a fund red with "sell amount derived on NAV
as of 25-03-2026" and total < requested. RCA: client holds KOTAK ELSS TAX SAVER FUND - IDCW
REINVESTMENT, ISIN INF174K01377. AMC stopped publishing NAV for that ISIN on 25-03-2026; the IDCW
option now publishes under twin ISIN INF174K01385 (fresh). App SP GetNetAssetValueByDateISIN returns
last NAV <= today, so it fell back to 25-03 (40.136 vs live 43.512, ~8% low) -> red flag + undervalued
-> recommended engine sold all its units and total fell short. Verified 377 & 385 had IDENTICAL NAVs
every date pre-25-03 (same fund IDCW option). NAV table = dbo.NetAssetValue (ISIN+NAVDate; cols:
Id,NAVDate,SchemeCode,SchemeName,RTASchemeCode,DivReInvestFlag,ISIN,NAV,RTACode,Created,Modified).
NAV daily import: feed.controller ProcessAmfiIndiaNav (AMFI India excel) via appscheduler.ProcessAmfiIndiaNav.
Holdings source: FeedDailyHolding (ISIN,Units,AssetDate).
Fix (all LIVE):
 1. Backfill: inserted 119 rows for INF174K01377 from INF174K01385 for 26-03..21-09-2026. 377 now
    current (43.512 @ 21-09).
 2. Daily sync: created dbo.NavIsinAlias(StaleISIN,LiveISIN,Active,Note) + proc dbo.SyncNavIsinAlias
    (copies missing recent NAV live->stale, idempotent, NOT EXISTS guard, last-45-days window).
    Seeded ('INF174K01377','INF174K01385'). Hooked into appscheduler.controller.ProcessAmfiIndiaNav
    (try/catch, runs after each daily NAV import). Deployed via Kudu VFS + restart.
    Backup: appscheduler.controller.js.pre-navsync. To fix future discontinued ISINs: INSERT a row into
    NavIsinAlias then EXEC SyncNavIsinAlias.
 3. Scan: 28 held ISINs (FeedDailyHolding latest AssetDate) — INF174K01377 was the ONLY stale one;
    all fresh now. (Note: FeedDailyHolding may be CAMS-only; KFintech/Karvy holdings in FeedKarvy307
    not scanned — revisit if a stale KFintech ISIN surfaces.)
Note for order execution: unaffected — that fund sells by units (full holding + tax), BSE uses real NAV.


## 2026-06 — Trade Type extended to ALL trade types (buy/SIP too) (LIVE, FE-only)
Follow-up to the earlier sell-only Trade Type. Now shows Custom/Recommended for every trade type.
Allocation-type fields on ClientTransactionPortfolio (values 'C'/'R'/''): SellFrom (sells),
LumpsumAllocationType (buy lumpsum), SIPAllocationType (SIP). Verified distinct values in DB.
Added getTradeType(portfolioItem) in trade-details-modal.component.ts:
  const t = SellFrom || LumpsumAllocationType || SIPAllocationType || ''; return t? (t=='C'?'Custom':'Recommended') : '';
Changed all 6 Trade Type blocks in trade-details-modal.component.html: gate *ngIf="getTradeType(portfolioItem)"
and value {{getTradeType(portfolioItem)}} (was portfolioItem.SellFrom-only). Sections covered:
Buy(B), 4x Sell(S), SIP(C/SIP). Deploy: website main-RBEZ7BXG.js live; bundle verified.


## 2026-06 — Sell Trade Details: hide Mode Of Payment + per-scheme "Sell By" (frontend, DEPLOYED to live)
File: kinntegra-webapp/src/app/templates/trade-details-modal/trade-details-modal.component.{ts,html}
(this component renders the Trade Log -> 3dots -> View Details page).
- Added getSellByLabel(portfolioItem,row): returns 'Units' if TransactionPortfolioTypeCode=='T'
  || row.SellAll==true || row.CalculationType=='U' || row.AvailableUnits==row.FundUnits, else 'Amount'.
  (mirrors existing confirm-order-sell / transaction-admin-verify-sell logic; uses FundUnits since the
  trade-details allocation model exposes FundUnits not SellUnits.)
- HTML edits in the two standard sell sections S/NA (line ~868) and S/FSWP (line ~1129):
  * Mode Of Payment col hidden via *ngIf="false" (data-testid="mode-of-payment-block").
  * New "Sell By" ngx-datatable-column (data-testid="sell-by-badge") between Amount and Trade Status,
    teal badge (#0d9488) for Units, slate (#64748b) for Amount.
- Backend: NO change needed — GetClientTransactionDetails/getClientTransactionInfo already returns
  CalculationType, SellAll, AvailableUnits, FundUnits per allocation (transaction.controller.js ~14643).
- Note: file is CRLF; edits done via line-number Python (search_replace fails on CRLF multiline).
- Build OK (yarn build, exit 0). Deploy: Kudu VFS PUT new main-BYSHDH6B.js (201) + index.html (204) to
  kinntegrawebapp wwwroot (polyfills-BJX5WH5B.js & styles-R4GI7GGR.css unchanged, already live).
  Live https://kinntegra.co.in now serves main-BYSHDH6B.js (200); bundle contains getSellByLabel/"Sell By".
- ROLLBACK (instant): restore /app/deploy/kinntegrawebapp-live-backup/index.html.pre-sellby to wwwroot
  (old main-RBEZ7BXG.js still present in wwwroot, 200).
- PENDING user visual check: open a real sell trade's View Details (auth required; agent cannot log in).

## 2026-06 — ROOT CAUSE: recommended-sell "still stale" = FeedTransactions.CurrentNAV, NOT NetAssetValue
The recommended-sell allocation page (transaction-allocation-sell) reads per-scheme CURRENT VALUE from
stored column FeedTransactions.CurrentNAV/CurrentAmount (via SP GetClientTransactionSellAllocation ->
FeedTransactions), NOT from NetAssetValue directly. So the earlier NetAssetValue backfill for INF174K01377
did NOT fix this screen.
- FeedTransactions.CurrentNAV is refreshed by nightly proc dbo.UpdateFeedTransactionExitLoad (cursor over
  all purchase lots, BalanceUnits>0, UCC<>''; NonAccount variant handles UCC=''). It resolves ISIN via
  (select top 1 ISIN from BSEScheme where ChannelPartnerCode=@ProductCode) then latest NAV<=today from
  NetAssetValue; CurrentAmount = BalanceUnits*CurrentNAV.
- Kotak ELSS IDCW schemes share ProductCode 'K154' (BSEScheme maps K154 -> INF174K01377 [K154TS-DR,
  IDCW Reinvest] AND INF174K01385 [KO154-DP, IDCW Payout]); top-1 resolves K154 -> INF174K01377.
- The nightly job last ran 21-Sep (BEFORE the 22-Sep NetAssetValue backfill), so all 31 K154 lots stayed
  frozen at CurrentNAV=40.136 / 25-Mar-2026. FeedTransactions global CurrentNAVDate distribution: ~332k lots
  fresh (18/21-Sep), 11,323 lots stuck at 25-Mar (K154 = 31 of them + other discontinued products), 13,360 null.
FIX APPLIED (live prod DB, display/valuation only, order execution untouched):
  Ran the EXACT UpdateFeedTransactionExitLoad logic as an anonymous batch SCOPED to ProductCode='K154'
  (transformed OBJECT_DEFINITION -> stripped CREATE header -> injected "and ft.ProductCode='K154'" into the
  cursor WHERE; zero transcription risk; identical to nightly job). Updated 31 K154 lots.
  VIVEKHUF lot (Id 93425, folio 1675167, 3869.541 units): 40.136 -> 43.512, CurrentAmount 155307.90 ->
  168371.47, dated 21-Sep-2026. Also fixed 4 other real-UCC K154 holders (KBS0000348/0001231/0001470/KWPL000065).
  All K154 lots have ExitLoadUnits=0 (clean exit-free), so no exit-load recompute complications.
VERIFY: reopen the Vivek G Joshi HUF sell allocation -> Kotak IDCW Reinvestment shows ~1,68,371 (not red).
NOTE: draft's stored WITHDRAWAL AMOUNT was 9,97,397 (frozen); to sell full 10,10,000 the user re-enters the
  amount (engine now has enough exit-free value). Recommended sells recompute FeedTransactions on each load.
STILL PENDING (approved earlier): full stale-NAV scan across ALL discontinued ISINs w/ live twin (only
  INF174K01377 backfilled + aliased so far); UCC='' NonAccount K154 lots + other stale products will auto-fix
  in tonight's nightly UpdateFeedTransactionExitLoad now that INF174K01377 NetAssetValue is backfilled, but
  other discontinued ISINs need their own alias/backfill.

## 2026-06 — Client reset-password success UX (frontend, DEPLOYED to live)
File: kinntegra-webapp/src/app/views/reset-password/reset-password.component.{ts,html} (route reset-password/:id)
- Previously: on ResetPasswordCredentials success it redirected to /signin immediately (no visible message).
- Now: sets resetSuccess=true -> hides the form, shows "Your Password and Pin Reset Successfully." (green),
  a manual "Go to Login" button (data-testid=go-to-login-button), and a live "Redirecting to login in N
  seconds..." countdown (data-testid=reset-redirect-countdown) that auto-navigates to /signin after 15s.
  goToLogin() clears the interval; startRedirectCountdown() uses setInterval(1000).
- Purely UX/navigation change; no password hashing / JWT / reset-token logic touched.
- CRLF file -> edited via Python. Build OK (exit 0). Deploy: Kudu VFS PUT main-CT3RIJBQ.js (201) + index.html
  (204) to kinntegrawebapp wwwroot (polyfills-BJX5WH5B.js & styles-R4GI7GGR.css unchanged). Live serves new
  main (200); bundle contains the success message + countdown. Page renders (screenshot OK).
- ROLLBACK: restore /app/deploy/kinntegrawebapp-live-backup/index.html.pre-resetpin (prior main-BYSHDH6B.js
  still in wwwroot). Pre-Sell-By backup also kept: index.html.pre-sellby.
- Note: success panel only appears after a real successful reset (needs valid reset token) - not reproducible
  from an arbitrary reset-password/:id URL.

## 2026-06 — Buy SIP: Trade Type on View Details + admin comments on client SIP approval (frontend, DEPLOYED live)
CHANGE 1 (Trade Type on SIP View Details):
  File: templates/trade-details-modal/trade-details-modal.component.html, Buy-SIP section
  (*ngIf B && subtransactiontype=='SIP', ~line 300). Inserted the standard Trade Type block
  (*ngIf="getTradeType(portfolioItem)" -> Recommended/Custom) between Transaction Type and Mode Of Payment.
  getTradeType already handles SIP via portfolioItem.SIPAllocationType ('C'->Custom else Recommended);
  backend getClientTransactionInfo already returns SIPAllocationType on each portfolio (line ~14752). No backend change.
CHANGE 2 (client can't see admin/associate comment on SIP approval):
  File: views/confirm-order-buy-sip/confirm-order-buy-sip.component.html. All 5 "Associate Comment" card
  bodies were EMPTY (only an HTML placeholder comment). Replaced each with a read-only messages list:
  *ngFor over OBJ.Messages showing UserName + RecordDateTime (IST) + Comment, plus a "No Comments" fallback.
  OBJs per tab: objBuySipWealthPortfolio / objBuySipTaxPortfolio / objBuySipShortTermPortfolio /
  objBuySipCommoditiesPortfolio / objBuySipOtherPortfolio (each already populated in the .ts with
  ClientTransactionPortfolios[i].Messages.filter(SubTransactionType=='SIP')). No template-ref vars used
  (avoided #noComments collisions). data-testid: sip-associate-comments / sip-associate-comment.
DEPLOY: build OK (exit 0). Kudu VFS PUT main-6AOOE5PN.js (201) + index.html (204) to kinntegrawebapp wwwroot
  (polyfills-BJX5WH5B.js & styles-R4GI7GGR.css unchanged). Live serves new main (200); bundle contains
  getTradeType + sip-associate-comment. ROLLBACK: restore index.html.pre-sipcomments (prior main-CT3RIJBQ.js
  still in wwwroot). Backups kept: index.html.pre-sellby, .pre-resetpin, .pre-sipcomments.
PENDING user visual check: open a pending Buy-SIP trade -> View Details (Trade Type shows) and the client
  SIP approval page (admin comment now visible). Both need auth; agent cannot log in.

## 2026-06 — Reset-password success simplified (frontend, DEPLOYED live) [supersedes prior reset UX entry]
Per user: removed the "Go to Login" button AND the 15s auto-redirect/countdown. On successful password+PIN
reset the page now hides the form and shows ONLY the success message "Your Password and Pin Reset
Successfully." (data-testid=reset-success-message). Removed redirectSeconds/redirectTimer fields,
startRedirectCountdown() and goToLogin() methods; success handler just sets resetSuccess=true.
Files: views/reset-password/reset-password.component.{ts,html}.
DEPLOY: build OK. Kudu VFS PUT main-4QWNBLQA.js (201) + index.html (204) to kinntegrawebapp. Live serves new
main (200); bundle has success msg, no "Go to Login", no countdown. ROLLBACK: index.html.pre-resetsimplify
(prior main-CT3RIJBQ.js still in wwwroot).

## 2026-06 — Sell allocation page: add "Exit Free Units" column (FE + BE, DEPLOYED live)
Page: transaction-allocation-sell (recommended + custom sell). Added an "Exit Free Units" column showing
per-scheme exit-free units, placed right after "Available Units" in all 6 sell tables.
FRONTEND: views/transaction-allocation-sell/transaction-allocation-sell.component.html — inserted a copy of
each "Available Units" ngx-datatable-column, renamed to "Exit Free Units", prop="ExitFreeUnits",
{{row.ExitFreeUnits | number:'1.3-3'}}. (6 columns.) Frontend already spreads ...a so the new field flows.
BACKEND: app/controllers/transaction.controller.js, GetSellPortfolioAllocation (lines ~7305-8600). Added
ExitFreeUnits to all 10 allocation push objects (ExitFreeUnits: Number((sellDataItem.ExitFreeUnits||0).toFixed(3)))
and to all 10 existingAllocation accumulation branches (+=). sellDataItem.ExitFreeUnits comes from SP
GetClientTransactionSellAllocation (@SellAllocationTable.ExitFreeUnits). node syntax check OK. (The 2 accum
sites at ~18289/18378 belong to a different function and were left untouched.)
DEPLOY: BE via Kudu VFS PUT to kinntegraapi site/wwwroot/app/controllers/transaction.controller.js (204) +
az webapp restart kinntegraapi (API health 200). FE build OK -> Kudu VFS PUT main-LAU7IFE3.js (201) +
index.html (204) to kinntegrawebapp (polyfills/styles unchanged); live serves new main (200), bundle has
"Exit Free Units" + ExitFreeUnits.
ROLLBACK: FE restore index.html.pre-exitfree (prior main-4QWNBLQA.js still in wwwroot). BE restore
/app/deploy/azure-fix/live-backup/transaction.controller.js.live-pre-exitfree via Kudu PUT + restart
(local pre-edit copy also at .pre-exitfree).
PENDING user visual check: open a sell allocation (e.g. Vivek G Joshi HUF) -> new Exit Free Units column
populated. (Agent cannot log in to verify the authenticated page.)

## 2026-06 — SIP client-approval comment styling fix (frontend, DEPLOYED live)
The associate/admin comments I added on confirm-order-buy-sip used a raw <h5> (too large, misaligned vs other
boxes). Restyled all 5 blocks to the app's standard chat markup: <div class="member-chat"><div class="chat-info">
<div class="profile-info"><h5>UserName</h5><span class="time">date</span></div><div class="content">Comment</div>.
CSS from _common.scss (.member-chat: h5 0.8rem uppercase light-text, .content tinted bubble) — same as
transaction-allocation-sip associate view. Deploy: main-NPWLWU5K.js (201)+index.html(204) to kinntegrawebapp;
live serves new main. ROLLBACK: index.html.pre-sipfont (prior main-NPWLWU5K predecessor main-LAU7IFE3.js in wwwroot).

## 2026-06 — Sell allocation: "Sell By" column + NAV-date (21 vs 22 Sep) explanation
CHANGE #1 (Sell By column, FE only, DEPLOYED):
  transaction-allocation-sell.component.{ts,html}. Added getSellByLabel(portfolioItem,row) (mirrors
  confirm-order-sell: Units if TransactionPortfolioTypeCode=='T' || row.CalculationType=='U' ||
  row.AvailableUnits==row.SellUnits, else Amount). Added a "Sell By" ngx-datatable-column (teal Units / slate
  Amount badge, data-testid=sell-by-badge) after "Sell Amount" in the 3 lump-sum sell tables (Recommended,
  Custom A/E/T/L, Custom P) — the ones with portfolioItem in scope. NOT added to SWP/ASWP tables (withdrawal
  plans; portfolioItem not in scope + concept N/A). NOTE: this component's .ts is LF while .html is CRLF —
  detect newline per file when editing.
  Deploy: main-CJWPSSGM.js (201)+index.html(204) to kinntegrawebapp; live has "Sell By"+getSellByLabel.
  ROLLBACK: index.html.pre-sellbycol (prior main-LAU7IFE3? -> actually prior main-CJWPSSGM predecessor).

ISSUE #2 (tooltip NAV date shows 21-Sep not 22-Sep) — ROOT CAUSE + FIX:
  The red value + "NAV as of <date>" tooltip is driven by FE IsNavDateDiffer = (row.CurrentNAVDate < today)
  and FormattedNavDate = row.CurrentNAVDate. row.CurrentNAVDate = FeedTransactions.CurrentNAVDate (stored on
  each holding), refreshed only by the nightly UpdateFeedTransactionExitLoad. NetAssetValue already had 22-Sep
  for all ISINs (server IST today = 23-Sep), but the whole book's FeedTransactions was still 21-Sep because the
  revaluation hadn't run since the 22-Sep NAV import (1-cycle lag; not client-specific, not the earlier backfill).
  FIX: ran the scoped revaluation (transform of UpdateFeedTransactionExitLoad, scoped to ft.ProductCode in
  ('G224','K144','K154','PPTSFG'), UCC<>'') -> VIVEKHUF lots now 22-Sep (Bandhan 30.656, Kotak Growth 116.225,
  Kotak IDCW 43.497, Parag 28.8079). NAVs dipped slightly vs 21-Sep; 10,10,000 still reachable (mkt val ~11.8L).
  NOTE: value may STILL render red because 22-Sep < today(23-Sep) — that's expected intraday (today's NAV not
  published yet); it's display/estimate only, BSE uses the real allotment-date NAV. Whole book self-heals to
  22-Sep on tonight's nightly revaluation.

INFRA NOTE: pod outbound IP changed to 34.16.56.64 and was blocked by Azure SQL firewall. Added temp firewall
  rule 'emergent-pod-temp' (34.16.56.64) on server 'kinntegra' (RG DefaultResourceGroup-null) to run the DB
  work. Consider removing when DB tasks complete (pending: stale-NAV full scan).
