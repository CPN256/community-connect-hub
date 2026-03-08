import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Search, Users, BookOpen, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const schools = [
  { id: 1, name: "Lincoln High School", type: "Secondary", students: 1200, phone: "555-1001", address: "100 Lincoln Ave", programs: ["Science", "Arts", "Sports"], admissionOpen: true },
  { id: 2, name: "Maple Elementary", type: "Primary", students: 450, phone: "555-1002", address: "200 Maple Street", programs: ["General", "Music", "Languages"], admissionOpen: true },
  { id: 3, name: "Tech Academy", type: "Vocational", students: 800, phone: "555-1003", address: "300 Tech Blvd", programs: ["IT", "Engineering", "Business"], admissionOpen: false },
  { id: 4, name: "Sunrise Montessori", type: "Pre-School", students: 120, phone: "555-1004", address: "400 Sunrise Lane", programs: ["Montessori", "Play-based Learning"], admissionOpen: true },
  { id: 5, name: "Central University Prep", type: "Secondary", students: 950, phone: "555-1005", address: "500 Central Rd", programs: ["STEM", "Humanities", "Arts"], admissionOpen: true },
  { id: 6, name: "Green Valley School", type: "Primary", students: 380, phone: "555-1006", address: "600 Valley Drive", programs: ["Environmental Studies", "General", "Sports"], admissionOpen: false },
];

const SchoolsPage = () => {
  const [search, setSearch] = useState("");
  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase()) ||
      s.programs.some((p) => p.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="gradient-hero py-14">
          <div className="container mx-auto px-4 text-center">
            <GraduationCap className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              School Directory
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto mb-6">
              Browse schools, view programs, and register online.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search schools, programs..."
                className="w-full rounded-lg border bg-card pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border shadow-card p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{s.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5" /> {s.address}
                      </div>
                    </div>
                    <span className="bg-accent/10 text-accent text-xs font-medium px-2 py-1 rounded-full">
                      {s.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {s.students} students</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {s.programs.map((p) => (
                      <span key={p} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${s.phone}`}>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                    </a>
                    {s.admissionOpen ? (
                      <Button variant="hero" size="sm" className="flex-1">
                        <BookOpen className="h-4 w-4 mr-1" /> Apply Now
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" className="flex-1" disabled>
                        Admissions Closed
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No schools found matching your search.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SchoolsPage;
