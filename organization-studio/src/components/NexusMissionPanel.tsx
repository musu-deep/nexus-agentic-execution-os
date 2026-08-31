import { useEffect, useMemo, useState } from "react";
import { Activity, Bot, CircleAlert, LoaderCircle, Play, RefreshCw, Sparkles } from "lucide-react";
import type { Mission } from "../types";

const apiBase = (import.meta.env.VITE_NEXUS_API_URL || "").replace(/\/$/, "");
function endpoint(path: string) { return `${apiBase}${path}`; }

export default function NexusMissionPanel() {
  const [objective, setObjective] = useState("Improve execution reliability across the organization by identifying the top three delivery risks and proposing a 30-day action plan.");
  const [deadline, setDeadline] = useState(30);
  const [budget, setBudget] = useState(100000);
  const [mission, setMission] = useState<Mission | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [backend, setBackend] = useState("Checking NEXUS...");

  const refreshMissions = async () => {
    try {
      const response = await fetch(endpoint("/api/missions"));
      if (!response.ok) throw new Error("Mission list unavailable");
      const payload = await response.json();
      setMissions(payload.missions || []);
    } catch { setMissions([]); }
  };

  const checkBackend = async () => {
    try {
      const response = await fetch(endpoint("/health"));
      const payload = await response.json();
      setBackend(`${payload.backend || "NEXUS"} / ${payload.model || "agent runtime"}`);
    } catch { setBackend("NEXUS API not connected"); }
  };

  useEffect(() => { checkBackend(); refreshMissions(); }, []);

  useEffect(() => {
    if (!mission || ["completed", "failed"].includes(mission.status)) return;
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(endpoint(`/api/missions/${mission.id}`));
        if (!response.ok) return;
        const updated = await response.json();
        setMission(updated);
        if (["completed", "failed"].includes(updated.status)) refreshMissions();
      } catch { /* Keep the UI stable while the backend reconnects. */ }
    }, 1200);
    return () => window.clearInterval(timer);
  }, [mission?.id, mission?.status]);

  const runMission = async () => {
    setSubmitting(true); setError("");
    try {
      const response = await fetch(endpoint("/api/missions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective, deadline_days: deadline, budget, context: { source: "nexus-organization-studio", organization_scope: "enterprise" } })
      });
      if (!response.ok) throw new Error(`NEXUS returned HTTP ${response.status}`);
      const created = await response.json();
      setMission(created); refreshMissions();
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to create mission"); }
    finally { setSubmitting(false); }
  };

  const outputEntries = useMemo(() => {
    if (!mission?.result) return [];
    return ["strategy", "data", "risk", "executive", "brief"]
      .filter((key) => mission.result?.[key])
      .map((key) => [key, mission.result?.[key] || ""] as const);
  }, [mission]);

  return (
    <div className="mission-layout">
      <section className="panel mission-compose">
        <div className="section-heading">
          <div><span className="eyebrow"><Sparkles size={14} /> Agentic Execution</span><h2>Launch a NEXUS mission</h2></div>
          <span className="runtime-pill"><Activity size={13} /> {backend}</span>
        </div>
        <label>Executive objective</label>
        <textarea value={objective} onChange={(e) => setObjective(e.target.value)} />
        <div className="two-col">
          <div><label>Deadline in days</label><input type="number" min="1" value={deadline} onChange={(e) => setDeadline(Number(e.target.value))} /></div>
          <div><label>Budget envelope</label><input type="number" min="0" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></div>
        </div>
        <button className="primary-button" onClick={runMission} disabled={submitting || !objective.trim()}>
          {submitting ? <LoaderCircle className="spin" size={17} /> : <Play size={17} />} Run autonomous execution
        </button>
        {error && <div className="error-box"><CircleAlert size={16} /> {error}</div>}
        <div className="mission-history-head"><strong>Recent missions</strong><button className="icon-button" onClick={refreshMissions} aria-label="Refresh missions"><RefreshCw size={15} /></button></div>
        <div className="mission-history">
          {missions.slice(0, 5).map((item) => <button key={item.id} className="history-row" onClick={() => setMission(item)}><span>{item.objective}</span><small className={`status status-${item.status}`}>{item.status}</small></button>)}
          {!missions.length && <p className="empty">No persisted missions yet.</p>}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div><span className="eyebrow"><Bot size={14} /> Mission Runtime</span><h2>{mission ? mission.current_stage : "Ready for execution"}</h2></div>
          {mission && <span className={`status status-${mission.status}`}>{mission.status}</span>}
        </div>
        {!mission && <div className="mission-placeholder"><Bot size={34} /><h3>The agent fleet is standing by.</h3><p>Create a mission to see strategy, evidence, risk, executive synthesis, and the final brief.</p></div>}
        {mission && <>
          <div className="mission-objective"><strong>Objective</strong><p>{mission.objective}</p><small>Mission ID: {mission.id}</small></div>
          <div className="agent-output-list">{outputEntries.map(([key, value]) => <article className="agent-output" key={key}><span>{key}</span><p>{value}</p></article>)}</div>
          {!!mission.audit?.length && <div className="audit-list"><strong>Trace</strong>{mission.audit.slice().reverse().map((event, index) => <div className="audit-row" key={`${event.timestamp}-${index}`}><span>{event.agent}</span><p>{event.detail}</p></div>)}</div>}
        </>}
      </section>
    </div>
  );
}
