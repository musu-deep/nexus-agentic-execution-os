import { AlertTriangle, ArrowUpRight, Bot, CheckCircle2, Clock3, Gavel, Target, TrendingUp } from "lucide-react";
import { decisions, meetings, projects, tasks } from "../data/sampleData";
import type { OrganizationProfile } from "../types";

export default function Dashboard({ organization, onNavigate }: { organization: OrganizationProfile; onNavigate: (view: string) => void }) {
  const atRisk = projects.filter((project) => project.health === "at-risk").length;
  const openTasks = tasks.filter((task) => task.status !== "done").length;
  const pendingDecisions = decisions.filter((decision) => decision.status === "pending").length;
  const cards = [
    { label: "Execution health", value: "68%", note: "+7% this month", icon: TrendingUp },
    { label: "Projects at risk", value: String(atRisk), note: `${projects.length} active projects`, icon: AlertTriangle },
    { label: "Open commitments", value: String(openTasks), note: "Across accountable owners", icon: CheckCircle2 },
    { label: "Pending decisions", value: String(pendingDecisions), note: "Require executive action", icon: Gavel }
  ];

  return (
    <div className="content-stack">
      <section className="hero">
        <div>
          <span className="eyebrow">Organization Command Center</span>
          <h1>{organization.name}</h1>
          <p>{organization.mission}</p>
        </div>
        <button className="primary-button hero-button" onClick={() => onNavigate("missions")}>
          <Bot size={17} /> Launch NEXUS mission
        </button>
      </section>

      <div className="metrics-grid">
        {cards.map((item) => (
          <article className="panel metric-card" key={item.label}>
            <item.icon size={18} />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.note}</small>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-heading">
            <div><span className="eyebrow"><Target size={14} /> Execution Portfolio</span><h2>Priority initiatives</h2></div>
            <button className="text-button" onClick={() => onNavigate("projects")}>Open portfolio <ArrowUpRight size={14} /></button>
          </div>
          <div className="compact-list">
            {projects.map((project) => (
              <div className="compact-row" key={project.id}>
                <div><strong>{project.title}</strong><small>{project.owner}</small></div>
                <div className="mini-progress"><span style={{ width: `${project.progress}%` }} /></div>
                <span className={`health health-${project.health}`}>{project.health}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div><span className="eyebrow"><Clock3 size={14} /> Executive Day</span><h2>Upcoming meetings</h2></div>
            <button className="text-button" onClick={() => onNavigate("meetings")}>Full calendar <ArrowUpRight size={14} /></button>
          </div>
          <div className="compact-list">
            {meetings.map((meeting) => (
              <div className="compact-row meeting-row" key={meeting.id}>
                <div className="time-box">{meeting.time}</div>
                <div><strong>{meeting.title}</strong><small>{meeting.date} / {meeting.participants} participants</small></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
