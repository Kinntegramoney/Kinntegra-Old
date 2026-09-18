import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, UserPlus, ArrowLeftRight, ClipboardList,
  ShieldCheck, LogOut, Loader2, TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { api, getUser, clearSession } from "../api";

const LOGO = process.env.PUBLIC_URL + "/logo.svg";
const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: UserPlus, label: "Leads" },
  { icon: Users, label: "Clients" },
  { icon: ArrowLeftRight, label: "Transactions" },
  { icon: ClipboardList, label: "Trade Logs" },
  { icon: ShieldCheck, label: "Admin" },
];
const PIE_COLORS = ["#365b58", "#5b8c88", "#e0a066", "#b8483f", "#7d6ca3", "#3f7f9c", "#c9a24b"];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState([]);
  const [chart, setChart] = useState([]);
  const [trade, setTrade] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [c, ch, t] = await Promise.all([
          api.clientCount(), api.clientChart(), api.tradeLogStatus(),
        ]);
        if (cancelled) return;
        setCounts(c.Data || []);
        setChart((ch.Data || []).map((d) => ({ name: d.DataTitle, value: d.DataValue })));
        setTrade((t.Data || []).map((d) => ({ name: d.TradeStatus, value: d.DataCount })));
      } catch (e) {
        if (e.message === "unauthorized") return navigate("/signin");
        setError("Could not load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  function logout() {
    clearSession();
    navigate("/signin");
  }

  const totalClients = counts.reduce((s, x) => s + (x.RecordCount || 0), 0);

  return (
    <div className="kx-shell">
      <aside className="kx-side">
        <div className="kx-side__brand">
          <img src={LOGO} alt="Kinntegra" />
          <span>Kinntegra</span>
        </div>
        <nav className="kx-nav">
          {NAV.map((n) => (
            <button
              key={n.label}
              className={"kx-nav__item" + (n.active ? " is-active" : "")}
              data-testid={"nav-" + n.label.toLowerCase().replace(/\s+/g, "-")}
              disabled={!n.active}
              title={n.active ? n.label : n.label + " (coming soon)"}
            >
              <n.icon size={19} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <button className="kx-nav__item kx-logout" onClick={logout} data-testid="logout-button">
          <LogOut size={19} /><span>Logout</span>
        </button>
      </aside>

      <main className="kx-main">
        <header className="kx-top">
          <div>
            <h1>Dashboard</h1>
            <p>Overview of your book of business</p>
          </div>
          <div className="kx-user" data-testid="topbar-user">
            <div className="kx-user__avatar">{(user?.name || "U").slice(0, 1)}</div>
            <div className="kx-user__meta">
              <strong>{user?.name || "User"}</strong>
              <small>{user?.role || ""}</small>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="kx-loading" data-testid="dashboard-loading">
            <Loader2 className="kx-spin" size={26} /> Loading live data…
          </div>
        ) : error ? (
          <div className="kx-error" data-testid="dashboard-error">{error}</div>
        ) : (
          <>
            <section className="kx-cards" data-testid="client-count-cards">
              <StatCard label="Total Clients" value={totalClients} highlight />
              {counts.map((c) => (
                <StatCard key={c.RecordType} label={c.RecordType} value={c.RecordCount} />
              ))}
            </section>

            <section className="kx-grid">
              <motion.div className="kx-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} data-testid="client-chart-panel">
                <div className="kx-panel__head">
                  <h3>Client Onboarding</h3>
                  <TrendingUp size={18} />
                </div>
                <div className="kx-panel__body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chart} margin={{ top: 8, right: 8, left: -8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7edec" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5c6b68" }} interval={0} angle={-18} textAnchor="end" height={54} />
                      <YAxis tick={{ fontSize: 11, fill: "#5c6b68" }} allowDecimals={false} />
                      <Tooltip cursor={{ fill: "rgba(54,91,88,0.06)" }} />
                      <Bar dataKey="value" fill="#365b58" radius={[6, 6, 0, 0]} maxBarSize={54} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div className="kx-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.06 }} data-testid="tradelog-chart-panel">
                <div className="kx-panel__head">
                  <h3>Trade Log Status</h3>
                  <ClipboardList size={18} />
                </div>
                <div className="kx-panel__body">
                  {trade.length === 0 ? (
                    <div className="kx-empty">No trade activity for today.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={trade} dataKey="value" nameKey="name" innerRadius={64} outerRadius={104} paddingAngle={3}>
                          {trade.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <motion.div
      className={"kx-stat" + (highlight ? " is-primary" : "")}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-testid={"stat-" + label.toLowerCase().replace(/\s+/g, "-")}
    >
      <div className="kx-stat__value">{Number(value).toLocaleString("en-IN")}</div>
      <div className="kx-stat__label">{label}</div>
    </motion.div>
  );
}
