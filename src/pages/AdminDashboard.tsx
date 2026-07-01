import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, Heart, GraduationCap, Users, AlertTriangle,
  Plus, Pencil, Trash2, Loader2, ArrowLeft, Bell, MapPin,
  LayoutDashboard, Briefcase, Megaphone, LogOut, AlertOctagon,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import OverviewTab from "@/components/admin/OverviewTab";
import IncidentsTab from "@/components/admin/IncidentsTab";
import JobsTab from "@/components/admin/JobsTab";
import AnnouncementsTab from "@/components/admin/AnnouncementsTab";

const DISTRICTS = [
  "Kampala","Wakiso","Mukono","Jinja","Mbarara","Gulu","Lira","Soroti","Mbale",
  "Kabale","Hoima","Arua","Fort Portal","Masaka","Entebbe","Tororo","Iganga",
  "Busia","Kasese","Mityana","Mpigi","Luweero","Kayunga","Pallisa","Kumi",
  "Kapchorwa","Moroto","Kotido","Kitgum","Pader","Adjumani","Moyo","Nebbi",
  "Bundibugyo","Kabarole","Kamwenge","Kyenjojo","Ibanda","Isingiro","Ntungamo",
  "Bushenyi","Rukungiri","Kanungu","Kisoro",
];

// ---------- Hospitals Tab ----------
function HospitalsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", type: "General", address: "", phone: "", specialties: "",
    open_24h: false, rating: "0", district: "", latitude: "", longitude: "",
  });

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
        district: form.district || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
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
    setForm({ name: "", type: "General", address: "", phone: "", specialties: "", open_24h: false, rating: "0", district: "", latitude: "", longitude: "" });
    setEditing(null);
    setOpen(false);
  };

  const openEdit = (h: any) => {
    setEditing(h);
    setForm({
      name: h.name, type: h.type, address: h.address, phone: h.phone || "",
      specialties: (h.specialties || []).join(", "), open_24h: h.open_24h,
      rating: String(h.rating || 0), district: h.district || "",
      latitude: h.latitude ? String(h.latitude) : "", longitude: h.longitude ? String(h.longitude) : "",
    });
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
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Hospital" : "Add Hospital"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(); }} className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
                <div><Label>Rating</Label><Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
              </div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div>
                  <Label>District</Label>
                  <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                    <option value="">Select district</option>
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div><Label>Specialties (comma-separated)</Label><Input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Latitude</Label><Input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="e.g. 0.3476" /></div>
                <div><Label>Longitude</Label><Input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="e.g. 32.5772" /></div>
              </div>
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
                <p className="text-sm text-muted-foreground">{h.address} · {h.type} {h.district && `· ${h.district}`}</p>
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
  const [form, setForm] = useState({
    name: "", type: "Primary", address: "", phone: "", programs: "",
    student_count: "0", admission_open: false, district: "", latitude: "", longitude: "",
  });

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
        district: form.district || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
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
    setForm({ name: "", type: "Primary", address: "", phone: "", programs: "", student_count: "0", admission_open: false, district: "", latitude: "", longitude: "" });
    setEditing(null);
    setOpen(false);
  };

  const openEdit = (s: any) => {
    setEditing(s);
    setForm({
      name: s.name, type: s.type, address: s.address, phone: s.phone || "",
      programs: (s.programs || []).join(", "), student_count: String(s.student_count || 0),
      admission_open: s.admission_open, district: s.district || "",
      latitude: s.latitude ? String(s.latitude) : "", longitude: s.longitude ? String(s.longitude) : "",
    });
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
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit School" : "Add School"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(); }} className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
                <div><Label>Students</Label><Input type="number" value={form.student_count} onChange={(e) => setForm({ ...form, student_count: e.target.value })} /></div>
              </div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div>
                  <Label>District</Label>
                  <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                    <option value="">Select district</option>
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div><Label>Programs (comma-separated)</Label><Input value={form.programs} onChange={(e) => setForm({ ...form, programs: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Latitude</Label><Input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="e.g. 0.3346" /></div>
                <div><Label>Longitude</Label><Input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="e.g. 32.5673" /></div>
              </div>
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
                <p className="text-sm text-muted-foreground">{s.address} · {s.type} · {s.student_count} students {s.district && `· ${s.district}`}</p>
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
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: allRoles = [] } = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-roles"] });
      toast({ title: "Role updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Users ({profiles.length})</h2>
      <div className="grid gap-3">
        {profiles.map((p: any) => {
          const isAdmin = allRoles.some((r: any) => r.user_id === p.user_id && r.role === "admin");
          return (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between py-3 px-4">
                <div>
                  <p className="font-medium">{p.display_name || "Unnamed"}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.district || "No district"} · {p.department || "No dept"} · Joined {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && <Badge className="bg-accent/10 text-accent border-0">Admin</Badge>}
                  <Button
                    variant={isAdmin ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => toggleAdmin.mutate({ userId: p.user_id, isAdmin })}
                  >
                    {isAdmin ? "Remove Admin" : "Make Admin"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Notifications Tab ----------
function NotificationsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", message: "", type: "info" });
  const [sending, setSending] = useState(false);

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-users-for-notif"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("user_id");
      if (error) throw error;
      return data;
    },
  });

  const sendBroadcast = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    try {
      const notifications = profiles.map((p: any) => ({
        user_id: p.user_id,
        title: form.title,
        message: form.message,
        type: form.type,
      }));
      if (notifications.length > 0) {
        const { error } = await supabase.from("notifications").insert(notifications);
        if (error) throw error;
      }
      toast({ title: "Broadcast sent!", description: `Sent to ${notifications.length} staff members.` });
      setForm({ title: "", message: "", type: "info" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="font-heading text-xl font-semibold">Broadcast Notification</h2>
      <p className="text-sm text-muted-foreground">Send a notification to all {profiles.length} staff members.</p>
      <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Important Update" /></div>
      <div><Label>Message</Label><Input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Enter notification message..." /></div>
      <div>
        <Label>Type</Label>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
      <Button onClick={sendBroadcast} disabled={sending || !form.title || !form.message} className="w-full">
        {sending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
        <Bell className="h-4 w-4 mr-1" /> Send to All Staff
      </Button>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(r.created_at).toLocaleString()}
                    {r.latitude && r.longitude && ` · 📍 ${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}`}
                  </p>
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

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
          <Button onClick={() => navigate("/admin/login")}><ArrowLeft className="h-4 w-4 mr-1" /> Admin Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-accent" />
              <div>
                <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground text-sm">Manage users, services, content, and alerts</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-6 flex-wrap h-auto">
              <TabsTrigger value="overview" className="gap-1"><LayoutDashboard className="h-4 w-4" /> Overview</TabsTrigger>
              <TabsTrigger value="hospitals" className="gap-1"><Heart className="h-4 w-4" /> Hospitals</TabsTrigger>
              <TabsTrigger value="schools" className="gap-1"><GraduationCap className="h-4 w-4" /> Schools</TabsTrigger>
              <TabsTrigger value="jobs" className="gap-1"><Briefcase className="h-4 w-4" /> Jobs</TabsTrigger>
              <TabsTrigger value="users" className="gap-1"><Users className="h-4 w-4" /> Users</TabsTrigger>
              <TabsTrigger value="incidents" className="gap-1"><AlertOctagon className="h-4 w-4" /> Incidents</TabsTrigger>
              <TabsTrigger value="emergencies" className="gap-1"><AlertTriangle className="h-4 w-4" /> Emergencies</TabsTrigger>
              <TabsTrigger value="announcements" className="gap-1"><Megaphone className="h-4 w-4" /> Announcements</TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1"><Bell className="h-4 w-4" /> Notify</TabsTrigger>
            </TabsList>
            <TabsContent value="overview"><OverviewTab /></TabsContent>
            <TabsContent value="hospitals"><HospitalsTab /></TabsContent>
            <TabsContent value="schools"><SchoolsTab /></TabsContent>
            <TabsContent value="jobs"><JobsTab /></TabsContent>
            <TabsContent value="users"><UsersTab /></TabsContent>
            <TabsContent value="incidents"><IncidentsTab /></TabsContent>
            <TabsContent value="emergencies"><EmergencyTab /></TabsContent>
            <TabsContent value="announcements"><AnnouncementsTab /></TabsContent>
            <TabsContent value="notifications"><NotificationsTab /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
