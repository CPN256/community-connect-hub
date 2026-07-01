import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Loader2, UserPlus, Phone } from "lucide-react";

const EmergencyContactsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", relationship: "", phone: "" });

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["emergency-contacts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emergency_contacts" as any)
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });

  const addMut = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("emergency_contacts" as any).insert({
        user_id: user.id,
        name: form.name,
        relationship: form.relationship || null,
        phone: form.phone,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergency-contacts", user?.id] });
      setForm({ name: "", relationship: "", phone: "" });
      toast({ title: "Contact added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("emergency_contacts" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergency-contacts", user?.id] }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5 text-accent" /> Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          People notified when you tap "I'm Safe" or the SOS button.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); addMut.mutate(); }}
          className="grid gap-2 md:grid-cols-4"
        >
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="Relationship" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} />
          <Input placeholder="+256..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Button type="submit" disabled={addMut.isPending}>
            {addMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> Add</>}
          </Button>
        </form>

        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
        ) : contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No contacts yet.</p>
        ) : (
          <ul className="divide-y border rounded-md">
            {contacts.map((c: any) => (
              <li key={c.id} className="flex items-center justify-between px-3 py-2">
                <div>
                  <p className="font-medium text-sm">{c.name} {c.relationship && <span className="text-muted-foreground">· {c.relationship}</span>}</p>
                  <a href={`tel:${c.phone}`} className="text-xs text-accent flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</a>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteMut.mutate(c.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsSection;
