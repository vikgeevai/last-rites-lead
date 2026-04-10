export type LeadStatus = "new" | "contacted" | "qualified" | "junk" | "archived";

export interface Lead {
  id: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  source: string;
  status: LeadStatus;
  notes: string;
  responseTime?: string;
}

export const MOCK_LEADS: Lead[] = [
  { id: "1",  date: "2026-03-27 14:32", name: "Sarah Chen",       email: "sarah.chen@email.com",    phone: "+65 9123 4567", service: "Deep Tissue Massage",  source: "Landing Page",  status: "new",       notes: "",                          responseTime: "2m" },
  { id: "2",  date: "2026-03-27 11:15", name: "Marcus Williams",  email: "marcus.w@gmail.com",       phone: "+65 8234 5678", service: "Couples Spa Package",  source: "Google Ads",    status: "contacted", notes: "Scheduled for Saturday",    responseTime: "8m" },
  { id: "3",  date: "2026-03-27 09:44", name: "Priya Nair",       email: "priya.nair@work.sg",       phone: "+65 9345 6789", service: "Corporate Cleaning",   source: "Referral",      status: "qualified", notes: "High value — follow up Mon", responseTime: "15m" },
  { id: "4",  date: "2026-03-26 17:20", name: "James Lim",        email: "jameslim88@outlook.com",   phone: "+65 8456 7890", service: "Office Deep Clean",    source: "Facebook Ad",   status: "new",       notes: "",                          responseTime: "1m" },
  { id: "5",  date: "2026-03-26 13:05", name: "Aiko Tanaka",      email: "aiko.t@yahoo.com",         phone: "+65 9567 8901", service: "Hot Stone Therapy",    source: "Instagram",     status: "contacted", notes: "Interested in membership",  responseTime: "4m" },
  { id: "6",  date: "2026-03-26 10:33", name: "David Okafor",     email: "david.ok@corp.com",        phone: "+65 8678 9012", service: "Aromatherapy Session", source: "Google Search", status: "qualified", notes: "Ready to book",             responseTime: "7m" },
  { id: "7",  date: "2026-03-25 16:48", name: "Emma Rodriguez",   email: "emma.r@email.com",         phone: "+65 9789 0123", service: "Facial Treatment",     source: "Landing Page",  status: "junk",      notes: "Wrong number",              responseTime: "23m" },
  { id: "8",  date: "2026-03-25 14:22", name: "Kevin Tan",        email: "kevintan@business.sg",     phone: "+65 8890 1234", service: "Monthly Cleaning",     source: "Referral",      status: "new",       notes: "",                          responseTime: "3m" },
  { id: "9",  date: "2026-03-25 11:10", name: "Fatima Al-Said",   email: "fatima.said@email.com",    phone: "+65 9901 2345", service: "Swedish Massage",      source: "Google Ads",    status: "contacted", notes: "2nd contact sent",          responseTime: "6m" },
  { id: "10", date: "2026-03-24 15:55", name: "Liang Wei",        email: "liangwei@gmail.com",       phone: "+65 8012 3456", service: "Post-Renovation Clean", source: "Facebook Ad",  status: "qualified", notes: "Booked for April 3",        responseTime: "11m" },
  { id: "11", date: "2026-03-24 09:30", name: "Natasha Ivanova",  email: "n.ivanova@corp.sg",        phone: "+65 9123 5678", service: "Deep Tissue Massage",  source: "Instagram",     status: "new",       notes: "",                          responseTime: "2m" },
  { id: "12", date: "2026-03-23 18:15", name: "Ahmed Hassan",     email: "a.hassan@email.com",       phone: "+65 8234 6789", service: "Couples Spa Package",  source: "Landing Page",  status: "archived",  notes: "Moved abroad",              responseTime: "45m" },
  { id: "13", date: "2026-03-23 12:40", name: "Mei Lin Wong",     email: "meilin.w@yahoo.com",       phone: "+65 9345 7890", service: "Corporate Cleaning",   source: "Google Search", status: "contacted", notes: "Quote sent",                responseTime: "9m" },
  { id: "14", date: "2026-03-22 16:20", name: "Robert Fischer",   email: "r.fischer@work.com",       phone: "+65 8456 8901", service: "Office Deep Clean",    source: "Referral",      status: "qualified", notes: "Contract stage",            responseTime: "5m" },
  { id: "15", date: "2026-03-22 10:05", name: "Sophia Park",      email: "sophia.park@email.com",    phone: "+65 9567 9012", service: "Hot Stone Therapy",    source: "Google Ads",    status: "new",       notes: "",                          responseTime: "1m" },
];

export const LEAD_VOLUME_DATA = [
  { date: "Mar 1",  leads: 8,  contacted: 5 },
  { date: "Mar 4",  leads: 12, contacted: 8 },
  { date: "Mar 7",  leads: 7,  contacted: 4 },
  { date: "Mar 10", leads: 15, contacted: 11 },
  { date: "Mar 13", leads: 10, contacted: 7 },
  { date: "Mar 16", leads: 18, contacted: 14 },
  { date: "Mar 19", leads: 22, contacted: 17 },
  { date: "Mar 22", leads: 16, contacted: 12 },
  { date: "Mar 25", leads: 24, contacted: 19 },
  { date: "Mar 27", leads: 15, contacted: 11 },
];

export const STATUS_DISTRIBUTION = [
  { name: "New",       value: 38, color: "#10b981" },
  { name: "Contacted", value: 28, color: "#3b82f6" },
  { name: "Qualified", value: 22, color: "#38BDF8" },
  { name: "Junk",      value: 7,  color: "#ef4444" },
  { name: "Archived",  value: 5,  color: "#4a4a4a" },
];

export const TOP_SOURCES = [
  { source: "Google Ads",    leads: 89, pct: 35.7 },
  { source: "Landing Page",  leads: 62, pct: 24.9 },
  { source: "Instagram",     leads: 48, pct: 19.3 },
  { source: "Referral",      leads: 31, pct: 12.4 },
  { source: "Facebook Ad",   leads: 19, pct: 7.6  },
];

// 7x5 calendar heatmap (last 35 days) — deterministic for SSR consistency
const HEAT_COUNTS = [3,8,5,11,2,7,4,9,1,6,10,3,8,5,0,7,4,11,6,2,9,5,8,3,10,1,7,4,6,11,2,8,5,9,3];
export const CALENDAR_DATA = HEAT_COUNTS.map((count, day) => ({ day, count }));

export const KPI_METRICS = {
  totalLeads:     247,
  thisMonth:      43,
  conversionRate: 28.3,
  avgResponse:    "6m",
  totalLeadsDelta:  "+18%",
  thisMonthDelta:   "+12%",
  conversionDelta:  "+4.2pp",
  responseDelta:    "-2m",
};

