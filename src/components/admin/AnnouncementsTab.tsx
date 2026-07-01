import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, Megaphone, Pencil } from "lucide-react";

const empty = { title: "", content: "", is_published: true };

export default function AnnouncementsTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<any>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("announcements" as any).update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("announcements" as any).insert({ ...form, created_by: user?.id ?? null });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-announcements"] }); setForm(empty); setEditing(null); toast({ title: "Saved" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("announcements" as any).delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-announcements"] }),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="font-heading text-lg font-semibold flex items-center gap-2 mb-4">
            <Megaphone className="h-5 w-5 text-accent" /> {editing ? "Edit announcement" : "Publish an announcement"}
          </h2>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div>
              <Label>Content (markdown supported)</Label>
              <Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required
                placeholder="**Bold**, *italic*, and - bullet lists all work." />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
              <Label>Published (visible on homepage)</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={save.isPending}>
                {save.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                <Plus className="h-4 w-4 mr-1" /> {editing ? "Update" : "Publish"}
              </Button>
              {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-heading text-lg font-semibold mb-3">All announcements ({items.length})</h3>
        {isLoading && <Loader2 className="h-6 w-6 animate-spin mx-auto" />}
        <div className="grid gap-3">
          {items.map((a: any) => (
            <Card key={a.id}>
              <CardContent className="py-3 px-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{a.title}</p>
                      {a.is_published ? <Badge className="bg-success/10 text-success border-0">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">{a.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(a); setForm({ title: a.title, content: a.content, is_published: a.is_published }); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => del.mutate(a.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
