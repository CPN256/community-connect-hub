import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Heart, GraduationCap, MapPin, AlertTriangle, Users, Phone, AlertOctagon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-cityscape.jpg";
import SafeCheckinButton from "@/components/SafeCheckinButton";
import AnnouncementsBanner from "@/components/AnnouncementsBanner";

const features = [
  {
    icon: AlertTriangle,
    title: "Emergency SOS",
    desc: "One-tap emergency alerts with live location sharing to nearby services and family.",
    link: "/emergency",
    color: "text-emergency",
    bg: "bg-emergency/10",
  },
  {
    icon: Heart,
    title: "Hospital Finder",
    desc: "Find nearby hospitals, doctors, and book appointments instantly.",
    link: "/hospitals",
    color: "text-emergency",
    bg: "bg-emergency/10",
  },
  {
    icon: GraduationCap,
    title: "School Directory",
    desc: "Browse schools, view programs, and register online from home.",
    link: "/schools",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: MapPin,
    title: "Lost Person Navigation",
    desc: "GPS-powered directions to the nearest safe places when you're lost.",
    link: "/emergency",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Users,
    title: "Community Services",
    desc: "Jobs, volunteer programs, announcements, and public safety tips.",
    link: "/community",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Phone,
    title: "Direct Contact",
    desc: "Call hospitals, police, and emergency services directly from the platform.",
    link: "/hospitals",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const stats = [
  { value: "10,000+", label: "Staff Connected" },
  { value: "200+", label: "Hospitals Listed" },
  { value: "500+", label: "Schools Registered" },
  { value: "24/7", label: "Emergency Support" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Community cityscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-85" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-accent text-sm font-medium">🇺🇬 Uganda Staff Safety Net</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Safety, Health &<br />
              Education for <span className="text-accent">Ugandan Staff</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 max-w-lg">
              One platform connecting Ugandan staff across the nation to emergency services, hospitals, schools, and community support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/emergency">
                <Button variant="emergency" size="lg" className="text-base animate-none">
                  🚨 Emergency SOS
                </Button>
              </Link>
              <Link to="/hospitals">
                <Button variant="hero" size="lg" className="text-base">
                  Find Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-heading text-3xl md:text-4xl font-bold text-accent">{stat.value}</div>
                <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything Your Community Needs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From emergency response to education — all essential services in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={f.link}>
                  <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow border group cursor-pointer h-full">
                    <div className={`${f.bg} ${f.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <f.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Serve Uganda Better?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
              Join thousands of Ugandan staff already connected to vital services nationwide.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/emergency">
                <Button variant="emergency" size="lg" className="animate-none">
                  🚨 Get Help Now
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="hero" size="lg">
                  Explore Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
