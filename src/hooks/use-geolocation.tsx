import { useEffect, useState } from "react";

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

interface GeoState {
  position: GeoPosition | null;
  error: string | null;
  loading: boolean;
  supported: boolean;
}

/**
 * Live GPS hook. Uses the browser Geolocation API (which on mobile leverages
 * GPS satellites + cell/wifi). Auto-prompts on mount when `autoRequest`.
 */
export const useGeolocation = (autoRequest = true) => {
  const [state, setState] = useState<GeoState>({
    position: null,
    error: null,
    loading: false,
    supported: typeof navigator !== "undefined" && "geolocation" in navigator,
  });

  const request = () => {
    if (!state.supported) {
      setState((s) => ({ ...s, error: "Geolocation not supported on this device." }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy },
          error: null,
          loading: false,
          supported: true,
        });
      },
      (err) => {
        setState((s) => ({ ...s, loading: false, error: err.message }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    if (autoRequest) request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, request };
};

/** Haversine distance in km between two lat/lng points. */
export const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
};
