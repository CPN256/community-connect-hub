import { useMemo, useState } from "react";
import { Navigation, MapPin, Phone, Search, Shield, Hospital, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MapView, { MapMarker } from "@/components/MapView";
import DistrictFilter from "@/components/DistrictFilter";

type LocType = "Police" | "Hospital" | "Fire Station";

interface SafeLoc {
  name: string;
  type: LocType;
  district: string;
  phone: string;
  lat: number;
  lng: number;
}

const safeLocations: SafeLoc[] = [
  // Kampala
  { name: "Kampala Central Police Station", type: "Police", district: "Kampala", phone: "999", lat: 0.3136, lng: 32.5811 },
  { name: "Wandegeya Police Station", type: "Police", district: "Kampala", phone: "999", lat: 0.3400, lng: 32.5700 },
  { name: "Jinja Road Police Station", type: "Police", district: "Kampala", phone: "999", lat: 0.3170, lng: 32.5960 },
  { name: "Naguru Police Station", type: "Police", district: "Kampala", phone: "999", lat: 0.3300, lng: 32.6050 },
  { name: "Mulago National Referral Hospital", type: "Hospital", district: "Kampala", phone: "0312-290-439", lat: 0.3476, lng: 32.5772 },
  { name: "Nsambya Hospital", type: "Hospital", district: "Kampala", phone: "0414-267-711", lat: 0.3020, lng: 32.5901 },
  { name: "Mengo Hospital", type: "Hospital", district: "Kampala", phone: "0414-270-222", lat: 0.3108, lng: 32.5738 },
  { name: "Kiruddu National Referral Hospital", type: "Hospital", district: "Kampala", phone: "0414-289-136", lat: 0.2890, lng: 32.6100 },
  { name: "International Hospital Kampala", type: "Hospital", district: "Kampala", phone: "0312-200-400", lat: 0.3250, lng: 32.5950 },
  { name: "Kampala Fire & Rescue Station", type: "Fire Station", district: "Kampala", phone: "112", lat: 0.3150, lng: 32.5800 },
  // Wakiso / Entebbe
  { name: "Entebbe Police Station", type: "Police", district: "Entebbe", phone: "999", lat: 0.0581, lng: 32.4600 },
  { name: "Entebbe Regional Referral Hospital", type: "Hospital", district: "Entebbe", phone: "0414-320-265", lat: 0.0556, lng: 32.4632 },
  { name: "Wakiso District Police HQ", type: "Police", district: "Wakiso", phone: "999", lat: 0.4044, lng: 32.4595 },
  // Jinja
  { name: "Jinja Central Police Station", type: "Police", district: "Jinja", phone: "999", lat: 0.4244, lng: 33.2042 },
  { name: "Jinja Regional Referral Hospital", type: "Hospital", district: "Jinja", phone: "0434-120-022", lat: 0.4283, lng: 33.2025 },
  { name: "Jinja Fire & Rescue Station", type: "Fire Station", district: "Jinja", phone: "112", lat: 0.4280, lng: 33.2070 },
  // Mbarara
  { name: "Mbarara Central Police Station", type: "Police", district: "Mbarara", phone: "999", lat: -0.6072, lng: 30.6545 },
  { name: "Mbarara Regional Referral Hospital", type: "Hospital", district: "Mbarara", phone: "0485-420-461", lat: -0.6133, lng: 30.6587 },
  // Gulu
  { name: "Gulu Central Police Station", type: "Police", district: "Gulu", phone: "999", lat: 2.7747, lng: 32.2990 },
  { name: "Gulu Regional Referral Hospital", type: "Hospital", district: "Gulu", phone: "0471-432-016", lat: 2.7700, lng: 32.3050 },
  // Mbale
  { name: "Mbale Central Police Station", type: "Police", district: "Mbale", phone: "999", lat: 1.0813, lng: 34.1750 },
  { name: "Mbale Regional Referral Hospital", type: "Hospital", district: "Mbale", phone: "0454-433-322", lat: 1.0830, lng: 34.1790 },
  // Fort Portal
  { name: "Fort Portal Police Station", type: "Police", district: "Fort Portal", phone: "999", lat: 0.6710, lng: 30.2750 },
  { name: "Fort Portal Regional Referral Hospital", type: "Hospital", district: "Fort Portal", phone: "0483-422-016", lat: 0.6620, lng: 30.2780 },
  // Arua
  { name: "Arua Central Police Station", type: "Police", district: "Arua", phone: "999", lat: 3.0203, lng: 30.9111 },
  { name: "Arua Regional Referral Hospital", type: "Hospital", district: "Arua", phone: "0476-420-026", lat: 3.0250, lng: 30.9050 },
  // Soroti
  { name: "Soroti Central Police Station", type: "Police", district: "Soroti", phone: "999", lat: 1.7144, lng: 33.6111 },
  { name: "Soroti Regional Referral Hospital", type: "Hospital", district: "Soroti", phone: "0454-461-468", lat: 1.7100, lng: 33.6080 },
  // Masaka
  { name: "Masaka Central Police Station", type: "Police", district: "Masaka", phone: "999", lat: -0.3344, lng: 31.7344 },
  { name: "Masaka Regional Referral Hospital", type: "Hospital", district: "Masaka", phone: "0481-420-461", lat: -0.3380, lng: 31.7400 },
];

const TYPE_META: Record<LocType | "All", { color: string; icon: typeof Shield }> = {
  All: { color: "#0f172a", icon: MapPin },
  Police: { color: "#1d4ed8", icon: Shield },
  Hospital: { color: "#e11d48", icon: Hospital },
  "Fire Station": { color: "#f59e0b", icon: Flame },
};

const SafeLocations = () => {
  const [district, setDistrict] = useState("all");
  const [type, setType] = useState<LocType | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return safeLocations.filter((loc) => {
      if (district !== "all" && loc.district !== district) return false;
      if (type !== "All" && loc.type !== type) return false;
      if (query && !`${loc.name} ${loc.district}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [district, type, query]);

  const types: (LocType | "All")[] = ["All", "Police", "Hospital", "Fire Station"];

  return (
    <section className="bg-card border-y py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Navigation className="h-12 w-12 text-success mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">I Am Lost — Find Safety</h2>
            <p className="text-muted-foreground">
              Filter by district, service type, or search to locate the nearest help across Uganda.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-background border rounded-xl p-4 mb-6 space-y-4 shadow-card">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or district…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <DistrictFilter value={district} onChange={setDistrict} />
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => {
                const Icon = TYPE_META[t].icon;
                const active = type === t;
                return (
                  <Button
                    key={t}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => setType(t)}
                    className="gap-1"
                  >
                    <Icon className="h-4 w-4" />
                    {t}
                  </Button>
                );
              })}
              <div className="ml-auto text-sm text-muted-foreground self-center">
                {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mb-6 rounded-xl overflow-hidden border">
            <MapView
              key={`${district}-${type}-${query}`}
              markers={filtered.map((loc, i): MapMarker => ({
                id: String(i),
                name: loc.name,
                lat: loc.lat,
                lng: loc.lng,
                info: `${loc.type} · ${loc.district} · ☎ ${loc.phone}`,
                color: TYPE_META[loc.type].color,
              }))}
              height="450px"
            />
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-background">
              No locations match your filters. Try a different district or service type.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {filtered.map((loc, i) => {
                const Icon = TYPE_META[loc.type].icon;
                return (
                  <div key={i} className="border rounded-lg p-4 flex items-center justify-between bg-background hover:shadow-card transition-shadow">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${TYPE_META[loc.type].color}20`, color: TYPE_META[loc.type].color }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground text-sm truncate">{loc.name}</div>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-[10px]">{loc.type}</Badge>
                          <span className="text-muted-foreground text-xs">· {loc.district}</span>
                        </div>
                      </div>
                    </div>
                    <a href={`tel:${loc.phone}`} className="shrink-0 ml-2">
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SafeLocations;
