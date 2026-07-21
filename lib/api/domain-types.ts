export type UserRole = "OWNER" | "TRAINER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  gymName?: string;
  gym_name?: string;
  avatarUrl?: string;
  avatar_url?: string;
  role: UserRole;
  gymId?: string;
  isVerified?: boolean;
}

export interface AuthLoginResponse {
  accessToken: string;
  user: AuthUser;
}

export type MemberStatus = "ACTIVE" | "SUSPENDED" | "CHURNED";
export type Gender = "MALE" | "FEMALE" | "OTHERS";

export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  dob?: string | null;
  gender?: Gender | null;
  status: MemberStatus;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  memberships?: Membership[];
  lastVisitAt?: string | null;
  currentPlanName?: string | null;
}

export type MembershipStatus = "ACTIVE" | "FROZEN" | "EXPIRED" | "SUSPENDED";

export interface Membership {
  id: string;
  member_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: MembershipStatus;
  plan?: Plan;
  member?: Member;
  freezes?: MembershipFreeze[];
}

export interface MembershipFreeze {
  id: string;
  membership_id: string;
  duration_days: number;
  reason?: string;
  started_at: string;
  ended_at?: string | null;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  description?: string | null;
  max_freeze_days: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  memberCount?: number;
}

export type AttendanceMethod = "QR" | "MANUAL" | "BIOMETRIC";

export interface Attendance {
  id: string;
  member_id: string;
  checkinAt: string;
  checkoutAt?: string | null;
  durationMinutes?: number | null;
  method: AttendanceMethod;
  member?: Pick<Member, "id" | "name" | "phone">;
}

export type InstructorType = "TRAINER" | "COACH";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  dob?: string | null;
  sex?: Gender | null;
  instructorType: InstructorType;
  hourlyPrice?: number | null;
  bio?: string | null;
  certificate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GymClass {
  id: string;
  name: string;
  trainer_id: string;
  trainer?: Pick<StaffMember, "id" | "name" | "instructorType">;
  starts_at: string;
  ends_at: string;
  capacity: number;
  description?: string | null;
  bookingsCount?: number;
  bookings?: Booking[];
}

export type BookingStatus = "CONFIRMED" | "WAITLISTED" | "CANCELLED";

export interface Booking {
  id: string;
  class_id: string;
  member_id: string;
  status: BookingStatus;
  createdAt: string;
  class?: Pick<GymClass, "id" | "name" | "starts_at" | "ends_at">;
  member?: Pick<Member, "id" | "name" | "phone">;
}

export type LeadStage =
  | "NEW"
  | "CONTACTED"
  | "TRIAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type LeadSource = "WALK_IN" | "WEBSITE" | "INSTAGRAM" | "REFERRAL";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  source: LeadSource;
  stage: LeadStage;
  notes?: string | null;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt?: string;
  activities?: LeadActivity[];
  followups?: FollowUp[];
}

export type LeadActivityType =
  | "NOTE"
  | "CALL"
  | "STAGE_CHANGE"
  | "CONVERTED";

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: LeadActivityType;
  payload?: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  followup_at: string;
  note?: string | null;
  is_done: boolean;
  createdAt: string;
  lead?: Pick<Lead, "id" | "name" | "phone">;
}

export interface OverviewKpis {
  members: { total: number; active: number; churnedThisMonth?: number };
  memberships: { active: number; expiringSoon?: number; frozen?: number };
  revenue: { paidThisMonth?: number; outstanding?: number; overdue?: number };
  attendance: { checkinsToday?: number; peakHour?: number };
  leads: { totalOpen?: number; conversionRate?: number };
  classes: { upcoming?: number; avgFillRate?: number };
}

export interface MonthlyPoint {
  month: string;
  value: number;
}

export interface RevenueAnalytics {
  monthlyTrend: Array<{
    month: string;
    revenuePaise: number;
  }>;
  outstanding: {
    totalPaise: number;
    invoiceCount: number;
    overduePaise: number;
  };
  counts: {
    paidLastNMonths: number;
    failed: number;
    refunded: number;
  };
}

export interface MemberAnalytics {
  statusBreakdown: Array<{ status: MemberStatus; count: number }>;
  churnedThisMonth: number;
  trend: Array<{ month: string; newMembers: number }>;
}

export interface AttendanceAnalytics {
  dailyTrend: Array<{ date: string; checkins: number }>;
  hourDistribution: Array<{ hour: number; checkins: number }>;
  peakHour: number;
  topAttendees: Array<{
    member: Pick<Member, "id" | "name" | "phone">;
    checkins: number;
  }>;
  inactiveMembers: {
    count: number;
    totalActiveMembers: number;
    inactiveSinceDays: number;
  };
}

export interface LeadAnalytics {
  pipeline: Array<{ stage: LeadStage; count: number }>;
  sources: Array<{ source: LeadSource; count: number }>;
  conversionRate: number;
  trend: Array<{ month: string; newLeads: number; won: number }>;
  followups: { pending: number; overdue: number };
}

export interface ClassAnalytics {
  upcomingCount: number;
  pastFillRate: number;
  topClasses: Array<{
    id: string;
    name: string;
    bookingsCount: number;
    fillRate: number;
  }>;
}

export type InvoiceStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Invoice {
  id: string;
  gym_id: string;
  member_id: string;
  amount_paise: number;
  status: InvoiceStatus;
  due_date: string;
  grace_days: number;
  razorpay_order_id?: string | null;
  paid_at?: string | null;
  member?: Pick<Member, "id" | "name" | "phone" | "email">;
}

export interface Payment {
  id: string;
  gym_id: string;
  invoice_id: string;
  razorpay_payment_id: string;
  amount_paise: number;
  method: "upi" | "card" | "cash";
  captured_at: string;
}
