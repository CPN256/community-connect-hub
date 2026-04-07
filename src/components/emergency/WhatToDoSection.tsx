import { motion } from "framer-motion";
import { Phone, MapPin, Shield, Heart, Clock, Users } from "lucide-react";

const steps = [
  { icon: Shield, title: "Stay Calm", desc: "Take deep breaths. Panic reduces your ability to think and act clearly." },
  { icon: Phone, title: "Call for Help", desc: "Dial 999 (Police), 911 (Ambulance), or 112 (Fire) depending on your emergency." },
  { icon: MapPin, title: "Share Your Location", desc: "Tell the operator your exact location — use landmarks like churches, fuel stations, or trading centres." },
  { icon: Heart, title: "Provide First Aid", desc: "If trained, administer basic first aid while waiting. Don't move someone with a spinal injury." },
  { icon: Clock, title: "Stay on the Line", desc: "Keep your phone on and stay on the line with the operator until help arrives." },
  { icon: Users, title: "Alert Nearby People", desc: "Ask bystanders to help direct emergency vehicles to your location." },
];

const WhatToDoSection = () => (
  <section className="py-14 bg-primary/5 border-y">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">🆘 What To Do In An Emergency</h2>
      <p className="text-muted-foreground text-center mb-8 text-sm">Follow these steps to maximize your safety and get help fast</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border rounded-xl p-6 text-center hover:shadow-elevated transition-shadow"
          >
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-accent font-heading font-bold text-lg">{i + 1}</span>
            </div>
            <step.icon className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatToDoSection;
