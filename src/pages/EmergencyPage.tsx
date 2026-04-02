import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MapPin, Flame, Shield, Heart, Navigation } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapView, { MapMarker } from "@/components/MapView";

const emergencyTypes = [
  { icon: Heart, label: "Medical", color: "bg-emergency/10 text-emergency", desc: "Heart attack, injury, accident" },
  { icon: Shield, label: "Crime", color: "bg-primary/10 text-primary", desc: "Robbery, assault, threat" },
  { icon: Flame, label: "Fire", color: "bg-warning/10 text-warning", desc: "Building fire, wildfire" },
];

const safeLocations = [
  { name: "Kampala Central Police Station", type: "Police", distance: "0.8 km", phone: "999" },
  { name: "Mulago National Referral Hospital", type: "Hospital", distance: "1.2 km", phone: "0312-290-439" },
  { name: "Nakivubo Bus Terminal", type: "Transport", distance: "1.5 km", phone: "0800-100-150" },
  { name: "Kampala Community Center", type: "Safe Zone", distance: "0.5 km", phone: "0414-233-555" },
];

const EmergencyPage = () => {
  const [alertSent, setAlertSent] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSOS = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* SOS Hero */}
        <section className="gradient-emergency py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
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
                className="w-40 h-40 rounded-full gradient-emergency border-4 border-emergency-foreground/30 shadow-elevated text-emergency-foreground font-heading text-2xl font-bold mx-auto flex items-center justify-center hover:scale-105 transition-transform"
              >
                {alertSent ? "✅ SENT!" : "🚨 SOS"}
              </motion.button>
              {alertSent && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-emergency-foreground font-semibold"
                >
                  Alert sent to emergency services and your contacts!
                </motion.p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Emergency Types */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">Select Emergency Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {emergencyTypes.map((type) => (
                <button
                  key={type.label}
                  onClick={() => setSelectedType(type.label)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedType === type.label
                      ? "border-accent shadow-elevated"
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
            <div className="max-w-2xl mx-auto text-center">
              <Navigation className="h-12 w-12 text-success mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">I Am Lost</h2>
              <p className="text-muted-foreground mb-6">
                Click below to find directions to the nearest safe location.
              </p>
              <Button variant="success" size="lg" className="mb-8">
                <MapPin className="h-5 w-5 mr-2" /> Find My Location
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {safeLocations.map((loc, i) => (
                  <div key={i} className="border rounded-lg p-4 flex items-center justify-between bg-background">
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
      </div>
      <Footer />
    </div>
  );
};

export default EmergencyPage;
