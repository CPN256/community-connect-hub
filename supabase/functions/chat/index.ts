import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch live data from database to give AI context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [hospitalsRes, schoolsRes] = await Promise.all([
      supabase.from("hospitals").select("name, type, address, phone, open_24h, specialties, rating").limit(50),
      supabase.from("schools").select("name, type, address, phone, admission_open, programs").limit(50),
    ]);

    const hospitalsContext = hospitalsRes.data?.length
      ? `Available hospitals:\n${hospitalsRes.data.map(h => `- ${h.name} (${h.type}) at ${h.address}, Phone: ${h.phone || 'N/A'}, 24h: ${h.open_24h ? 'Yes' : 'No'}, Specialties: ${(h.specialties || []).join(', ') || 'N/A'}, Rating: ${h.rating || 'N/A'}`).join('\n')}`
      : "No hospitals currently in the database.";

    const schoolsContext = schoolsRes.data?.length
      ? `Available schools:\n${schoolsRes.data.map(s => `- ${s.name} (${s.type}) at ${s.address}, Phone: ${s.phone || 'N/A'}, Admissions Open: ${s.admission_open ? 'Yes' : 'No'}, Programs: ${(s.programs || []).join(', ') || 'N/A'}`).join('\n')}`
      : "No schools currently in the database.";

    const systemPrompt = `You are a helpful city services assistant. You help users find hospitals, schools, and emergency services in their city.

You have access to the following real-time data:

${hospitalsContext}

${schoolsContext}

Emergency services:
- For life-threatening emergencies, always advise calling emergency services (911 or local equivalent)
- Guide users to the Emergency page on the platform to file reports
- Help users understand which hospital or service is most appropriate for their needs

Guidelines:
- Be concise and helpful
- When recommending hospitals or schools, include their address and phone number
- If no data matches the user's query, let them know and suggest they check back later
- Always prioritize safety for emergency-related questions
- Use markdown formatting for readability`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service requires additional credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
