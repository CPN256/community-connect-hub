import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email();
const phoneSchema = z.string().min(9).max(15);

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState<"email" | "sms" | null>(null);
  const { toast } = useToast();

  const submit = async (channel: "email" | "sms") => {
    const value = channel === "email" ? email : phone;
    const parsed = channel === "email" ? emailSchema.safeParse(value) : phoneSchema.safeParse(value);
    if (!parsed.success) {
      toast({ title: "Invalid input", description: `Please enter a valid ${channel === "email" ? "email" : "phone number"}`, variant: "destructive" });
      return;
    }
    setLoading(channel);
    const { error } = await supabase.from("subscribers").insert({
      email: channel === "email" ? email : null,
      phone: channel === "sms" ? phone : null,
      channel,
    });
    setLoading(null);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Subscribed", description: `You'll receive ${channel === "email" ? "email updates" : "SMS alerts"}.` });
      channel === "email" ? setEmail("") : setPhone("");
    }
  };

  return (
    <section className="py-16 bg-background border-b">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl font-bold text-center mb-2">Stay Informed</h2>
        <p className="text-center text-muted-foreground mb-8">Get emergency alerts and safety updates delivered to you.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3"><Mail className="h-5 w-5 text-accent" /><h3 className="font-semibold">Email newsletter</h3></div>
            <div className="flex gap-2">
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button onClick={() => submit("email")} disabled={loading === "email"}>
                {loading === "email" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </Button>
            </div>
          </div>
          <div className="border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3"><MessageSquare className="h-5 w-5 text-accent" /><h3 className="font-semibold">SMS alerts</h3></div>
            <div className="flex gap-2">
              <Input type="tel" placeholder="+256 7XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button onClick={() => submit("sms")} disabled={loading === "sms"}>
                {loading === "sms" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeForm;
