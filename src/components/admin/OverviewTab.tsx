import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertTriangle, Heart, GraduationCap, Briefcase, Megaphone, ShieldCheck } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <Card>
    <CardContent className="p-5 flex items-center gap-4">
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold font-heading">{value}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      </div>
    </CardContent>
  </Card>
);

export default function OverviewTab() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const [users, hospitals, schools, jobs, ann, incidents, emergencies, checkins] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("hospitals").select("id", { count: "exact", head: true }),
        supabase.from("schools").select("id", { count: "exact", head: true }),
        supabase.from("job_listings" as any).select("id", { count: "exact", head: true }),
        supabase.from("announcements" as any).select("id", { count: "exact", head: true }),
        supabase.from("incidents" as any).select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("emergency_reports").select("id", { count: "exact", head: true }).gte("created_at", since),
        supabase.from("safety_checkins" as any).select("id", { count: "exact", head: true }).gte("created_at", since),
      ]);
      return {
        users: users.count ?? 0,
        hospitals: hospitals.count ?? 0,
        schools: schools.count ?? 0,
        jobs: jobs.count ?? 0,
        announcements: ann.count ?? 0,
        pendingIncidents: incidents.count ?? 0,
        emergencies30d: emergencies.count ?? 0,
        checkins30d: checkins.count ?? 0,
      };
    },
  });

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <StatCard label="Total Users" value={data?.users ?? "—"} icon={Users} color="bg-primary/10 text-primary" />
      <StatCard label="Alerts (30d)" value={data?.emergencies30d ?? "—"} icon={AlertTriangle} color="bg-emergency/10 text-emergency" />
      <StatCard label="Hospitals" value={data?.hospitals ?? "—"} icon={Heart} color="bg-rose-500/10 text-rose-500" />
      <StatCard label="Schools" value={data?.schools ?? "—"} icon={GraduationCap} color="bg-blue-500/10 text-blue-500" />
      <StatCard label="Job Posts" value={data?.jobs ?? "—"} icon={Briefcase} color="bg-amber-500/10 text-amber-600" />
      <StatCard label="Announcements" value={data?.announcements ?? "—"} icon={Megaphone} color="bg-accent/10 text-accent" />
      <StatCard label="Pending Reports" value={data?.pendingIncidents ?? "—"} icon={AlertTriangle} color="bg-warning/10 text-warning" />
      <StatCard label="Safe Check-ins (30d)" value={data?.checkins30d ?? "—"} icon={ShieldCheck} color="bg-success/10 text-success" />
    </div>
  );
}
