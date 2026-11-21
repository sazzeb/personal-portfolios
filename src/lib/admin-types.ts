export interface SessionTiming {
  created_at: string;
  idle_seconds_remaining: number;
  absolute_seconds_remaining: number;
  idle_timeout_seconds: number;
  absolute_timeout_seconds: number;
}
export interface DashboardData {
  user: { id: string; name: string; email: string; role: "member" | "admin" };
  session: SessionTiming;
  active_sessions: number;
}
