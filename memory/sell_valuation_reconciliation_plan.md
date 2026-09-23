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

## STATUS: diagnosis complete + plan approved. Copy-SP build + read-only verification + deploy = NEXT (needs a live Vivek sell ClientTransactionId + adequate context budget; consider testing_agent for verification).
