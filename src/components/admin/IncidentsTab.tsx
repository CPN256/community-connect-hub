import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, Trash2 } from "lucide-react";

export default function IncidentsTab() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ["admin-incidents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("incidents" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("incidents" as any).update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-incidents"] }); toast({ title: "Updated" }); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("incidents" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-incidents"] }),
  });

  const statusColor = (s: string) =>
    s === "pending" ? "bg-warning/10 text-warning" :
    s === "approved" ? "bg-success/10 text-success" :
    "bg-destructive/10 text-destructive";

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;

  return (
    <div className="space-y-3">
      <h2 className="font-heading text-xl font-semibold">Incident Reports ({incidents.length})</h2>
      {incidents.length === 0 && <p className="text-muted-foreground text-center py-8">No incident reports submitted yet.</p>}
      {incidents.map((r: any) => (
        <Card key={r.id}>
          <CardContent className="py-3 px-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge className={statusColor(r.status) + " border-0"}>{r.status}</Badge>
                  <Badge variant="outline">{r.incident_type}</Badge>
                  {r.is_anonymous && <Badge variant="secondary">Anonymous</Badge>}
                  {r.location && <span className="text-xs text-muted-foreground">📍 {r.location}</span>}
                </div>
                <p className="text-sm">{r.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-1">
                {r.status !== "approved" && (
                  <Button variant="outline" size="sm" onClick={() => updateStatus.mutate({ id: r.id, status: "approved" })}>
                    <Check className="h-3 w-3 mr-1" /> Approve
                  </Button>
                )}
                {r.status !== "rejected" && (
                  <Button variant="outline" size="sm" onClick={() => updateStatus.mutate({ id: r.id, status: "rejected" })}>
                    <X className="h-3 w-3 mr-1" /> Reject
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => del.mutate(r.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
