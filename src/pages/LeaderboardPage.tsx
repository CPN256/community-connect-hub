import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Loader2 } from "lucide-react";

const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`);
const badgeFor = (points: number) => {
  if (points >= 500) return { label: "Guardian Elite", tone: "destructive" as const };
  if (points >= 200) return { label: "Community Hero", tone: "default" as const };
  if (points >= 50) return { label: "Active Citizen", tone: "secondary" as const };
  return { label: "Newcomer", tone: "outline" as const };
};

const LeaderboardPage = () => {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, points, level, district")
        .order("points", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-accent" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground mb-8">Earn points by reporting incidents and helping others.</p>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-2">
            {profiles.map((p: any, i) => {
              const b = badgeFor(p.points || 0);
              return (
                <Card key={i}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="text-2xl w-12 text-center">{medal(i)}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{p.display_name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">{p.district || "Uganda"} · Level {p.level || 1}</p>
                    </div>
                    <Badge variant={b.tone}>{b.label}</Badge>
                    <div className="font-heading font-bold text-lg w-16 text-right">{p.points || 0} pts</div>
                  </CardContent>
                </Card>
              );
            })}
            {profiles.length === 0 && <p className="text-center text-muted-foreground py-8">No profiles yet.</p>}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
