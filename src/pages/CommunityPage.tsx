import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Megaphone, ShieldCheck, AlertTriangle, HandHeart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const services = [
  {
    icon: Briefcase,
    title: "Job Opportunities",
    desc: "Browse local job listings and career resources for community members.",
    items: ["Software Developer — MTN Uganda", "Nurse — Mulago Hospital", "Teacher — Makerere University", "Security Officer — Kampala District"],
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Megaphone,
    title: "Community Announcements",
    desc: "Stay informed with the latest community news and updates.",
    items: ["Road closure on Jinja Road — Mar 10-15", "Free health screening — Mengo Hospital, Mar 12", "Water supply maintenance — Entebbe, Mar 14", "District meeting — Kampala, Mar 20, 6pm"],
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: HandHeart,
    title: "Volunteer Programs",
    desc: "Give back to your community through volunteer opportunities.",
    items: ["Food bank helpers needed — Weekends", "Youth mentorship program", "Community garden volunteers", "Elderly visit program — Sign up now"],
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: ShieldCheck,
    title: "Public Safety Tips",
    desc: "Important safety information and guidelines.",
    items: ["Keep Uganda Police emergency number 999 saved", "Report suspicious activity to local LC1 chairperson", "Know your nearest hospital and fire station", "Keep a first-aid kit at home and workplace"],
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: AlertTriangle,
    title: "Disaster Alerts",
    desc: "Real-time alerts about natural disasters and emergencies.",
    items: ["No active alerts in your area", "Subscribe to SMS emergency alerts", "Download offline emergency guide", "Prepare your family emergency plan"],
    color: "text-emergency",
    bg: "bg-emergency/10",
  },
];

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="gradient-hero py-14">
          <div className="container mx-auto px-4 text-center">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              Community Services
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto">
              Jobs, volunteer programs, announcements, safety tips, and more.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 space-y-6">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl border shadow-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${svc.bg} ${svc.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                    <svc.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{svc.title}</h3>
                    <p className="text-muted-foreground text-sm">{svc.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {svc.items.map((item, j) => (
                    <li key={j} className="text-sm text-foreground bg-secondary/50 rounded-lg px-4 py-2.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityPage;
