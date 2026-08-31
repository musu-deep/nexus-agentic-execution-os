import { BarChart3, Building2, CalendarDays, CheckCircle2, FileText, Gavel, Scale, ShieldCheck, Users } from "lucide-react";
import { decisions, documents, governanceItems, meetings, projects, tasks } from "../data/sampleData";

export function ProjectsView() {
  return <div className="content-stack"><PageTitle icon={<Building2 />} title="Projects and Portfolios" subtitle="Monitor strategic initiatives, delivery health, ownership, budgets, and due dates." /><div className="project-grid">{projects.map((project) => <article className="panel project-card" key={project.id}><div className="project-head"><span className={`health health-${project.health}`}>{project.health}</span><small>{project.id}</small></div><h3>{project.title}</h3><p>{project.portfolio} / {project.owner}</p><div className="progress"><span style={{ width: `${project.progress}%` }} /></div><div className="meta-row"><span>{project.progress}% complete</span><span>${project.budget.toLocaleString()}</span></div><div className="meta-row"><span>Due</span><strong>{project.dueDate}</strong></div></article>)}</div></div>;
}

export function TasksView() {
  return <div className="content-stack"><PageTitle icon={<CheckCircle2 />} title="Tasks and Commitments" subtitle="A single place for delegated actions, critical commitments, blockers, and accountability." /><DataTable headers={["Task", "Owner", "Priority", "Status", "Due date"]} rows={tasks.map((task) => [task.title, task.owner, task.priority, task.status, task.dueDate])} /></div>;
}

export function DecisionsView() {
  return <div className="content-stack"><PageTitle icon={<Gavel />} title="Decision Center" subtitle="Track executive decisions from issue framing through approval and implementation." /><DataTable headers={["Decision", "Owner", "Status", "Impact", "Date"]} rows={decisions.map((decision) => [decision.title, decision.owner, decision.status, decision.impact, decision.date])} /></div>;
}

export function MeetingsView() {
  return <div className="content-stack"><PageTitle icon={<CalendarDays />} title="Calendar and Meetings" subtitle="Executive calendar, leadership meetings, steering committees, and follow-up actions." /><div className="meeting-grid">{meetings.map((meeting) => <article className="panel meeting-card" key={meeting.id}><span className="eyebrow">{meeting.date}</span><h3>{meeting.title}</h3><p>{meeting.time} / {meeting.participants} participants</p><span className="status status-planning">{meeting.status}</span></article>)}</div></div>;
}

export function GovernanceView() {
  return <div className="content-stack"><PageTitle icon={<ShieldCheck />} title="Governance and Compliance" subtitle="Board controls, delegated authorities, enterprise risk, compliance, and control reviews." /><DataTable headers={["Control", "Owner", "Status", "Next review"]} rows={governanceItems.map((item) => [item.control, item.owner, item.status, item.review])} /></div>;
}

export function DocumentsView() {
  return <div className="content-stack"><PageTitle icon={<FileText />} title="Document Center" subtitle="Controlled access to strategic, governance, performance, risk, and operating documents." /><DataTable headers={["Document", "Category", "Owner", "Version", "Updated"]} rows={documents.map((item) => [item.name, item.category, item.owner, item.version, item.updated])} /></div>;
}

export function ReportsView() {
  const metrics = [["Strategic execution", "68%", "+7%"], ["Projects on track", "50%", "-4%"], ["Critical task closure", "82%", "+11%"], ["Governance controls current", "75%", "+5%"], ["Decision cycle time", "4.2 days", "-0.8 days"], ["Stakeholder commitments met", "91%", "+3%"]];
  return <div className="content-stack"><PageTitle icon={<BarChart3 />} title="Reports and Insights" subtitle="Executive performance, risk signals, operating health, and delivery trends." /><div className="metrics-grid">{metrics.map(([label, value, trend]) => <article className="panel metric-card" key={label}><span>{label}</span><strong>{value}</strong><small>{trend}</small></article>)}</div><div className="panel insight-panel"><h3>Executive interpretation</h3><p>Delivery is improving, but the portfolio still carries concentration risk in two time-sensitive initiatives. The recommended management focus is faster decision closure, earlier escalation of procurement blockers, and a weekly evidence review for at-risk commitments.</p></div></div>;
}

export function StakeholdersView() {
  const groups = [["Customers / Beneficiaries", "High", "Value delivery, service quality, trust"], ["Board / Trustees", "High", "Governance, strategy, risk, sustainability"], ["Employees / Volunteers", "High", "Clarity, capability, engagement"], ["Partners / Funders", "Medium-High", "Outcomes, reliability, transparency"], ["Regulators", "High", "Compliance, reporting, responsible conduct"], ["Suppliers", "Medium", "Planning, terms, performance"]];
  return <div className="content-stack"><PageTitle icon={<Users />} title="Stakeholders" subtitle="A generic stakeholder layer that works for commercial and nonprofit organizations." /><DataTable headers={["Stakeholder group", "Influence", "Primary expectations"]} rows={groups} /></div>;
}

export function LegalView() {
  const items = [["Material contracts", "12 active", "2 require review"], ["Regulatory obligations", "24 tracked", "All current"], ["Policy exceptions", "3 open", "1 high priority"], ["Disputes and claims", "1 active", "Under review"]];
  return <div className="content-stack"><PageTitle icon={<Scale />} title="Legal and Obligations" subtitle="Contractual exposure, legal matters, policy exceptions, and regulatory obligations." /><DataTable headers={["Area", "Position", "Management note"]} rows={items} /></div>;
}

function PageTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return <div className="page-title"><div className="page-icon">{icon}</div><div><h1>{title}</h1><p>{subtitle}</p></div></div>;
}
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="panel table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
