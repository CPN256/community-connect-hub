import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle, Phone, MapPin, Flame, Shield, Heart, Navigation,
  Siren, BadgeAlert, Droplets, Zap, Car, Bug
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapView, { MapMarker } from "@/components/MapView";
import emergencyImg from "@/assets/uganda-emergency.jpg";

const emergencyTypes = [
  { icon: Heart, label: "Medical", color: "bg-emergency/10 text-emergency", desc: "Heart attack, injury, accident" },
  { icon: Shield, label: "Crime", color: "bg-primary/10 text-primary", desc: "Robbery, assault, threat" },
  { icon: Flame, label: "Fire", color: "bg-warning/10 text-warning", desc: "Building fire, wildfire" },
  { icon: Droplets, label: "Flood", color: "bg-accent/10 text-accent", desc: "Flooding, water emergency" },
  { icon: Car, label: "Accident", color: "bg-destructive/10 text-destructive", desc: "Road or traffic accident" },
  { icon: Bug, label: "Other", color: "bg-muted text-muted-foreground", desc: "Other emergency situation" },
];

const emergencyContacts = [
  { name: "Uganda Police", number: "999", icon: Shield, color: "text-primary" },
  { name: "Ambulance / EMRS", number: "911", icon: Siren, color: "text-emergency" },
  { name: "Fire Brigade", number: "112", icon: Flame, color: "text-warning" },
  { name: "Child Helpline", number: "116", icon: BadgeAlert, color: "text-accent" },
  { name: "Gender Violence", number: "0800-199-195", icon: Heart, color: "text-success" },
  { name: "Red Cross Uganda", number: "0800-200-911", icon: Zap, color: "text-destructive" },
];

const safeLocations = [
  { name: "Kampala Central Police Station", type: "Police", distance: "0.8 km", phone: "999", lat: 0.3136, lng: 32.5811 },
  { name: "Mulago National Referral Hospital", type: "Hospital", distance: "1.2 km", phone: "0312-290-439", lat: 0.3476, lng: 32.5772 },
  { name: "Nsambya Hospital", type: "Hospital", distance: "1.5 km", phone: "0414-267-711", lat: 0.3020, lng: 32.5901 },
  { name: "Kampala Fire & Rescue Station", type: "Fire Station", distance: "0.9 km", phone: "112", lat: 0.3150, lng: 32.5800 },
  { name: "Jinja Road Police Station", type: "Police", distance: "2.0 km", phone: "999", lat: 0.3170, lng: 32.5960 },
  { name: "Mengo Hospital", type: "Hospital", distance: "2.2 km", phone: "0414-270-222", lat: 0.3108, lng: 32.5738 },
];

const EmergencyPage = () => {
  const [alertSent, setAlertSent] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <img src={emergencyImg} alt="Uganda emergency services" className="w-full h-full object-cover" />
            <div className="absolute inset-0 gradient-emergency opacity-80" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <AlertTriangle className="h-16 w-16 text-emergency-foreground mx-auto mb-4" />
              <h1 className="font-heading text-3xl md:text-5xl font-bold text-emergency-foreground mb-4">
                Emergency Help Center
              </h1>
              <p className="text-emergency-foreground/80 mb-8 max-w-md mx-auto">
                Press the SOS button to alert emergency services and your family contacts immediately.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSOS}
                disabled={sending}
                className="w-40 h-40 rounded-full bg-emergency/90 border-4 border-emergency-foreground/30 shadow-elevated text-emergency-foreground font-heading text-2xl font-bold mx-auto flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-60"
              >
                {alertSent ? "✅ SENT!" : "🚨 SOS"}
              </motion.button>
              {alertSent && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-emergency-foreground font-semibold">
                  Alert sent to emergency services and your contacts!
                </motion.p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="py-12 bg-card border-b">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">
              🇺🇬 Uganda Emergency Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
              {emergencyContacts.map((c) => (
                <a key={c.number} href={`tel:${c.number}`} className="group">
                  <div className="bg-background rounded-xl border p-4 text-center hover:shadow-elevated transition-shadow h-full">
                    <c.icon className={`h-8 w-8 ${c.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                    <p className="font-heading font-semibold text-foreground text-sm">{c.name}</p>
                    <p className="text-accent font-bold text-lg mt-1">{c.number}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Types */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">Select Emergency Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {emergencyTypes.map((type) => (
                <button
                  key={type.label}
                  onClick={() => setSelectedType(type.label)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedType === type.label
                      ? "border-accent shadow-elevated scale-[1.02]"
                      : "border-border hover:border-accent/50"
                  } bg-card`}
                >
                  <div className={`${type.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground">{type.label}</h3>
                  <p className="text-muted-foreground text-sm">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* I Am Lost */}
        <section className="bg-card border-y py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Navigation className="h-12 w-12 text-success mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">I Am Lost — Find Safety</h2>
              <p className="text-muted-foreground mb-6">
                Locate the nearest police stations, hospitals, and fire stations across Uganda.
              </p>
              <Button variant="success" size="lg" className="mb-8">
                <MapPin className="h-5 w-5 mr-2" /> Find My Location
              </Button>
              <div className="mb-6">
                <MapView
                  markers={safeLocations.map((loc, i): MapMarker => ({
                    id: String(i),
                    name: loc.name,
                    lat: loc.lat,
                    lng: loc.lng,
                    info: `${loc.type} · ${loc.distance} · ${loc.phone}`,
                    color: loc.type === "Police" ? "#1d4ed8" : loc.type === "Hospital" ? "#e11d48" : "#f59e0b",
                  }))}
                  height="350px"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {safeLocations.map((loc, i) => (
                  <div key={i} className="border rounded-lg p-4 flex items-center justify-between bg-background hover:shadow-card transition-shadow">
                    <div>
                      <div className="font-semibold text-foreground text-sm">{loc.name}</div>
                      <div className="text-muted-foreground text-xs">{loc.type} · {loc.distance}</div>
                    </div>
                    <a href={`tel:${loc.phone}`}>
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">🛡️ Safety Tips for Ugandan Staff</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                "Always keep emergency numbers (999, 911, 112) saved on your phone",
                "Share your live location with a trusted colleague when travelling",
                "Know the nearest hospital and police station to your workplace",
                "Keep a basic first-aid kit at your desk or vehicle",
                "Report any suspicious activity to your LC1 chairperson",
                "Register with the Uganda Red Cross for disaster alerts via SMS",
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 bg-card border rounded-lg p-4"
                >
                  <Shield className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <p className="text-foreground text-sm">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default EmergencyPage;
