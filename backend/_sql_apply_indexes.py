import pymssql, time
from pathlib import Path

env = {}
for line in Path('/app/backend/.env').read_text().splitlines():
    if '=' in line and not line.strip().startswith('#'):
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

conn = pymssql.connect(server=env['AZURE_SQL_SERVER'], user=env['AZURE_SQL_USERNAME'],
                       password=env['AZURE_SQL_PASSWORD'], database=env['AZURE_SQL_DATABASE'],
                       timeout=600, login_timeout=30, autocommit=True)
cur = conn.cursor()

indexes = [
 ("IX_CTSTFA_ClientTransactionId","ClientTransactionSellTaxFreeAllocation",
  "CREATE NONCLUSTERED INDEX IX_CTSTFA_ClientTransactionId ON ClientTransactionSellTaxFreeAllocation (ClientTransactionId, SellPriority) WITH (ONLINE=ON, DATA_COMPRESSION=PAGE)"),
 ("IX_FTPR_RedemptionId","FeedTransactionsPurchaseRedemption",
  "CREATE NONCLUSTERED INDEX IX_FTPR_RedemptionId ON FeedTransactionsPurchaseRedemption (RedemptionId) INCLUDE (Profit) WITH (ONLINE=ON, DATA_COMPRESSION=PAGE)"),
 ("IX_ClientAccount_UCC","ClientAccount",
  "CREATE NONCLUSTERED INDEX IX_ClientAccount_UCC ON ClientAccount (UCC) WITH (ONLINE=ON)"),
 ("IX_ClientTransaction_TradeStatus","ClientTransaction",
  "CREATE NONCLUSTERED INDEX IX_ClientTransaction_TradeStatus ON ClientTransaction (TradeStatus) INCLUDE (TransactionDate) WITH (ONLINE=ON)"),
 ("IX_CTP_ClientTransactionId","ClientTransactionPayment",
  "CREATE NONCLUSTERED INDEX IX_CTP_ClientTransactionId ON ClientTransactionPayment (ClientTransactionId) WITH (ONLINE=ON)"),
 ("IX_CAM_ClientAccountId","ClientAccountMandate",
  "CREATE NONCLUSTERED INDEX IX_CAM_ClientAccountId ON ClientAccountMandate (ClientAccountId) WITH (ONLINE=ON)"),
 ("IX_CTCSIP_SIPReg_TradeStatus","ClientTransactionCancelSIP",
  "CREATE NONCLUSTERED INDEX IX_CTCSIP_SIPReg_TradeStatus ON ClientTransactionCancelSIP (SIPRegistrationId, TradeStatus) WITH (ONLINE=ON)"),
 ("IX_CTSTP_ClientTransactionId","ClientTransactionSTPSwitchAllocation",
  "CREATE NONCLUSTERED INDEX IX_CTSTP_ClientTransactionId ON ClientTransactionSTPSwitchAllocation (ClientTransactionId) WITH (ONLINE=ON)"),
]

for name, table, ddl in indexes:
    cur.execute(f"SELECT COUNT(*) FROM sys.indexes WHERE name='{name}' AND object_id=OBJECT_ID('{table}')")
    if cur.fetchone()[0] > 0:
        print(f"SKIP  {name} (already exists)")
        continue
    t = time.time()
    try:
        cur.execute(ddl)
        print(f"OK    {name} on {table}  ({time.time()-t:.1f}s)")
    except Exception as e:
        print(f"FAIL  {name} on {table}: {e}")

conn.close()
print("DONE")
