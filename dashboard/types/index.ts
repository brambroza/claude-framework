export type MemberStatus = 'active' | 'idle' | 'meeting' | 'offline'
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked'
export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
export type IssuePriority = 'P1' | 'P2' | 'P3'
export type TaskPriority = 'high' | 'medium' | 'low'
export type Phase = 'presales' | 'planning' | 'delivery' | 'handover' | 'support' | 'all'
export type GoalStatus = 'on-track' | 'at-risk' | 'behind' | 'done'

export interface Member {
  id: string; name: string; role: string; avatar: string
  color: string; status: MemberStatus; currentTask: string; client: string
}
export interface Client {
  id: string; name: string; business: string; phase: string
  progress: number; startDate: string; dueDate: string
  budget: number; spent: number; lead: string; members: string[]
}
export interface Task {
  id: string; title: string; client: string; assignee: string
  status: TaskStatus; priority: TaskPriority; phase: string
  due: string; tags: string[]
}
export interface Issue {
  id: string; title: string; client: string; reporter: string
  assignee: string; priority: IssuePriority; status: IssueStatus
  createdAt: string; tags: string[]
}
export interface Activity {
  id: string; member: string; action: string; detail: string
  client: string; time: string; type: 'code'|'issue'|'task'|'deploy'|'design'
}
export interface Agent {
  id: string; name: string; phase: string; description: string
  usageCount: number; lastUsed: string; layer: string
}
export interface Skill {
  id: string; name: string; command: string; phase: string
  description: string; usageCount: number; layer: string
}
export interface Cost {
  month: string; budget: number; actual: number; claudeTokens: number
}
export interface Goal {
  id: string; title: string; description: string; progress: number
  dueDate: string; status: GoalStatus; owner: string
}
export interface Routine {
  id: string; name: string; schedule: string; participants: string[]
  lastRun: string; nextRun: string; prompt: string
}
export interface Onboarding {
  id: string; memberId: string; step: string; completed: boolean; completedAt?: string
}
