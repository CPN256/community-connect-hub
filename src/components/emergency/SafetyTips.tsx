import { motion } from "framer-motion";
import { Shield, AlertTriangle, Radio, Users, MapPin, Phone, Car, Lock } from "lucide-react";

const tips = [
  { icon: Phone, text: "Save emergency numbers (999, 911, 112) in your phone's speed dial" },
  { icon: MapPin, text: "Share your live location with a trusted colleague when travelling upcountry" },
  { icon: Shield, text: "Know the nearest hospital and police station to your workplace and home" },
  { icon: AlertTriangle, text: "Keep a basic first-aid kit at your desk, vehicle, and home" },
  { icon: Users, text: "Report suspicious activity to your LC1 chairperson or local police" },
  { icon: Radio, text: "Register with Uganda Red Cross (0800-200-911) for disaster alerts via SMS" },
  { icon: Car, text: "Always wear a helmet on boda-bodas and a seatbelt in vehicles" },
  { icon: Lock, text: "Lock doors when driving and avoid displaying valuables in traffic" },
];

const SafetyTips = () => (
  <section className="py-14">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">🛡️ Safety Tips for Ugandan Staff</h2>
      <p className="text-muted-foreground text-center mb-6 text-sm">Essential precautions for staying safe on and off duty</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-3 bg-card border rounded-lg p-4 hover:shadow-card transition-shadow"
          >
            <tip.icon className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <p className="text-foreground text-sm">{tip.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SafetyTips;
