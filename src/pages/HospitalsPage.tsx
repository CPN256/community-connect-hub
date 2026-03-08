import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Phone, MapPin, Search, Clock, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const hospitals = [
  { id: 1, name: "City General Hospital", type: "General", distance: "1.2 km", rating: 4.5, phone: "555-0100", address: "123 Main Street", specialties: ["Emergency", "Surgery", "Pediatrics"], open24: true },
  { id: 2, name: "St. Mary's Medical Center", type: "Specialist", distance: "2.8 km", rating: 4.8, phone: "555-0101", address: "456 Oak Avenue", specialties: ["Cardiology", "Orthopedics", "Neurology"], open24: true },
  { id: 3, name: "Community Health Clinic", type: "Clinic", distance: "0.5 km", rating: 4.2, phone: "555-0102", address: "789 Elm Road", specialties: ["General Practice", "Dental", "Eye Care"], open24: false },
  { id: 4, name: "Children's Hospital", type: "Pediatric", distance: "3.1 km", rating: 4.9, phone: "555-0103", address: "321 Pine Lane", specialties: ["Pediatrics", "Neonatal", "Child Psychology"], open24: true },
  { id: 5, name: "Riverside Medical Center", type: "General", distance: "4.5 km", rating: 4.3, phone: "555-0104", address: "654 River Drive", specialties: ["Emergency", "Maternity", "Radiology"], open24: true },
  { id: 6, name: "Downtown Wellness Clinic", type: "Clinic", distance: "1.8 km", rating: 4.0, phone: "555-0105", address: "987 Center Blvd", specialties: ["Family Medicine", "Mental Health", "Nutrition"], open24: false },
];

const HospitalsPage = () => {
  const [search, setSearch] = useState("");
  const filtered = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="gradient-hero py-14">
          <div className="container mx-auto px-4 text-center">
            <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              Hospitals & Doctors
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto mb-6">
              Find nearby hospitals, contact doctors, and book appointments.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospitals or specialties..."
                className="w-full rounded-lg border bg-card pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border shadow-card p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{h.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5" /> {h.distance}
                        <span>·</span>
                        <Star className="h-3.5 w-3.5 text-accent" /> {h.rating}
                      </div>
                    </div>
                    {h.open24 && (
                      <span className="bg-success/10 text-success text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 24/7
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{h.address}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {h.specialties.map((s) => (
                      <span key={s} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${h.phone}`} className="flex-1">
                      <Button variant="default" className="w-full" size="sm">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                    </a>
                    <Button variant="outline" size="sm">
                      Book Appointment
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No hospitals found matching your search.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HospitalsPage;
