import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import emergencyImg from "@/assets/uganda-emergency.jpg";

interface EmergencyHeroProps {
  selectedType: string | null;
}

const EmergencyHero = ({ selectedType }: EmergencyHeroProps) => {
  const [alertSent, setAlertSent] = useState(false);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSOS = async () => {
    setSending(true);
    try {
      if (user) {
        const { error } = await supabase.from("emergency_reports").insert({
          type: selectedType || "general",
          description: `SOS Alert - ${selectedType || "General"} emergency`,
          user_id: user.id,
        });
        if (error) throw error;
      }
      setAlertSent(true);
      toast({ title: "🚨 SOS Alert Sent!", description: "Emergency services have been notified." });
      setTimeout(() => setAlertSent(false), 5000);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <img src={emergencyImg} alt="Uganda emergency services" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>
      <div className="relative container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <AlertTriangle className="h-16 w-16 text-white mx-auto mb-4 drop-shadow-lg" />
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Emergency Help Center
          </h1>
          <p className="text-white/80 mb-8 max-w-lg mx-auto text-lg">
            Uganda's staff emergency response system. Press the SOS button to instantly alert emergency services and your registered contacts.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.08 }}
            onClick={handleSOS}
            disabled={sending}
            className="w-44 h-44 rounded-full bg-destructive border-4 border-white/30 shadow-2xl text-white font-heading text-2xl font-bold mx-auto flex items-center justify-center transition-transform disabled:opacity-60 animate-pulse hover:animate-none"
          >
            {alertSent ? "✅ SENT!" : "🚨 SOS"}
          </motion.button>
          {!user && (
            <p className="mt-4 text-white/60 text-sm">Sign in to send SOS alerts linked to your profile</p>
          )}
          {alertSent && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-white font-semibold">
              Alert sent to emergency services and your contacts!
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default EmergencyHero;
