import { Navigation, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapView, { MapMarker } from "@/components/MapView";

const safeLocations = [
  { name: "Kampala Central Police Station", type: "Police", distance: "0.8 km", phone: "999", lat: 0.3136, lng: 32.5811 },
  { name: "Mulago National Referral Hospital", type: "Hospital", distance: "1.2 km", phone: "0312-290-439", lat: 0.3476, lng: 32.5772 },
  { name: "Nsambya Hospital", type: "Hospital", distance: "1.5 km", phone: "0414-267-711", lat: 0.3020, lng: 32.5901 },
  { name: "Kampala Fire & Rescue Station", type: "Fire Station", distance: "0.9 km", phone: "112", lat: 0.3150, lng: 32.5800 },
  { name: "Jinja Road Police Station", type: "Police", distance: "2.0 km", phone: "999", lat: 0.3170, lng: 32.5960 },
  { name: "Mengo Hospital", type: "Hospital", distance: "2.2 km", phone: "0414-270-222", lat: 0.3108, lng: 32.5738 },
  { name: "Kiruddu National Referral Hospital", type: "Hospital", distance: "3.5 km", phone: "0414-289-136", lat: 0.2890, lng: 32.6100 },
  { name: "Wandegeya Police Station", type: "Police", distance: "2.8 km", phone: "999", lat: 0.3400, lng: 32.5700 },
  { name: "Naguru Police Station", type: "Police", distance: "3.0 km", phone: "999", lat: 0.3300, lng: 32.6050 },
  { name: "International Hospital Kampala", type: "Hospital", distance: "1.8 km", phone: "0312-200-400", lat: 0.3250, lng: 32.5950 },
];

const SafeLocations = () => (
  <section className="bg-card border-y py-14">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Navigation className="h-12 w-12 text-success mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-3">I Am Lost — Find Safety</h2>
        <p className="text-muted-foreground mb-6">
          Locate the nearest police stations, hospitals, and fire stations in Kampala and across Uganda.
        </p>
        <Button variant="outline" size="lg" className="mb-8 border-success text-success hover:bg-success hover:text-success-foreground">
          <MapPin className="h-5 w-5 mr-2" /> Find My Location
        </Button>
        <div className="mb-6 rounded-xl overflow-hidden border">
          <MapView
            markers={safeLocations.map((loc, i): MapMarker => ({
              id: String(i),
              name: loc.name,
              lat: loc.lat,
              lng: loc.lng,
              info: `${loc.type} · ${loc.distance} · ☎ ${loc.phone}`,
              color: loc.type === "Police" ? "#1d4ed8" : loc.type === "Hospital" ? "#e11d48" : "#f59e0b",
            }))}
            height="400px"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {safeLocations.map((loc, i) => (
            <div key={i} className="border rounded-lg p-4 flex items-center justify-between bg-background hover:shadow-card transition-shadow">
              <div>
                <div className="font-semibold text-foreground text-sm">{loc.name}</div>
                <div className="text-muted-foreground text-xs">{loc.type} · {loc.distance}</div>
              </div>
              <a href={`tel:${loc.phone}`}>
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SafeLocations;
