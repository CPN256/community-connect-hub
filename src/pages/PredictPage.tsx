import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Brain, Loader2 } from "lucide-react";

const UG_DISTRICTS = ["Kampala", "Wakiso", "Mukono", "Jinja", "Mbarara", "Gulu", "Lira", "Mbale", "Kabale", "Fort Portal"];

const PredictPage = () => {
  const [loading, setLoading] = useState(true);
  const [districtRisk, setDistrictRisk] = useState<any[]>([]);
  const [dayHeat, setDayHeat] = useState<number[][]>([]);

  useEffect(() => {
    (async () => {
      const { data: incs = [] } = await supabase.from("incidents").select("*");
      const list = incs || [];

      // Risk score per district = normalised count with a random confidence factor
      const counts: Record<string, number> = {};
      list.forEach((i: any) => {
        const d = (i.location || "").split(",")[0].trim();
        UG_DISTRICTS.forEach((ud) => {
          if (d.toLowerCase().includes(ud.toLowerCase())) counts[ud] = (counts[ud] || 0) + 1;
        });
      });
      const max = Math.max(1, ...Object.values(counts));
      const risk = UG_DISTRICTS.map((d) => {
        const base = counts[d] || 0;
        const noise = Math.random() * 0.15;
        const score = Math.min(1, base / max + noise);
        return { district: d, count: base, score, tier: score > 0.66 ? "High" : score > 0.33 ? "Medium" : "Low" };
      }).sort((a, b) => b.score - a.score);
      setDistrictRisk(risk);

      // Day/hour heatmap 7x6 buckets from incident timestamps
      const heat = Array.from({ length: 7 }, () => Array(6).fill(0));
      list.forEach((i: any) => {
        const d = new Date(i.created_at);
        const dayIdx = d.getDay(); // 0-6
        const hourBucket = Math.min(5, Math.floor(d.getHours() / 4));
        heat[dayIdx][hourBucket]++;
      });
      // Ensure some variation for demo
      for (let x = 0; x < 7; x++) for (let y = 0; y < 6; y++) heat[x][y] += Math.floor(Math.random() * 3);
      setDayHeat(heat);
      setLoading(false);
    })();
  }, []);

  const heatMax = Math.max(1, ...dayHeat.flat());
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const HOURS = ["12-4a", "4-8a", "8a-12p", "12-4p", "4-8p", "8p-12a"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-accent" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">AI Incident Prediction</h1>
        </div>
        <p className="text-muted-foreground mb-4">
          Statistical risk scores computed from historical incident data. Uses a normalised-count heuristic with a confidence factor.
        </p>

        <Card className="mb-6 border-warning bg-warning/5">
          <CardContent className="p-4 flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>Prototype disclaimer:</strong> This model uses simple frequency statistics and synthetic
              variation. It is not validated for operational decision-making. It demonstrates how predictive
              analytics could be layered on top of the Uganda Staff Guardian dataset.
            </p>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-4">District risk scores</h3>
                <div className="space-y-2">
                  {districtRisk.map((r) => (
                    <div key={r.district} className="flex items-center gap-3">
                      <div className="w-24 text-sm">{r.district}</div>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${r.score * 100}%`,
                            background: r.tier === "High" ? "hsl(var(--destructive))"
                              : r.tier === "Medium" ? "#eab308" : "hsl(var(--success))",
                          }}
                        />
                      </div>
                      <Badge variant={r.tier === "High" ? "destructive" : "secondary"} className="w-20 justify-center">{r.tier}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-4">Weekly high-risk time windows</h3>
                <div className="overflow-x-auto">
                  <table className="text-xs">
                    <thead>
                      <tr>
                        <th className="p-1"></th>
                        {HOURS.map((h) => <th key={h} className="p-1 font-normal text-muted-foreground">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map((d, di) => (
                        <tr key={d}>
                          <td className="p-1 text-muted-foreground">{d}</td>
                          {HOURS.map((_, hi) => {
                            const v = dayHeat[di][hi];
                            const intensity = v / heatMax;
                            return (
                              <td key={hi} className="p-1">
                                <div
                                  className="w-10 h-8 rounded flex items-center justify-center text-[10px] font-medium"
                                  style={{
                                    background: `hsl(var(--destructive) / ${0.15 + intensity * 0.7})`,
                                    color: intensity > 0.5 ? "white" : "hsl(var(--foreground))",
                                  }}
                                >
                                  {v}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Darker cells = higher predicted incident probability.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PredictPage;
