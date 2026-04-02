import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createIcon = (color: string) =>
  new L.DivIcon({
    className: "",
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;">
      <div style="width:8px;height:8px;background:white;border-radius:50%;"></div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  info?: string;
  color?: string;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  defaultColor?: string;
}

const FitBounds = ({ markers }: { markers: MapMarker[] }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [markers, map]);
  return null;
};

const MapView = ({
  markers,
  center = [1.3733, 32.2903], // Uganda center
  zoom = 7,
  height = "400px",
  defaultColor = "#e11d48",
}: MapViewProps) => {
  const validMarkers = markers.filter((m) => m.lat && m.lng);

  return (
    <div className="rounded-xl overflow-hidden border shadow-card" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validMarkers.length > 0 && <FitBounds markers={validMarkers} />}
        {validMarkers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={createIcon(m.color || defaultColor)}>
            <Popup>
              <strong>{m.name}</strong>
              {m.info && <p className="text-sm mt-1 mb-0">{m.info}</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
