import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Heart, GraduationCap, AlertTriangle, Users, BarChart3, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const COLORS = ["hsl(32, 95%, 52%)", "hsl(215, 65%, 18%)", "hsl(152, 60%, 40%)", "hsl(0, 72%, 51%)", "hsl(38, 92%, 50%)", "hsl(200, 60%, 45%)"];

const AnalyticsPage = () => {
  const { data: hospitals = [] } = useQuery({
    queryKey: ["analytics-hospitals"],
    queryFn: async () => { const { data } = await supabase.from("hospitals").select("*"); return data || []; },
  });
  const { data: schools = [] } = useQuery({
    queryKey: ["analytics-schools"],
    queryFn: async () => { const { data } = await supabase.from("schools").select("*"); return data || []; },
  });
  const { data: emergencies = [] } = useQuery({
    queryKey: ["analytics-emergencies"],
    queryFn: async () => { const { data } = await supabase.from("emergency_reports").select("*"); return data || []; },
  });
  const { data: profiles = [] } = useQuery({
    queryKey: ["analytics-profiles"],
    queryFn: async () => { const { data } = await supabase.from("profiles").select("*"); return data || []; },
  });

  const isLoading = !hospitals.length && !schools.length && !emergencies.length && !profiles.length;

  // Hospital types distribution
  const hospitalTypes = hospitals.reduce((acc: Record<string, number>, h: any) => {
    acc[h.type] = (acc[h.type] || 0) + 1; return acc;
  }, {});
  const hospitalTypeData = Object.entries(hospitalTypes).map(([name, value]) => ({ name, value }));

  // School types distribution
  const schoolTypes = schools.reduce((acc: Record<string, number>, s: any) => {
    acc[s.type] = (acc[s.type] || 0) + 1; return acc;
  }, {});
  const schoolTypeData = Object.entries(schoolTypes).map(([name, value]) => ({ name, value }));

  // Emergency status breakdown
  const emergencyStatus = emergencies.reduce((acc: Record<string, number>, e: any) => {
    acc[e.status] = (acc[e.status] || 0) + 1; return acc;
  }, {});
  const emergencyStatusData = Object.entries(emergencyStatus).map(([name, value]) => ({ name, value }));

  // Emergency trends by month
  const monthlyEmergencies = emergencies.reduce((acc: Record<string, number>, e: any) => {
    const month = new Date(e.created_at).toLocaleString("default", { month: "short", year: "2-digit" });
    acc[month] = (acc[month] || 0) + 1; return acc;
  }, {});
  const monthlyData = Object.entries(monthlyEmergencies).map(([month, count]) => ({ month, count }));

  // District breakdown from hospitals
  const districtHospitals = hospitals.reduce((acc: Record<string, number>, h: any) => {
    const district = (h as any).district || "Unknown";
    acc[district] = (acc[district] || 0) + 1; return acc;
  }, {});
  const districtData = Object.entries(districtHospitals)
    .map(([district, hospitals]) => ({ district, hospitals }))
    .sort((a, b) => b.hospitals - a.hospitals)
    .slice(0, 10);

  const stats = [
    { icon: Heart, label: "Hospitals", value: hospitals.length, color: "text-emergency" },
    { icon: GraduationCap, label: "Schools", value: schools.length, color: "text-accent" },
    { icon: AlertTriangle, label: "Emergencies", value: emergencies.length, color: "text-warning" },
    { icon: Users, label: "Staff Members", value: profiles.length, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="h-8 w-8 text-accent" />
            <div>
              <h1 className="font-heading text-2xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground text-sm">Overview of platform activity across Uganda</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-3 py-4 px-4">
                  <s.icon className={`h-8 w-8 ${s.color}`} />
                  <div>
                    <p className="font-heading text-2xl font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hospital Types */}
            <Card>
              <CardHeader><CardTitle className="text-base">Hospital Types</CardTitle></CardHeader>
              <CardContent>
                {hospitalTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={hospitalTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {hospitalTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p className="text-center text-muted-foreground py-8">No data yet</p>}
              </CardContent>
            </Card>

            {/* School Types */}
            <Card>
              <CardHeader><CardTitle className="text-base">School Types</CardTitle></CardHeader>
              <CardContent>
                {schoolTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={schoolTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {schoolTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p className="text-center text-muted-foreground py-8">No data yet</p>}
              </CardContent>
            </Card>

            {/* Emergency Status */}
            <Card>
              <CardHeader><CardTitle className="text-base">Emergency Reports by Status</CardTitle></CardHeader>
              <CardContent>
                {emergencyStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={emergencyStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(32, 95%, 52%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-center text-muted-foreground py-8">No data yet</p>}
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader><CardTitle className="text-base">Emergency Trends</CardTitle></CardHeader>
              <CardContent>
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="hsl(0, 72%, 51%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <p className="text-center text-muted-foreground py-8">No data yet</p>}
              </CardContent>
            </Card>

            {/* Top Districts */}
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Top Districts by Hospitals</CardTitle></CardHeader>
              <CardContent>
                {districtData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={districtData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="district" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="hospitals" fill="hsl(215, 65%, 18%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-center text-muted-foreground py-8">No data yet</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AnalyticsPage;
