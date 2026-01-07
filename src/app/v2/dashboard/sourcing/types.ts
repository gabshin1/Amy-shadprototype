export interface SourcingFeed {
  id: string
  name: string
  description?: string
  criteria: FeedCriteria
  newCount: number
  totalCount: number
  createdAt: string
  lastUpdated: string
}

export interface FeedCriteria {
  sectors: string[]
  locations: string[]
  fundingStages: string[]
  keywords: string[]
}

export interface Opportunity {
  id: string
  feedId: string
  companyName: string
  logo?: string
  initials: string
  description: string
  sector: string
  location: string
  fundingStage: string
  matchScore: number
  whyMatched: string
  foundDate: string
  website?: string
  founders?: string[]
  employeeCount?: string
  status: "new" | "saved" | "hidden" | "sent_to_crm"
}

export type ViewMode = "triage" | "table"

export type OpportunityAction = "save" | "hide" | "send_to_crm" | "run_skill"


