import { motion } from "framer-motion";
import { Heart, Droplets, Flame, Zap, Bug, Skull } from "lucide-react";

const firstAidSteps = [
  {
    title: "CPR — Heart Stopped",
    icon: Heart,
    color: "text-destructive",
    steps: [
      "Call 911 immediately",
      "Place the heel of your hand on the centre of the chest",
      "Push hard and fast — 100-120 compressions per minute",
      "Give 2 rescue breaths after every 30 compressions",
      "Continue until help arrives or the person breathes",
    ],
  },
  {
    title: "Severe Bleeding",
    icon: Droplets,
    color: "text-destructive",
    steps: [
      "Apply direct pressure with a clean cloth",
      "Elevate the wounded limb above the heart",
      "Do NOT remove the cloth — add more layers on top",
      "Apply a tourniquet 5-8 cm above the wound if bleeding won't stop",
      "Keep the person calm and warm until 911 arrives",
    ],
  },
  {
    title: "Burns",
    icon: Flame,
    color: "text-warning",
    steps: [
      "Cool the burn under clean running water for 20 minutes",
      "Remove jewellery or tight clothing near the burn",
      "Cover with a sterile non-stick dressing or clean cloth",
      "Do NOT apply butter, toothpaste, or ice",
      "Seek medical help for burns larger than a palm",
    ],
  },
  {
    title: "Snake Bite",
    icon: Bug,
    color: "text-success",
    steps: [
      "Keep the person still and calm — limit movement",
      "Immobilise the bitten limb with a splint",
      "Remove rings and tight clothing before swelling starts",
      "Do NOT cut, suck, or apply a tourniquet",
      "Get to the nearest hospital with antivenom (Mulago, Jinja RRH)",
    ],
  },
  {
    title: "Electrocution",
    icon: Zap,
    color: "text-warning",
    steps: [
      "Do NOT touch the person until the power source is off",
      "Use a dry wooden stick or rubber object to push them away from the source",
      "Call 911 and check for breathing",
      "Begin CPR if the person is not breathing",
      "Cover burns with a sterile dressing",
    ],
  },
  {
    title: "Choking",
    icon: Skull,
    color: "text-primary",
    steps: [
      "Ask 'Are you choking?' — if they can't speak, act fast",
      "Stand behind them and wrap your arms around their waist",
      "Make a fist above the navel, grasp with the other hand",
      "Pull sharply inward and upward (Heimlich manoeuvre)",
      "Repeat until the object is expelled or they lose consciousness",
    ],
  },
];

const FirstAidGuide = () => (
  <section className="py-14 bg-muted/30">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">🩺 First Aid Quick Guide</h2>
      <p className="text-muted-foreground text-center mb-8 text-sm">
        Life-saving steps you can take while waiting for emergency services in Uganda
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {firstAidSteps.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card border rounded-xl p-5 hover:shadow-elevated transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
            </div>
            <ol className="space-y-2">
              {item.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FirstAidGuide;
