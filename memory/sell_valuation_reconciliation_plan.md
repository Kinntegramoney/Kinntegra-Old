# Sell Valuation Reconciliation + Recommended >3yr-first — WORKING PLAN (approved by user 2026-06)

## Approved decisions
- (A) Single NAV source of truth = LIVE NAV from NetAssetValue as of the transaction date (same as market value / buy flow via NetAssetValueByDate).
- Rollout = implement on COPIES, verify read-only against Vivek G Joshi HUF, deploy to live only after buckets reconcile to market value.
- (B) Recommended sell = drain OLDEST first: >3yr, then 2-3yr, then 1-2yr, then <1yr, redeeming oldest units until amount met or holdings exhausted. Applies to ALL fund types. (ELSS <3yr still legally locked -> excluded; for non-ELSS, younger buckets are eligible.)

## Root cause (confirmed, read-only)
Two valuation paths diverge:
- Age buckets: SP dbo.GetFeedTransactionYearsCompleted -> SUM(FeedTransactions.CurrentAmount) grouped by YearsCompleted/SellType. CurrentAmount = BalanceUnits x STORED CurrentNAV (refreshed only by nightly UpdateFeedTransactionExitLoad -> lags).
- Market value: controller getSchemeHolding -> units from GetFeedDailyHoldingCurrentUnits x LIVE NAV from NetAssetValueByDate (TOP 1 NAVDate <= @NAVDate ORDER BY NAVDate DESC), @NAVDate = ClientTransactionPortfolio.TransactionDate.
=> different NAV basis (and possibly different unit ledgers: FeedTransactions.BalanceUnits vs FeedDailyHolding units).

## (A) Plan
1. Copy SP GetFeedTransactionYearsCompleted -> value each row as ft.BalanceUnits * navLive.NAV via
   OUTER APPLY (SELECT TOP 1 NAV FROM NetAssetValue WHERE ISIN = s.ISIN AND NAVDate <= @TransactionDate ORDER BY NAVDate DESC) navLive
   where @TransactionDate = (SELECT TOP 1 TransactionDate FROM ClientTransaction WHERE Id=@ClientTransactionId) (verify table/column).
2. IMPORTANT unit-source check: confirm FeedTransactions.BalanceUnits (summed) == GetFeedDailyHoldingCurrentUnits per scheme. If they differ, the market value source (getSchemeHolding) must also switch to FeedTransactions.BalanceUnits (or vice versa) so BOTH use the SAME units AND same live NAV -> guarantees buckets sum to market value.
3. Verify read-only for Vivek (UCC VIVEKHUF): sum(buckets) == market value.
4. Deploy: ALTER live SP + (if needed) getSchemeHolding. FE unaffected.

## (B) Plan
SP dbo.GetClientTransactionSellAllocation (28KB). Currently: inserts lots WHERE IsLockIn=0, assigns SellPriority by YearsCompleted then XIRR (see lines ~118/154 IsLockIn=0; ~166-245 priority loop). 
Change: make SellPriority strictly oldest-first by YearsCompleted DESC across all eligible (IsLockIn=0) lots, tie-break by existing XIRR rule. Keep ELSS <3yr excluded (locked). Controller (getSellPortfolioAllocation ~7346-7440) already drains in sellDataAll order until portfolioSellAmount hits 0 -> if SP returns oldest-first, spill behavior is automatic.
Verify read-only for Vivek: recommended 10,10,000 should fill from >3yr lots first.

## Live infra note
Azure SQL firewall temp rule 'emergent-pod-temp' (34.16.56.64) added on server 'kinntegra' (RG DefaultResourceGroup-null). Remove when DB work done.

## STATUS: (A) DONE+DEPLOYED+VERIFIED, (B) VERIFIED-ALREADY-CORRECT (no change), Nightly=DIAGNOSED (2026-06 continuation)

### (A) RESOLVED — real root cause was NOT the NAV basis
Both market value (SP GetFeedTransactionLogShortTermAmount) AND age buckets (SP GetFeedTransactionYearsCompleted)
read the SAME stored FeedTransactions.CurrentAmount. They diverged ONLY because the buckets SP joined to
`select distinct ChannelPartnerCode,ISIN from BSEScheme` (ALL isins per product) while market value joins to
the single-ISIN RowNumber=1 (+ -L0/-L1 exclusion) subquery. Products mapping to >1 ISIN (e.g. K154 ->
INF174K01377 + INF174K01385) got DOUBLE-COUNTED in buckets. So live-NAV switch was NOT needed.
FIX (applied live via ALTER on Azure SQL, DB-object change so it affects BOTH pod API and prod kinntegraapi):
replaced BOTH `select distinct ChannelPartnerCode,ISIN from BSEScheme` subqueries in GetFeedTransactionYearsCompleted
with the identical single-ISIN RowNumber=1 join used by the market value SP.
VERIFY (read-only, live SP): Vivek (VIVEKHUF) Tax buckets now = >3yr 1,008,649 + 2-3yr 171,713 = 1,180,362 = market value (exact).
BULK: across 2414 (ucc,portfolio) groups, 63 were previously over-counted; fixed join reconciles ALL (identical join to MV).
Backup of original SP: /app/deploy/azure-fix/live-backup/GetFeedTransactionYearsCompleted.sql.pre-reconcile
Rollback: apply that file (change ALTER->CREATE OR re-CREATE). ExitFree SP (GetFeedTransactionExitFreeData) already
used the correct single-ISIN join -> not affected.

### (B) VERIFIED — no change needed
GetClientTransactionSellAllocation already assigns SellPriority strictly YearsCompleted DESC (loop starts at max
YearsCompleted and only decrements once all priority-0 lots at that year are consumed). Controller GetSellPortfolioAllocation
drains sellDataAll in SellPriority order. Verified by executing the SP (in a rolled-back tran) on 6 live In-Complete sell
txns incl multi-year (132866: yrs [3,3,2..,1..], 132862: [3..,2..,1..]) -> zero year-order violations. Locked ELSS (IsLockIn=1)
correctly excluded. So recommended already drains >3yr -> 2-3yr -> 1-2yr -> <1yr oldest-first.

### Nightly valuation lag — CONFIRMED RUNNING, but ORDER causes 1-day lag
AppSchedulerLog shows ProcessFeedTransaction (reval, Step 6 = UpdateFeedTransactionExitLoad, 346k-lot cursor)
runs daily and logs success (23-Sep 05:54). BUT NetAssetValue.Created shows the day's FULL NAV set (NAVDate 22-Sep)
was not finished importing until 23-Sep 06:35 (ProcessAmfiIndiaNav Id 10611) — i.e. the reval@05:54 fires ~40min
BEFORE the morning NAV import@06:35 completes. So the reval resolves "latest NAV<=today" = 21-Sep and stamps the
whole book (328k active lots) at 21-Sep, one day behind the live 22-Sep NAV. The red "NAV as of <date>" flag
(CurrentNAVDate < today) therefore shows 21-Sep. Not client-specific; persistent 1-cycle lag.
FIX PATHS (need user direction — see below): (1) reorder Azure external scheduler so ProcessFeedTransaction runs
AFTER the final daily ProcessAmfiIndiaNav; or (2) app-side hook to trigger reval at end of ProcessAmfiIndiaNav; or
(3) one-time trigger the reval NOW (22-Sep NAV is fully imported) to clear the current lag (display/valuation only,
no order-execution change). Reval SP updates CurrentNAV/CurrentAmount/CurrentNAVDate/ExitFree/ExitLoad/IsLockIn/YearsCompleted only.

## Live infra: Azure SQL temp firewall rule for pod IP 34.16.56.64 in use (server 'kinntegra'). DB reachable.
