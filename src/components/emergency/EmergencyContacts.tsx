import { Shield, Siren, Flame, BadgeAlert, Heart, Zap, Phone, Building2, UserCog, Mail } from "lucide-react";

const emergencyContacts = [
  { name: "Uganda Police", number: "999", icon: Shield, color: "text-primary", desc: "Report crimes, theft, assault" },
  { name: "Fire Brigade", number: "112", icon: Flame, color: "text-warning", desc: "Fire & rescue services" },
  { name: "Child Helpline", number: "116", icon: BadgeAlert, color: "text-accent", desc: "Child abuse or danger" },
  { name: "Gender Violence", number: "0800-199-195", icon: Heart, color: "text-success", desc: "GBV hotline (toll-free)" },
  { name: "Red Cross Uganda", number: "0800-200-911", icon: Zap, color: "text-destructive", desc: "Disaster & first aid" },
  { name: "KCCA Helpline", number: "0800-100-100", icon: Building2, color: "text-primary", desc: "Kampala city services" },
  { name: "Anti-Corruption", number: "0800-100-01", icon: Phone, color: "text-muted-foreground", desc: "Report corruption" },
  { name: "Platform Admin", number: "0509860", icon: UserCog, color: "text-accent", desc: "Uganda Staff Guardian admin", email: "catphoenixnelson@gmail.com" },
];


const EmergencyContacts = () => (
  <section className="py-12 bg-card border-b">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">
        🇺🇬 Uganda Emergency Numbers
      </h2>
      <p className="text-muted-foreground text-center mb-6 text-sm">Tap any number to call directly from your phone</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {emergencyContacts.map((c: any) => (
          <a key={c.number} href={`tel:${c.number}`} className="group">
            <div className="bg-background rounded-xl border p-4 text-center hover:shadow-elevated transition-all hover:scale-[1.02] h-full">
              <c.icon className={`h-8 w-8 ${c.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
              <p className="font-heading font-semibold text-foreground text-sm">{c.name}</p>
              <p className="text-accent font-bold text-lg mt-1">{c.number}</p>
              <p className="text-muted-foreground text-xs mt-1">{c.desc}</p>
              {c.email && (
                <p className="text-xs mt-1 text-primary flex items-center justify-center gap-1 truncate">
                  <Mail className="h-3 w-3 shrink-0" /> {c.email}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default EmergencyContacts;
