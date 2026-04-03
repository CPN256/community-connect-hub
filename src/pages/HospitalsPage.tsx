import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, Phone, MapPin, Search, Clock, Star, Loader2, Map } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapView, { MapMarker } from "@/components/MapView";
import DistrictFilter from "@/components/DistrictFilter";
import hospitalImg from "@/assets/uganda-hospital.jpg";

const HospitalsPage = () => {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [showMap, setShowMap] = useState(true);

  const { data: hospitals = [], isLoading } = useQuery({
    queryKey: ["hospitals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hospitals").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const filtered = hospitals.filter(
    (h) =>
      (h.name.toLowerCase().includes(search.toLowerCase()) ||
      (h.specialties || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()))) &&
      (district === "all" || (h as any).district === district)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="relative py-14 overflow-hidden">
          <div className="absolute inset-0">
            <img src={hospitalImg} alt="Ugandan hospital" className="w-full h-full object-cover" />
            <div className="absolute inset-0 gradient-hero opacity-85" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              Hospitals & Doctors
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto mb-6">
              Find nearby hospitals, contact doctors, and book appointments across Uganda.
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
             <div className="flex justify-center mt-4">
               <DistrictFilter value={district} onChange={setDistrict} />
             </div>
           </div>
        </section>

        {!isLoading && filtered.length > 0 && (
          <section className="py-6">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                  <Map className="h-5 w-5 text-accent" /> Hospital Locations
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
                  {showMap ? "Hide Map" : "Show Map"}
                </Button>
              </div>
              {showMap && (
                <MapView
                  markers={filtered
                    .filter((h) => h.latitude && h.longitude)
                    .map((h): MapMarker => ({
                      id: h.id,
                      name: h.name,
                      lat: h.latitude!,
                      lng: h.longitude!,
                      info: `${h.address}${h.phone ? ` · ${h.phone}` : ""}`,
                      color: "#e11d48",
                    }))}
                  defaultColor="#e11d48"
                />
              )}
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : (
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
                          <MapPin className="h-3.5 w-3.5" /> {h.address}
                          {h.rating && <><span>·</span><Star className="h-3.5 w-3.5 text-accent" /> {Number(h.rating).toFixed(1)}</>}
                        </div>
                      </div>
                      {h.open_24h && (
                        <span className="bg-success/10 text-success text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock className="h-3 w-3" /> 24/7
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(h.specialties || []).map((s: string) => (
                        <span key={s} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {h.phone && (
                        <a href={`tel:${h.phone}`} className="flex-1">
                          <Button variant="default" className="w-full" size="sm"><Phone className="h-4 w-4 mr-1" /> Call</Button>
                        </a>
                      )}
                      <Button variant="outline" size="sm">Book Appointment</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {!isLoading && filtered.length === 0 && (
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
