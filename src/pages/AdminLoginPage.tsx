import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SEED_EMAIL = "admin@ugandastaffguardian.com";
const SEED_PASSWORD = "SecureAdmin123!";

const AdminLoginPage = () => {
  const [email, setEmail] = useState(SEED_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "seed">("login");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, hasRole, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user && hasRole("admin")) navigate("/admin", { replace: true });
  }, [user, hasRole, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Welcome, admin", description: "Redirecting to dashboard..." });
      setTimeout(() => navigate("/admin"), 400);
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: SEED_EMAIL,
        password: SEED_PASSWORD,
        options: {
          data: { display_name: "System Admin" },
          emailRedirectTo: window.location.origin + "/admin/login",
        },
      });
      if (error) throw error;
      toast({
        title: "Admin account created",
        description: "Check the inbox for confirmation, then sign in. Change the password immediately.",
      });
      setMode("login");
      setPassword(SEED_PASSWORD);
    } catch (err: any) {
      toast({ title: "Could not create admin", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/95 via-primary to-primary/80 px-4">
      <Card className="w-full max-w-md shadow-elevated border-accent/20">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-3">
            <Shield className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="font-heading text-2xl">Admin Console</CardTitle>
          <CardDescription>Uganda Staff Guardian · Restricted access</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <KeyRound className="h-4 w-4 mr-2" />}
              Sign in as Admin
            </Button>
          </form>

          <div className="mt-6 p-3 rounded-md bg-muted/40 border text-xs space-y-2">
            <p className="font-semibold">First-time setup</p>
            <p className="text-muted-foreground">
              Seed admin: <code className="bg-background px-1 rounded">{SEED_EMAIL}</code> ·{" "}
              password <code className="bg-background px-1 rounded">{SEED_PASSWORD}</code>
            </p>
            <p className="text-muted-foreground">Change this password immediately after first login.</p>
            <Button variant="outline" size="sm" className="w-full" onClick={handleSeed} disabled={loading}>
              Create seed admin account
            </Button>
          </div>

          <Link to="/" className="mt-6 flex items-center justify-center text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3 mr-1" /> Back to site
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
