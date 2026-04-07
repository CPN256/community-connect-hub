import { Heart, Shield, Flame, Droplets, Car, Bug, Skull, Zap } from "lucide-react";

const emergencyTypes = [
  { icon: Heart, label: "Medical", color: "bg-destructive/10 text-destructive", desc: "Heart attack, injury, poisoning, snake bite" },
  { icon: Shield, label: "Crime", color: "bg-primary/10 text-primary", desc: "Robbery, assault, kidnapping, threat" },
  { icon: Flame, label: "Fire", color: "bg-warning/10 text-warning", desc: "Building fire, bush fire, gas leak" },
  { icon: Droplets, label: "Flood", color: "bg-accent/10 text-accent", desc: "Flooding, landslide, water emergency" },
  { icon: Car, label: "Road Accident", color: "bg-destructive/10 text-destructive", desc: "Boda-boda crash, vehicle collision" },
  { icon: Skull, label: "Violence", color: "bg-primary/10 text-primary", desc: "Domestic violence, GBV, child abuse" },
  { icon: Zap, label: "Electrocution", color: "bg-warning/10 text-warning", desc: "Power line, faulty wiring, lightning" },
  { icon: Bug, label: "Other", color: "bg-muted text-muted-foreground", desc: "Any other emergency situation" },
];

interface EmergencyTypesProps {
  selectedType: string | null;
  onSelect: (type: string) => void;
}

const EmergencyTypes = ({ selectedType, onSelect }: EmergencyTypesProps) => (
  <section className="py-14">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">Select Emergency Type</h2>
      <p className="text-muted-foreground text-center mb-6 text-sm">Choose the type before pressing SOS for faster response</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {emergencyTypes.map((type) => (
          <button
            key={type.label}
            onClick={() => onSelect(type.label)}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              selectedType === type.label
                ? "border-accent shadow-elevated scale-[1.02] bg-accent/5"
                : "border-border hover:border-accent/50"
            } bg-card`}
          >
            <div className={`${type.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
              <type.icon className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-semibold text-foreground text-sm">{type.label}</h3>
            <p className="text-muted-foreground text-xs mt-1">{type.desc}</p>
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default EmergencyTypes;
