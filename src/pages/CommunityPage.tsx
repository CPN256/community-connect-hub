import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Megaphone, ShieldCheck, AlertTriangle, HandHeart, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import communityImg from "@/assets/uganda-community.jpg";

const services = [
  {
    icon: Briefcase,
    title: "Job Opportunities",
    desc: "Browse government and private sector job listings across Uganda.",
    items: [
      "IT Officer — Ministry of ICT, Kampala",
      "Clinical Officer — Jinja Regional Referral Hospital",
      "Primary Teacher — Gulu Municipality Schools",
      "Agricultural Extension Officer — Hoima District",
      "Accountant — Uganda Revenue Authority, Entebbe",
    ],
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Megaphone,
    title: "Community Announcements",
    desc: "Stay informed with the latest news and updates for staff.",
    items: [
      "National ID registration drive — All districts, ongoing",
      "Free malaria screening — Mulago Hospital, every Saturday",
      "Staff salary review meeting — Parliament, April 15",
      "Road maintenance on Northern Bypass — Apr 10-25",
      "Public holiday: Labour Day — May 1, 2026",
    ],
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: HandHeart,
    title: "Volunteer Programs",
    desc: "Give back to your community through volunteer opportunities.",
    items: [
      "Blood donation drive — Nakasero Blood Bank, weekends",
      "Youth mentorship — Kampala City Council Programme",
      "Community health outreach — Karamoja sub-region",
      "Tree planting initiative — National Forestry Authority",
      "Elderly care visits — Uganda Aged Association",
    ],
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: ShieldCheck,
    title: "Public Safety Tips",
    desc: "Important safety information and guidelines for staff across Uganda.",
    items: [
      "Keep Uganda Police emergency number 999 saved on your phone",
      "Report suspicious activity to your nearest police post or LC1",
      "Know your nearest hospital — check the Hospitals page",
      "Register for SMS disaster alerts via Uganda Red Cross (0800-200-911)",
      "Keep a first-aid kit at home and workplace",
    ],
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: AlertTriangle,
    title: "Disaster Preparedness",
    desc: "Real-time alerts and readiness information.",
    items: [
      "Rainy season flood advisory — Eastern & Western regions",
      "Earthquake preparedness guide for Albertine Rift zones",
      "Download the Uganda NEMA offline emergency guide",
      "Prepare a family emergency communication plan",
      "Subscribe to the National Weather Service alerts",
    ],
    color: "text-emergency",
    bg: "bg-emergency/10",
  },
];

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="relative py-14 overflow-hidden">
          <div className="absolute inset-0">
            <img src={communityImg} alt="Ugandan community" className="w-full h-full object-cover" />
            <div className="absolute inset-0 gradient-hero opacity-85" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              Community Services
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto">
              Jobs, volunteer programs, government announcements, safety tips, and more for Ugandan staff.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 space-y-6 max-w-4xl">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl border shadow-card p-6 hover:shadow-elevated transition-shadow"
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
                    <li key={j} className="text-sm text-foreground bg-secondary/50 rounded-lg px-4 py-2.5 flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${svc.bg.replace('/10', '')} shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Useful Links */}
        <section className="py-12 bg-card border-t">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Useful Government Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {[
                { name: "Uganda Police", url: "https://upf.go.ug" },
                { name: "Ministry of Health", url: "https://health.go.ug" },
                { name: "Ministry of Education", url: "https://education.go.ug" },
                { name: "Public Service", url: "https://publicservice.go.ug" },
              ].map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full text-sm gap-1">
                    {link.name} <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityPage;
