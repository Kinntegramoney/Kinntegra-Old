# Kinntegra Wealth — Cloud Migration Brief (Move off Microsoft Azure)

**Prepared for:** Cloud providers / managed-hosting partners submitting a quote
**Goal:** Move the entire Kinntegra Wealth platform off Microsoft Azure to ONE vendor, with **zero data loss** and **no functionality changes**. We want a single point of contact who owns hosting, database, backups, and support.

---

## 1. What the platform is
Kinntegra Wealth is a **live production wealth-management platform** used to manage investor accounts and place mutual-fund transactions. It is currently 100% hosted on Microsoft Azure. It handles **live financial and investor data**, so uptime and data integrity are critical.

Public website: **https://kinntegra.co.in**

---

## 2. What needs to be hosted (the moving parts)

| # | Component | What it does | Current Azure service |
|---|-----------|--------------|-----------------------|
| 1 | **Web frontend** | The website users log into (Angular 17 app) | App Service `kinntegrawebapp` / `kinntegrawebsite` |
| 2 | **Main API / backend** | Business logic, talks to the database and to the stock exchange (Node.js / Express) | App Service `kinntegraapi` — `https://api.kinntegra.co.in` |
| 3 | **Realtime service** | Live updates/notifications (Socket.IO) | App Service `kinntegrarcomm` — `https://rcomm.kinntegra.co.in` |
| 4 | **Database** | All investor & transaction data — **~208 tables** | **Microsoft SQL Server** on Azure SQL (`kinntegra.database.windows.net`, DB `kinntegra`) |
| 5 | **Scheduled jobs (feeds)** | Automatically imports daily CAMS investor feeds (WBR9 / WBR2) from an email mailbox | Runs inside the API process on a timer |

---

## 3. Hard requirements (please confirm you can meet ALL of these)

1. **Microsoft SQL Server must be supported** — We want to keep our existing SQL Server database **as-is** to avoid any data conversion or data-loss risk. A managed SQL Server offering is preferred (e.g. **AWS RDS for SQL Server**, **Google Cloud SQL for SQL Server**, or **Azure-compatible managed MSSQL** on your platform).
   - *If you propose converting the database to another type (PostgreSQL/MySQL), please flag this clearly — it is higher risk for us.*

2. **Dedicated static outbound IP address (critical).** Our stock-exchange partner (**BSE StarMF**) only accepts connections from a whitelisted static IP on port 443. The hosting must provide a **fixed, dedicated outbound IP** we can register with BSE. (Today this is an Azure NAT Gateway IP: `20.219.13.245`.)

3. **Always-on scheduled/cron jobs.** The daily CAMS feed import must run reliably every day — the servers must **not** shut down or "sleep" when idle.

4. **Multiple services running together** — web frontend, API, and the realtime (Socket.IO) service must all run and talk to each other.

5. **Custom domains + HTTPS/SSL** for: `kinntegra.co.in`, `api.kinntegra.co.in`, `rcomm.kinntegra.co.in` (SSL certificates included/managed).

6. **Outbound email (SMTP) / mailbox access** — the platform reads a mailbox (IMAP) to pull CAMS feed attachments and sends email notifications.

---

## 4. Migration expectations (what "done right" looks like for us)

1. **Zero data loss.** Full backup of the SQL Server database taken and verified before anything moves.
2. **Copy, don't cut.** Set up the new environment in parallel, copy the data, and test thoroughly **before** switching over. Azure stays running until we confirm the new setup works.
3. **Test transactions verified.** A small live BSE test transaction must succeed from the new static IP before go-live.
4. **DNS cutover with rollback plan.** Point the domains to the new host only after sign-off; keep a clear rollback path.
5. **Backups + monitoring** configured on the new host (automatic daily database backups, basic uptime alerts).
6. **Single point of contact / support** for hosting, database, and issues after go-live.

---

## 5. Suggested step-by-step migration plan (for the provider to follow)

1. **Discovery** — review current Azure setup (App Services, SQL database, domains, mailbox, BSE IP).
2. **Provision new environment** — servers for web + API + realtime, a managed SQL Server database, and a **dedicated static IP**.
3. **Register new static IP with BSE** — submit the new IP to BSE StarMF for whitelisting.
4. **Migrate database** — back up Azure SQL, restore/copy into the new managed SQL Server, verify row counts and integrity.
5. **Deploy the three apps** to the new environment and connect them to the new database.
6. **Configure scheduled feed jobs** (daily CAMS WBR9/WBR2 imports) and mailbox access.
7. **Test end to end** — login, data accuracy, realtime updates, feed import, and one small live BSE test order from the new IP.
8. **Attach domains + SSL** on the new host.
9. **DNS cutover** during a low-traffic window; monitor closely.
10. **Decommission Azure** only after a stable period (e.g. 2–4 weeks) and final backup.

---

## 6. Rough sizing (current Azure footprint, for your quote)
- App Service plan: shared **P1v3** tier serving the apps (HTTP/2 enabled).
- Database: Azure SQL (currently ~**S1/S2** tier level), ~208 tables, largest table ~540 MB / ~580k rows.
- Egress: dedicated static IP via NAT Gateway (Central India region).
- Region today: **India (Central India)** — please keep data in an India region.

---

## 7. What we need back from you (the quote)
- Confirmation you can meet **all** hard requirements in Section 3 (especially **SQL Server** + **dedicated static IP**).
- One-time **migration cost** and estimated **timeline**.
- Ongoing **monthly hosting cost** (servers + managed SQL Server + IP + backups).
- Whether you provide **managed/single-point-of-contact support** after go-live.
- Any risks or items you'd handle differently.

---

*Notes: We are a non-technical business owner and prioritise a clean, low-risk move with no data loss and a single vendor to deal with going forward. Please keep proposals in plain business language where possible.*
