import { useMemo, useState } from "react";
import { BarChart3, Bot, BriefcaseBusiness, Building2, CalendarDays, ChevronDown, CircleUserRound, FileText, Gavel, LayoutDashboard, Menu, Moon, Scale, Settings, ShieldCheck, Sun, Users, X } from "lucide-react";
import Dashboard from "./components/Dashboard";
import NexusMissionPanel from "./components/NexusMissionPanel";
import { DecisionsView, DocumentsView, GovernanceView, LegalView, MeetingsView, ProjectsView, ReportsView, StakeholdersView, TasksView } from "./components/ModuleViews";
import { defaultOrganization } from "./data/sampleData";
import type { OrganizationProfile, OrganizationType } from "./types";

const menu = [
  { id: "dashboard", label: "Command Center", icon: LayoutDashboard, group: "Executive" },
  { id: "missions", label: "NEXUS Missions", icon: Bot, group: "Executive" },
  { id: "projects", label: "Projects and Portfolios", icon: Building2, group: "Execution" },
  { id: "tasks", label: "Tasks and Commitments", icon: BriefcaseBusiness, group: "Execution" },
  { id: "decisions", label: "Decision Center", icon: Gavel, group: "Execution" },
  { id: "meetings", label: "Calendar and Meetings", icon: CalendarDays, group: "Coordination" },
  { id: "documents", label: "Document Center", icon: FileText, group: "Governance" },
  { id: "governance", label: "Governance and Compliance", icon: ShieldCheck, group: "Governance" },
  { id: "legal", label: "Legal and Obligations", icon: Scale, group: "Governance" },
  { id: "reports", label: "Reports and Insights", icon: BarChart3, group: "Intelligence" },
  { id: "stakeholders", label: "Stakeholders", icon: Users, group: "Organization" },
  { id: "settings", label: "Organization Settings", icon: Settings, group: "Organization" }
];

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [dark, setDark] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const [profile, setProfile] = useState<OrganizationProfile>(defaultOrganization);
  const groups = useMemo(() => [...new Set(menu.map((item) => item.group))], []);

  const renderView = () => {
    switch (active) {
      case "dashboard": return <Dashboard organization={profile} onNavigate={setActive} />;
      case "missions": return <NexusMissionPanel />;
      case "projects": return <ProjectsView />;
      case "tasks": return <TasksView />;
      case "decisions": return <DecisionsView />;
      case "meetings": return <MeetingsView />;
      case "documents": return <DocumentsView />;
      case "governance": return <GovernanceView />;
      case "legal": return <LegalView />;
      case "reports": return <ReportsView />;
      case "stakeholders": return <StakeholdersView />;
      case "settings": return <SettingsView profile={profile} setProfile={setProfile} />;
      default: return <Dashboard organization={profile} onNavigate={setActive} />;
    }
  };

  const current = menu.find((item) => item.id === active);
  return <div className={dark ? "app dark" : "app light"}>
    <aside className={`sidebar ${sidebar ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark">NX</div><div><strong>NEXUS</strong><span>Organization Studio</span></div><button className="mobile-close" onClick={() => setSidebar(false)}><X size={18} /></button></div>
      <div className="org-mini"><div className="org-avatar">{profile.name.slice(0, 2).toUpperCase()}</div><div><strong>{profile.name}</strong><span>{profile.type === "commercial" ? "Commercial organization" : "Nonprofit organization"}</span></div></div>
      <nav>{groups.map((group) => <div className="nav-group" key={group}><span className="nav-title">{group}</span>{menu.filter((item) => item.group === group).map((item) => <button className={active === item.id ? "nav-item nav-active" : "nav-item"} key={item.id} onClick={() => { setActive(item.id); setSidebar(false); }}><item.icon size={17} /><span>{item.label}</span></button>)}</div>)}</nav>
    </aside>
    <div className="main"><header><button className="mobile-menu" onClick={() => setSidebar(true)}><Menu size={20} /></button><div className="breadcrumb"><span>NEXUS</span><ChevronDown size={13} /><strong>{current?.label}</strong></div><div className="header-actions"><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button><div className="user-chip"><CircleUserRound size={18} /><div><strong>Executive User</strong><span>Organization Admin</span></div></div></div></header><main>{renderView()}</main></div>
    {sidebar && <div className="mobile-overlay" onClick={() => setSidebar(false)} />}
  </div>;
}

function SettingsView({ profile, setProfile }: { profile: OrganizationProfile; setProfile: React.Dispatch<React.SetStateAction<OrganizationProfile>> }) {
  const update = (key: keyof OrganizationProfile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  return <div className="content-stack"><div className="page-title"><div className="page-icon"><Settings /></div><div><h1>Organization Settings</h1><p>Configure the studio for a commercial company, nonprofit, foundation, association, or hybrid institution.</p></div></div><section className="panel settings-form"><div className="two-col"><div><label>Organization name</label><input value={profile.name} onChange={(e) => update("name", e.target.value)} /></div><div><label>Organization type</label><select value={profile.type} onChange={(e) => update("type", e.target.value as OrganizationType)}><option value="commercial">Commercial</option><option value="nonprofit">Nonprofit</option></select></div><div><label>Industry / cause</label><input value={profile.industry} onChange={(e) => update("industry", e.target.value)} /></div><div><label>Fiscal year</label><input value={profile.fiscalYear} onChange={(e) => update("fiscalYear", e.target.value)} /></div></div><label>Mission statement</label><textarea value={profile.mission} onChange={(e) => update("mission", e.target.value)} /><div className="settings-note">This configuration is deliberately organization-neutral. No company-specific, country-specific, or language-specific identity is embedded in the application.</div></section></div>;
}
