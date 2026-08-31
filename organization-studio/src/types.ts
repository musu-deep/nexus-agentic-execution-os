export type OrganizationType = "commercial" | "nonprofit";
export type Priority = "critical" | "high" | "normal" | "low";
export type Health = "on-track" | "watch" | "at-risk";

export interface OrganizationProfile {
  name: string;
  type: OrganizationType;
  industry: string;
  mission: string;
  fiscalYear: string;
}

export interface Project {
  id: string;
  title: string;
  owner: string;
  progress: number;
  health: Health;
  dueDate: string;
  portfolio: string;
  budget: number;
}

export interface Task {
  id: string;
  title: string;
  owner: string;
  priority: Priority;
  status: "open" | "in-progress" | "blocked" | "done";
  dueDate: string;
}

export interface Decision {
  id: string;
  title: string;
  owner: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  impact: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: number;
  status: "scheduled" | "completed";
}

export interface Mission {
  id: string;
  objective: string;
  deadline_days: number;
  budget: number;
  status: string;
  current_stage: string;
  result?: Record<string, string>;
  audit?: Array<{
    timestamp: string;
    agent: string;
    action: string;
    detail: string;
    status: string;
  }>;
}
