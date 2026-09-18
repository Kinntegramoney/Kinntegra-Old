import os, pymssql, textwrap
from pathlib import Path

# load AZURE_SQL_* from backend/.env
env = {}
for line in Path('/app/backend/.env').read_text().splitlines():
    if '=' in line and not line.strip().startswith('#'):
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

conn = pymssql.connect(
    server=env['AZURE_SQL_SERVER'],
    user=env['AZURE_SQL_USERNAME'],
    password=env['AZURE_SQL_PASSWORD'],
    database=env['AZURE_SQL_DATABASE'],
    timeout=60, login_timeout=30,
)
cur = conn.cursor(as_dict=True)

def run(title, sql):
    print("\n" + "=" * 90)
    print(title)
    print("=" * 90)
    try:
        cur.execute(sql)
        rows = cur.fetchall()
        if not rows:
            print("(no rows)")
        for r in rows:
            print("-" * 80)
            for k, v in r.items():
                if isinstance(v, str) and len(v) > 300:
                    v = v[:300] + " ...[truncated]"
                print(f"  {k}: {v}")
    except Exception as e:
        print("ERR:", e)

# 1) Top CPU-consuming queries (drives DTU spikes)
run("TOP 12 QUERIES BY TOTAL CPU (worker time)", """
SELECT TOP 12
  qs.execution_count AS execs,
  qs.total_worker_time/1000 AS total_cpu_ms,
  qs.total_worker_time/qs.execution_count/1000 AS avg_cpu_ms,
  qs.total_logical_reads AS total_reads,
  qs.total_logical_reads/qs.execution_count AS avg_reads,
  qs.total_elapsed_time/qs.execution_count/1000 AS avg_elapsed_ms,
  SUBSTRING(st.text,(qs.statement_start_offset/2)+1,
     ((CASE qs.statement_end_offset WHEN -1 THEN DATALENGTH(st.text)
       ELSE qs.statement_end_offset END - qs.statement_start_offset)/2)+1) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
ORDER BY qs.total_worker_time DESC
""")

# 2) Top by total logical reads (IO pressure)
run("TOP 10 QUERIES BY TOTAL LOGICAL READS (IO/DTU)", """
SELECT TOP 10
  qs.execution_count AS execs,
  qs.total_logical_reads AS total_reads,
  qs.total_logical_reads/qs.execution_count AS avg_reads,
  qs.total_worker_time/qs.execution_count/1000 AS avg_cpu_ms,
  SUBSTRING(st.text,(qs.statement_start_offset/2)+1,
     ((CASE qs.statement_end_offset WHEN -1 THEN DATALENGTH(st.text)
       ELSE qs.statement_end_offset END - qs.statement_start_offset)/2)+1) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
ORDER BY qs.total_logical_reads DESC
""")

# 3) Missing index recommendations (highest impact first)
run("TOP 15 MISSING INDEX RECOMMENDATIONS", """
SELECT TOP 15
  ROUND(migs.avg_total_user_cost*migs.avg_user_impact*(migs.user_seeks+migs.user_scans),0) AS improvement_measure,
  migs.user_seeks+migs.user_scans AS seeks_scans,
  CAST(migs.avg_user_impact AS INT) AS pct_impact,
  OBJECT_NAME(mid.object_id) AS table_name,
  mid.equality_columns,
  mid.inequality_columns,
  mid.included_columns
FROM sys.dm_db_missing_index_group_stats migs
JOIN sys.dm_db_missing_index_groups mig ON migs.group_handle = mig.index_group_handle
JOIN sys.dm_db_missing_index_details mid ON mig.index_handle = mid.index_handle
WHERE mid.database_id = DB_ID()
ORDER BY improvement_measure DESC
""")

# 4) Largest tables (row counts) for context
run("TOP 15 TABLES BY ROW COUNT", """
SELECT TOP 15
  t.name AS table_name,
  SUM(p.rows) AS row_count,
  CAST(SUM(a.total_pages)*8/1024.0 AS DECIMAL(10,1)) AS size_mb
FROM sys.tables t
JOIN sys.partitions p ON t.object_id=p.object_id AND p.index_id IN (0,1)
JOIN sys.allocation_units a ON p.partition_id=a.container_id
GROUP BY t.name
ORDER BY row_count DESC
""")

conn.close()
print("\nDONE")
