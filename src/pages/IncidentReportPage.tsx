import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AlertOctagon, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const INCIDENT_TYPES = [
  "Theft", "Assault", "Traffic accident", "Fire", "Domestic violence",
  "Fraud/Scam", "Vandalism", "Medical emergency", "Missing person", "Other",
];

const IncidentReportPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    incident_type: "Theft",
    location: "",
    description: "",
    is_anonymous: !user,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        incident_type: form.incident_type,
        location: form.location || null,
        description: form.description,
        is_anonymous: form.is_anonymous,
        user_id: form.is_anonymous ? null : user?.id ?? null,
      };
      const { error } = await supabase.from("incidents" as any).insert(payload);
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Report submitted", description: "Thank you — an admin will review it shortly." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emergency/10 p-3 rounded-full">
              <AlertOctagon className="h-7 w-7 text-emergency" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">Report an Incident</h1>
              <p className="text-sm text-muted-foreground">Help keep Uganda's communities safer. Reports are reviewed by admins.</p>
            </div>
          </div>

          {submitted ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-14 w-14 text-success mx-auto mb-4" />
                <h2 className="font-heading text-xl font-bold mb-2">Report received</h2>
                <p className="text-muted-foreground mb-6">Your report has been logged and is awaiting review.</p>
                <Button onClick={() => { setSubmitted(false); setForm({ ...form, description: "", location: "" }); }}>
                  Submit another report
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader><CardTitle className="text-lg">Incident details</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <Label>Incident type</Label>
                    <select
                      value={form.incident_type}
                      onChange={(e) => setForm({ ...form, incident_type: e.target.value })}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm mt-1"
                    >
                      {INCIDENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Location (village, district, or landmark)</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Nakawa, Kampala" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                      minLength={10}
                      rows={5}
                      placeholder="Describe what happened, when, and any details that could help..."
                    />
                  </div>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.is_anonymous}
                      onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })}
                      className="mt-1"
                    />
                    <span>Report anonymously {user && "(your account will not be linked to this report)"}</span>
                  </label>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit report
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IncidentReportPage;
