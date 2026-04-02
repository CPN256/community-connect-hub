import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, MapPin, Building2, Loader2, Save } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    phone: "",
    district: "",
    department: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || "",
        phone: profile.phone || "",
        district: (profile as any).district || "",
        department: (profile as any).department || "",
      });
    }
  }, [profile]);

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
      } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated successfully!" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-accent/10 p-3 rounded-full">
              <User className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">My Profile</h1>
              <p className="text-muted-foreground text-sm">Update your staff information</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-1.5 mb-1.5"><User className="h-3.5 w-3.5" /> Display Name</Label>
                <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Your full name" />
              </div>
              <div>
                <Label className="flex items-center gap-1.5 mb-1.5"><Phone className="h-3.5 w-3.5" /> Phone Number</Label>
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
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
