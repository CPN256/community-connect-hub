// Live Places search via Google Maps Platform (gateway-backed).
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY = 'https://connector-gateway.lovable.dev/google_maps';
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (!LOVABLE_API_KEY || !GOOGLE_MAPS_API_KEY) {
    return new Response(JSON.stringify({ error: 'Google Maps connector not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { query, lat, lng, radius = 20000 } = await req.json();
    if (!query || typeof query !== 'string' || query.length > 200) {
      return new Response(JSON.stringify({ error: 'query required (<200 chars)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: Record<string, unknown> = {
      textQuery: `${query} in Uganda`,
      regionCode: 'UG',
      maxResultCount: 15,
    };
    if (typeof lat === 'number' && typeof lng === 'number') {
      body.locationBias = { circle: { center: { latitude: lat, longitude: lng }, radius } };
    }

    const res = await fetch(`${GATEWAY}/places/v1/places:searchText`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': GOOGLE_MAPS_API_KEY,
        'Content-Type': 'application/json',
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber,places.internationalPhoneNumber,places.rating,places.userRatingCount,places.types,places.googleMapsUri,places.currentOpeningHours.openNow',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'places_error', detail: data }), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = (data.places || []).map((p: Record<string, any>) => ({
      id: p.id,
      name: p.displayName?.text || 'Unknown',
      address: p.formattedAddress || '',
      lat: p.location?.latitude,
      lng: p.location?.longitude,
      phone: p.nationalPhoneNumber || p.internationalPhoneNumber || null,
      rating: p.rating || null,
      ratingCount: p.userRatingCount || 0,
      openNow: p.currentOpeningHours?.openNow ?? null,
      mapsUrl: p.googleMapsUri || null,
      types: p.types || [],
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
