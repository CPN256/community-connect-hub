import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, Heart, GraduationCap, Users, AlertTriangle,
  Plus, Pencil, Trash2, Loader2, ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

// ---------- Hospitals Tab ----------
function HospitalsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", type: "General", address: "", phone: "", specialties: "", open_24h: false, rating: "0" });

  const { data: hospitals = [], isLoading } = useQuery({
    queryKey: ["admin-hospitals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hospitals").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        type: form.type,
        address: form.address,
        phone: form.phone,
        specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
        open_24h: form.open_24h,
        rating: parseFloat(form.rating) || 0,
      };
      if (editing) {
        const { error } = await supabase.from("hospitals").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("hospitals").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hospitals"] });
      toast({ title: editing ? "Hospital updated" : "Hospital added" });
      resetForm();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hospitals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hospitals"] });
      toast({ title: "Hospital deleted" });
    },
  });

  const resetForm = () => {
    setForm({ name: "", type: "General", address: "", phone: "", specialties: "", open_24h: false, rating: "0" });
    setEditing(null);
    setOpen(false);
  };

  const openEdit = (h: any) => {
    setEditing(h);
    setForm({ name: h.name, type: h.type, address: h.address, phone: h.phone || "", specialties: (h.specialties || []).join(", "), open_24h: h.open_24h, rating: String(h.rating || 0) });
    setOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-xl font-semibold">Hospitals ({hospitals.length})</h2>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Hospital</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Hospital" : "Add Hospital"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(); }} className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
                <div><Label>Rating</Label><Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
              </div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Specialties (comma-separated)</Label><Input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.open_24h} onCheckedChange={(v) => setForm({ ...form, open_24h: v })} /><Label>Open 24/7</Label></div>
              <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}{editing ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3">
        {hospitals.map((h: any) => (
          <Card key={h.id}>
            <CardContent className="flex items-center justify-between py-3 px-4">
              <div>
                <p className="font-medium">{h.name}</p>
                <p className="text-sm text-muted-foreground">{h.address} · {h.type}</p>
              </div>
              <div className="flex items-center gap-2">
                {h.open_24h && <Badge variant="secondary">24/7</Badge>}
                <Button variant="ghost" size="icon" onClick={() => openEdit(h)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMut.mutate(h.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Schools Tab ----------
function SchoolsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", type: "Primary", address: "", phone: "", programs: "", student_count: "0", admission_open: false });

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ["admin-schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        type: form.type,
        address: form.address,
        phone: form.phone,
        programs: form.programs.split(",").map((s) => s.trim()).filter(Boolean),
        student_count: parseInt(form.student_count) || 0,
        admission_open: form.admission_open,
      };
      if (editing) {
        const { error } = await supabase.from("schools").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("schools").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schools"] });
      toast({ title: editing ? "School updated" : "School added" });
      resetForm();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("schools").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schools"] });
      toast({ title: "School deleted" });
    },
  });

  const resetForm = () => {
    setForm({ name: "", type: "Primary", address: "", phone: "", programs: "", student_count: "0", admission_open: false });
    setEditing(null);
    setOpen(false);
  };

  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ name: s.name, type: s.type, address: s.address, phone: s.phone || "", programs: (s.programs || []).join(", "), student_count: String(s.student_count || 0), admission_open: s.admission_open });
    setOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-xl font-semibold">Schools ({schools.length})</h2>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add School</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit School" : "Add School"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(); }} className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
                <div><Label>Students</Label><Input type="number" value={form.student_count} onChange={(e) => setForm({ ...form, student_count: e.target.value })} /></div>
              </div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Programs (comma-separated)</Label><Input value={form.programs} onChange={(e) => setForm({ ...form, programs: e.target.value })} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.admission_open} onCheckedChange={(v) => setForm({ ...form, admission_open: v })} /><Label>Admissions Open</Label></div>
              <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}{editing ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3">
        {schools.map((s: any) => (
          <Card key={s.id}>
            <CardContent className="flex items-center justify-between py-3 px-4">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.address} · {s.type} · {s.student_count} students</p>
              </div>
              <div className="flex items-center gap-2">
                {s.admission_open && <Badge className="bg-success/10 text-success border-0">Open</Badge>}
                <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMut.mutate(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Users Tab ----------
function UsersTab() {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Users ({profiles.length})</h2>
      <div className="grid gap-3">
        {profiles.map((p: any) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between py-3 px-4">
              <div>
                <p className="font-medium">{p.display_name || "Unnamed"}</p>
                <p className="text-sm text-muted-foreground">{p.phone || "No phone"} · Joined {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <Badge variant="outline">{p.user_id.slice(0, 8)}...</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Emergency Reports Tab ----------
function EmergencyTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-emergencies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("emergency_reports").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const payload: any = { status };
      if (status === "resolved") payload.resolved_at = new Date().toISOString();
      const { error } = await supabase.from("emergency_reports").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emergencies"] });
      toast({ title: "Status updated" });
    },
  });

  const statusColor = (s: string) => {
    if (s === "pending") return "bg-accent/10 text-accent border-0";
    if (s === "active") return "bg-emergency/10 text-emergency border-0";
    return "bg-success/10 text-success border-0";
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Emergency Reports ({reports.length})</h2>
      <div className="grid gap-3">
        {reports.map((r: any) => (
          <Card key={r.id}>
            <CardContent className="py-3 px-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={statusColor(r.status)}>{r.status}</Badge>
                    <Badge variant="outline">{r.type}</Badge>
                  </div>
                  <p className="text-sm">{r.description || "No description"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  {r.status !== "active" && (
                    <Button variant="outline" size="sm" onClick={() => updateStatus.mutate({ id: r.id, status: "active" })}>Activate</Button>
                  )}
                  {r.status !== "resolved" && (
                    <Button variant="default" size="sm" onClick={() => updateStatus.mutate({ id: r.id, status: "resolved" })}>Resolve</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {reports.length === 0 && <p className="text-center text-muted-foreground py-8">No emergency reports yet.</p>}
      </div>
    </div>
  );
}

// ---------- Main Dashboard ----------
const AdminDashboard = () => {
  const { hasRole, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasRole("admin")) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <Shield className="h-16 w-16 text-destructive mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this dashboard.</p>
          <Button onClick={() => navigate("/")}><ArrowLeft className="h-4 w-4 mr-1" /> Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-accent" />
            <div>
              <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage community resources and view reports</p>
            </div>
          </div>

          <Tabs defaultValue="hospitals">
            <TabsList className="mb-6">
              <TabsTrigger value="hospitals" className="gap-1"><Heart className="h-4 w-4" /> Hospitals</TabsTrigger>
              <TabsTrigger value="schools" className="gap-1"><GraduationCap className="h-4 w-4" /> Schools</TabsTrigger>
              <TabsTrigger value="users" className="gap-1"><Users className="h-4 w-4" /> Users</TabsTrigger>
              <TabsTrigger value="emergencies" className="gap-1"><AlertTriangle className="h-4 w-4" /> Emergencies</TabsTrigger>
            </TabsList>
            <TabsContent value="hospitals"><HospitalsTab /></TabsContent>
            <TabsContent value="schools"><SchoolsTab /></TabsContent>
            <TabsContent value="users"><UsersTab /></TabsContent>
            <TabsContent value="emergencies"><EmergencyTab /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
