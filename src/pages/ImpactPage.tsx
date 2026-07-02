import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Siren, Clock, FileDown, Loader2 } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const ImpactPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ incidents: 0, users: 0, alerts: 0, avgResp: "12 min" });
  const [trend, setTrend] = useState<any[]>([]);
  const [byType, setByType] = useState<any[]>([]);
  const [byDistrict, setByDistrict] = useState<any[]>([]);
  const [rawIncidents, setRawIncidents] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [{ data: incs }, { count: userCount }, { count: alertCount }] = await Promise.all([
          supabase.from("incidents").select("*").order("created_at", { ascending: false }),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("emergency_reports").select("*", { count: "exact", head: true }),
        ]);
        const incidents = incs || [];
        setRawIncidents(incidents);
        setStats({
          incidents: incidents.length,
          users: userCount || 0,
          alerts: alertCount || 0,
          avgResp: "12 min",
        });

        // 30-day trend
        const days: Record<string, number> = {};
        for (let i = 29; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          days[d.toISOString().slice(0, 10)] = 0;
        }
        incidents.forEach((i: any) => {
          const k = i.created_at?.slice(0, 10);
          if (k in days) days[k]++;
        });
        setTrend(Object.entries(days).map(([date, count]) => ({ date: date.slice(5), count })));

        // By type
        const types: Record<string, number> = {};
        incidents.forEach((i: any) => { types[i.incident_type] = (types[i.incident_type] || 0) + 1; });
        setByType(Object.entries(types).map(([type, count]) => ({ type, count })));

        // By district (derived from location field)
        const dist: Record<string, number> = {};
        incidents.forEach((i: any) => {
          const d = (i.location || "Unknown").split(",")[0].trim() || "Unknown";
          dist[d] = (dist[d] || 0) + 1;
        });
        setByDistrict(
          Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 10)
            .map(([district, count]) => ({ district, count }))
        );
      } catch (e: any) {
        toast({ title: "Failed to load data", description: e.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Uganda Staff Guardian — Impact Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 36,
      head: [["Metric", "Value"]],
      body: [
        ["Total incidents", String(stats.incidents)],
        ["Registered users", String(stats.users)],
        ["Emergency alerts", String(stats.alerts)],
        ["Average response time", stats.avgResp],
      ],
    });
    autoTable(doc, {
      head: [["Incident type", "Count"]],
      body: byType.map((r) => [r.type, String(r.count)]),
    });
    autoTable(doc, {
      head: [["District", "Incidents"]],
      body: byDistrict.map((r) => [r.district, String(r.count)]),
    });
    doc.save("uganda-staff-guardian-impact.pdf");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">Public Impact Dashboard</h1>
            <p className="text-muted-foreground mt-2">Live data from Uganda Staff Guardian's incident reporting system.</p>
          </div>
          <Button onClick={downloadPdf} disabled={loading}>
            <FileDown className="h-4 w-4 mr-2" /> Download Report
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: AlertTriangle, label: "Incidents", value: stats.incidents, color: "text-emergency" },
                { icon: Users, label: "Users", value: stats.users, color: "text-primary" },
                { icon: Siren, label: "Emergency Alerts", value: stats.alerts, color: "text-warning" },
                { icon: Clock, label: "Avg. Response", value: stats.avgResp, color: "text-success" },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-5">
                    <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
                    <div className="font-heading text-3xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold mb-4">Incident trend (last 30 days)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="hsl(var(--accent))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold mb-4">Most common incident types</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={byType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-4">Top districts by incident count</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {byDistrict.length === 0 && <p className="text-muted-foreground text-sm col-span-full">No location data yet.</p>}
                  {byDistrict.map((d) => (
                    <div key={d.district} className="border rounded-md p-3">
                      <div className="text-xs text-muted-foreground">{d.district}</div>
                      <div className="font-heading text-2xl font-bold">{d.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ImpactPage;
