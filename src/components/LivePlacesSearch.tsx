import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Phone, Star, ExternalLink, Navigation, Satellite, Search } from "lucide-react";
import MapView, { MapMarker } from "@/components/MapView";
import { useGeolocation, distanceKm } from "@/hooks/use-geolocation";

interface PlaceResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  rating: number | null;
  ratingCount: number;
  openNow: boolean | null;
  mapsUrl: string | null;
}

interface Props {
  /** e.g. "hospitals", "schools", "pharmacy" */
  defaultQuery: string;
  /** Marker color for results */
  color?: string;
  /** Section heading */
  title?: string;
  description?: string;
}

const LivePlacesSearch = ({
  defaultQuery,
  color = "#e11d48",
  title = "Live Search — Google Maps",
  description = "Real-time results from Google Places, anywhere in Uganda.",
}: Props) => {
  const [query, setQuery] = useState(defaultQuery);
  const [submitted, setSubmitted] = useState(defaultQuery);
  const geo = useGeolocation(true);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["places", submitted, geo.position?.lat, geo.position?.lng],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("places-search", {
        body: {
          query: submitted,
          lat: geo.position?.lat,
          lng: geo.position?.lng,
        },
      });
      if (error) throw error;
      return (data?.results || []) as PlaceResult[];
    },
    enabled: submitted.length > 0,
  });

  const results = (data || []).map((p) => ({
    ...p,
    distance: geo.position ? distanceKm(geo.position, { lat: p.lat, lng: p.lng }) : null,
  }));
  results.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));

  return (
    <section className="py-10 border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <Satellite className="h-6 w-6 text-accent" />
          <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <p className="text-muted-foreground mb-5">{description}</p>

        {/* GPS status */}
        <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
          {geo.loading && <Badge variant="secondary" className="gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Locating you…</Badge>}
          {geo.position && (
            <Badge className="gap-1 bg-success text-success-foreground">
              <Navigation className="h-3 w-3" /> GPS locked · ±{Math.round(geo.position.accuracy)}m
            </Badge>
          )}
          {geo.error && (
            <Badge variant="destructive" className="gap-1">GPS off — showing all Uganda results</Badge>
          )}
          {!geo.position && !geo.loading && (
            <Button size="sm" variant="outline" onClick={geo.request}>
              <Navigation className="h-4 w-4 mr-1" /> Use my location
            </Button>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(query.trim() || defaultQuery);
          }}
          className="flex gap-2 mb-5"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search live (e.g. "${defaultQuery} near me")`}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {isFetching && (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        )}
        {error && (
          <p className="text-center text-destructive py-6">
            Live search failed. <button className="underline" onClick={() => refetch()}>Retry</button>
          </p>
        )}

        {!isFetching && results.length > 0 && (
          <>
            <div className="mb-5">
              <MapView
                key={submitted + (geo.position?.lat ?? "")}
                markers={results.map((r): MapMarker => ({
                  id: r.id,
                  name: r.name,
                  lat: r.lat,
                  lng: r.lng,
                  info: `${r.address}${r.phone ? ` · ${r.phone}` : ""}`,
                  color,
                }))}
                defaultColor={color}
                height="400px"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.map((r) => (
                <div key={r.id} className="border rounded-xl p-4 bg-card hover:shadow-card transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{r.name}</h3>
                    {r.openNow !== null && (
                      <Badge variant={r.openNow ? "default" : "secondary"} className="shrink-0">
                        {r.openNow ? "Open now" : "Closed"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-start gap-1 mb-2">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {r.address}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                    {r.rating !== null && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-accent fill-accent" /> {r.rating.toFixed(1)} ({r.ratingCount})
                      </span>
                    )}
                    {r.distance !== null && (
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" /> {r.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {r.phone && (
                      <a href={`tel:${r.phone}`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full">
                          <Phone className="h-4 w-4 mr-1" /> Call
                        </Button>
                      </a>
                    )}
                    {r.mapsUrl && (
                      <a href={r.mapsUrl} target="_blank" rel="noreferrer" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-1" /> Directions
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!isFetching && !error && results.length === 0 && submitted && (
          <p className="text-center text-muted-foreground py-8">No live results for "{submitted}".</p>
        )}
      </div>
    </section>
  );
};

export default LivePlacesSearch;
