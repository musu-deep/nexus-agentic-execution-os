import type { Decision, Meeting, OrganizationProfile, Project, Task } from "../types";

export const defaultOrganization: OrganizationProfile = {
  name: "Example Organization",
  type: "commercial",
  industry: "Multi-sector services",
  mission: "Create measurable value through disciplined execution, trusted governance, and responsible growth.",
  fiscalYear: "2026"
};

export const projects: Project[] = [
  { id: "P-101", title: "Digital Service Expansion", owner: "Growth Office", progress: 72, health: "on-track", dueDate: "2026-10-15", portfolio: "Growth", budget: 420000 },
  { id: "P-102", title: "Operating Model Redesign", owner: "Transformation Office", progress: 48, health: "watch", dueDate: "2026-09-30", portfolio: "Transformation", budget: 180000 },
  { id: "P-103", title: "Regional Partnership Program", owner: "Partnerships", progress: 34, health: "at-risk", dueDate: "2026-09-12", portfolio: "Partnerships", budget: 275000 },
  { id: "P-104", title: "Governance Controls Upgrade", owner: "Governance Office", progress: 81, health: "on-track", dueDate: "2026-11-01", portfolio: "Governance", budget: 95000 }
];

export const tasks: Task[] = [
  { id: "T-201", title: "Approve Q4 operating priorities", owner: "Executive Office", priority: "critical", status: "in-progress", dueDate: "2026-09-03" },
  { id: "T-202", title: "Close vendor evaluation", owner: "Procurement", priority: "high", status: "blocked", dueDate: "2026-09-04" },
  { id: "T-203", title: "Publish monthly impact report", owner: "Performance Office", priority: "normal", status: "open", dueDate: "2026-09-07" },
  { id: "T-204", title: "Review policy exception register", owner: "Governance Office", priority: "high", status: "in-progress", dueDate: "2026-09-02" },
  { id: "T-205", title: "Refresh stakeholder map", owner: "Partnerships", priority: "low", status: "done", dueDate: "2026-08-30" }
];

export const decisions: Decision[] = [
  { id: "D-301", title: "Regional launch sequencing", owner: "Executive Committee", status: "pending", date: "2026-09-01", impact: "High" },
  { id: "D-302", title: "Technology vendor selection", owner: "Digital Office", status: "approved", date: "2026-08-29", impact: "Medium" },
  { id: "D-303", title: "Budget reallocation for priority program", owner: "Finance", status: "pending", date: "2026-09-02", impact: "High" }
];

export const meetings: Meeting[] = [
  { id: "M-401", title: "Executive Leadership Meeting", date: "2026-09-01", time: "09:00", participants: 8, status: "scheduled" },
  { id: "M-402", title: "Portfolio Risk Review", date: "2026-09-01", time: "13:30", participants: 6, status: "scheduled" },
  { id: "M-403", title: "Partnership Steering Committee", date: "2026-09-02", time: "11:00", participants: 10, status: "scheduled" }
];

export const governanceItems = [
  { control: "Board and committee charters", owner: "Corporate Governance", status: "Current", review: "2026-11-15" },
  { control: "Delegation of authority", owner: "Executive Office", status: "Review due", review: "2026-09-20" },
  { control: "Enterprise risk register", owner: "Risk Office", status: "Current", review: "2026-10-01" },
  { control: "Conflict of interest declarations", owner: "Compliance", status: "Current", review: "2027-01-10" }
];

export const documents = [
  { name: "Strategic Plan 2026-2028", category: "Strategy", owner: "Strategy Office", version: "3.2", updated: "2026-08-28" },
  { name: "Operating Policies Manual", category: "Governance", owner: "Governance Office", version: "5.1", updated: "2026-08-19" },
  { name: "Q3 Performance Pack", category: "Performance", owner: "Performance Office", version: "1.0", updated: "2026-08-30" },
  { name: "Enterprise Risk Register", category: "Risk", owner: "Risk Office", version: "4.6", updated: "2026-08-27" }
];
