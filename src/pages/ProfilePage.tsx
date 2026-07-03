import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, MapPin, Building2, Loader2, Save, Camera, Briefcase, FileText, LogOut, Mail, Lock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EmergencyContactsSection from "@/components/profile/EmergencyContactsSection";

const UGANDA_DISTRICTS = [
  "Kampala", "Wakiso", "Mukono", "Jinja", "Mbale", "Gulu", "Lira", "Soroti",
  "Mbarara", "Kabale", "Fort Portal", "Kasese", "Masaka", "Entebbe", "Hoima",
  "Arua", "Tororo", "Iganga", "Mityana", "Luweero", "Mpigi", "Kayunga",
  "Masindi", "Pallisa", "Kumi", "Kapchorwa", "Moroto", "Kotido", "Kitgum",
  "Pader", "Nebbi", "Adjumani", "Moyo", "Yumbe", "Koboko", "Bundibugyo",
  "Ntungamo", "Bushenyi", "Rukungiri", "Kanungu", "Kisoro", "Rakai",
  "Kalangala", "Sembabule", "Lyantonde", "Kiruhura", "Isingiro", "Ibanda",
  "Kamwenge", "Kyenjojo", "Kabarole", "Buliisa", "Kibaale", "Kagadi",
  "Kakumiro", "Kiryandongo", "Nwoya", "Amuru", "Lamwo", "Agago", "Otuke",
  "Alebtong", "Dokolo", "Amolatar", "Kaberamaido", "Kaliro", "Namutumba",
  "Bugiri", "Busia", "Namayingo", "Butaleja", "Bududa", "Manafwa", "Sironko",
  "Bulambuli", "Budaka", "Kibuku", "Bukedea", "Serere", "Ngora", "Katakwi",
  "Napak", "Nakapiripirit", "Amudat", "Abim", "Kaabong",
];

const DEPARTMENTS = [
  "Administration", "Health Services", "Education", "Public Safety",
  "Social Welfare", "Infrastructure", "Agriculture", "Finance",
  "Human Resources", "IT & Communications", "Legal", "Environment",
  "Water & Sanitation", "Community Development", "Other",
];

const AuthPanel = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`,
            data: { display_name: name },
          },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "Check your email to confirm." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!" });
      }
    } catch (err: any) {
      toast({ title: "Auth error", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === "signin" ? "Sign in to your profile" : "Create your profile"}</CardTitle>
        <CardDescription>
          {mode === "signin" ? "Access and edit your staff profile." : "Set up your Uganda Staff Guardian profile."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="mb-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
        </Tabs>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5"><User className="h-3.5 w-3.5" /> Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <Label className="flex items-center gap-1.5 mb-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label className="flex items-center gap-1.5 mb-1.5"><Lock className="h-3.5 w-3.5" /> Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ProfilePage = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    display_name: "",
    phone: "",
    district: "",
    department: "",
    bio: "",
    job_title: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || "",
        phone: profile.phone || "",
        district: (profile as any).district || "",
        department: (profile as any).department || "",
        bio: (profile as any).bio || "",
        job_title: (profile as any).job_title || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Too large", description: "Max 5MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365);
    const url = signed?.signedUrl || "";
    await supabase.from("profiles").update({ avatar_url: url } as any).eq("user_id", user.id);
    setForm((f) => ({ ...f, avatar_url: url }));
    setUploading(false);
    toast({ title: "Profile picture updated" });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: form.display_name,
        phone: form.phone,
        district: form.district,
        department: form.department,
        bio: form.bio,
        job_title: form.job_title,
      } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated successfully!" });
    }
  };

  const initials = (form.display_name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : !user ? (
            <AuthPanel />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <User className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h1 className="font-heading text-2xl font-bold">My Profile</h1>
                    <p className="text-muted-foreground text-sm">Build your public staff profile</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-1" /> Sign out
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile picture</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Avatar className="h-24 w-24 border-2 border-accent/30">
                    <AvatarImage src={form.avatar_url} alt={form.display_name} />
                    <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Camera className="h-4 w-4 mr-1" />}
                      {form.avatar_url ? "Change photo" : "Upload photo"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">JPG or PNG, max 5MB</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About you</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-1.5 mb-1.5"><User className="h-3.5 w-3.5" /> Display name</Label>
                    <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5 mb-1.5"><Briefcase className="h-3.5 w-3.5" /> Job title</Label>
                    <Input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="e.g. Head Nurse, Head Teacher" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5 mb-1.5"><FileText className="h-3.5 w-3.5" /> Bio</Label>
                    <Textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 500) })}
                      placeholder="Tell others a bit about yourself, your role, and what you do..."
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{form.bio.length}/500</p>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5 mb-1.5"><Phone className="h-3.5 w-3.5" /> Phone number</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+256 700 000 000" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5 mb-1.5"><MapPin className="h-3.5 w-3.5" /> District</Label>
                    <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })}>
                      <SelectTrigger><SelectValue placeholder="Select your district" /></SelectTrigger>
                      <SelectContent>
                        {UGANDA_DISTRICTS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5 mb-1.5"><Building2 className="h-3.5 w-3.5" /> Department</Label>
                    <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                      <SelectTrigger><SelectValue placeholder="Select your department" /></SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-3">Email: {user?.email}</p>
                    <Button onClick={handleSave} disabled={saving} className="w-full">
                      {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                      Save changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <EmergencyContactsSection />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
