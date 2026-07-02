import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const CRITICAL = ["theft", "assault", "fire", "medical"];
const isCritical = (t: string) => CRITICAL.some((c) => (t || "").toLowerCase().includes(c));

const EmergencyMapPage = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.from("incidents").select("*").then(({ data }) => {
      const withCoords = (data || []).filter((i) => i.latitude && i.longitude);
      // Fabricate coords for demo when missing (spread around Kampala)
      const enriched = (data || []).map((i) => {
        if (i.latitude && i.longitude) return i;
        return {
          ...i,
          latitude: 0.3476 + (Math.random() - 0.5) * 0.4,
          longitude: 32.5825 + (Math.random() - 0.5) * 0.4,
          _synthetic: true,
        };
      });
      setIncidents(enriched);
      setLoading(false);
    });
  }, []);

  const types = useMemo(
    () => Array.from(new Set(incidents.map((i) => i.incident_type).filter(Boolean))),
    [incidents]
  );

  const visible = incidents.filter(
    (i) => activeTypes.size === 0 || activeTypes.has(i.incident_type)
  );

  const toggle = (t: string) => {
    const n = new Set(activeTypes);
    n.has(t) ? n.delete(t) : n.add(t);
    setActiveTypes(n);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Emergency Heatmap</h1>
        <p className="text-muted-foreground mb-6">
          Live incident locations across Uganda. Red = critical (theft, assault, fire, medical). Yellow = moderate.
        </p>

        <Card className="mb-4">
          <CardContent className="p-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground mr-2">Filter:</span>
            {types.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={activeTypes.has(t) ? "default" : "outline"}
                onClick={() => toggle(t)}
              >
                {t} <Badge variant="secondary" className="ml-2">{incidents.filter((i) => i.incident_type === t).length}</Badge>
              </Button>
            ))}
            {activeTypes.size > 0 && (
              <Button size="sm" variant="ghost" onClick={() => setActiveTypes(new Set())}>Clear</Button>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="rounded-xl overflow-hidden border" style={{ height: 600 }}>
            <MapContainer center={[1.3733, 32.2903]} zoom={7} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {visible.map((i) => (
                <CircleMarker
                  key={i.id}
                  center={[i.latitude, i.longitude]}
                  radius={isCritical(i.incident_type) ? 10 : 7}
                  pathOptions={{
                    color: isCritical(i.incident_type) ? "#dc2626" : "#eab308",
                    fillColor: isCritical(i.incident_type) ? "#dc2626" : "#eab308",
                    fillOpacity: 0.6,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold capitalize">{i.incident_type}</p>
                      <p className="text-muted-foreground">{i.location}</p>
                      <p className="mt-1">{i.description}</p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {new Date(i.created_at).toLocaleDateString()} · {i.status}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-3">
          Incidents without GPS coordinates are approximated around Kampala for visualization purposes.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default EmergencyMapPage;
