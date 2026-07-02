import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-heading text-2xl font-bold mb-3">{title}</h2>
    <div className="prose prose-sm max-w-none text-foreground/90">{children}</div>
  </section>
);

const ResearchPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
      <Badge className="mb-3">Science Competition Submission</Badge>
      <h1 className="font-heading text-4xl font-bold mb-2">Research & Methodology</h1>
      <p className="text-muted-foreground mb-10">
        The scientific foundation behind Uganda Staff Guardian.
      </p>

      <Section title="1. Problem Statement">
        <p>
          Ugandan citizens experience slow and fragmented emergency response times, with average
          urban ambulance arrival exceeding 30 minutes (UBOS 2022). Existing service directories
          are outdated, offline, or scattered across multiple ministries. This information asymmetry
          costs lives during medical, security, and fire emergencies.
        </p>
      </Section>

      <Section title="2. Literature Review">
        <ul>
          <li>Kironde et al. (2021) — "Emergency medical services in Kampala: gaps and opportunities", <em>African Journal of Emergency Medicine</em>.</li>
          <li>Musinguzi et al. (2020) — "Mobile-based emergency reporting adoption in East Africa".</li>
          <li>WHO (2019) — <em>Global status report on road safety</em>, Uganda country profile.</li>
          <li>Uganda Bureau of Statistics (2022) — <em>Statistical Abstract</em>, chapter on public safety.</li>
          <li>Uganda Ministry of Health (2023) — <em>National Emergency Medical Services Strategy 2023–2028</em>.</li>
        </ul>
      </Section>

      <Section title="3. User Personas">
        <div className="not-prose grid md:grid-cols-3 gap-4 my-4">
          <Card><CardContent className="p-4">
            <h4 className="font-semibold">Sarah, 34 — Kampala teacher</h4>
            <p className="text-sm text-muted-foreground mt-1">Needs one-tap access to school nurse contacts and nearest hospitals during class hours.</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <h4 className="font-semibold">James, 42 — Gulu community leader</h4>
            <p className="text-sm text-muted-foreground mt-1">Reports and monitors safety incidents in his village, needs offline access.</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <h4 className="font-semibold">Grace, 28 — Mbarara nurse</h4>
            <p className="text-sm text-muted-foreground mt-1">Uses safety check-in when travelling home after late shifts.</p>
          </CardContent></Card>
        </div>
      </Section>

      <Section title="4. Technology Stack">
        <ul>
          <li><strong>Frontend:</strong> React 18, TypeScript 5, Vite 5, Tailwind CSS, shadcn/ui — mature ecosystem with strong tooling.</li>
          <li><strong>Backend:</strong> Supabase (PostgreSQL, RLS, Edge Functions) — SQL guarantees, row-level security, low-cost hosting.</li>
          <li><strong>Maps:</strong> Leaflet + OpenStreetMap — no vendor lock-in, works over 2G/3G common in rural Uganda.</li>
          <li><strong>AI:</strong> Google Gemini via Lovable AI Gateway — safe, controlled, cost-tracked.</li>
          <li><strong>Analytics:</strong> Recharts client-side — no third-party tracking, GDPR-friendly.</li>
        </ul>
      </Section>

      <Section title="5. Methodology">
        <p>Data lifecycle:</p>
        <ol>
          <li><strong>Collection.</strong> Citizens submit incident reports with GPS coordinates (optional) via the mobile-responsive PWA.</li>
          <li><strong>Validation.</strong> Admins moderate incoming reports, mark duplicates, and verify authenticity.</li>
          <li><strong>Storage.</strong> Postgres with RLS ensures citizens see only appropriate rows; admins have elevated access via a security-definer function.</li>
          <li><strong>Analysis.</strong> Aggregated statistics power the /impact dashboard; frequency heuristics power the /predict prototype.</li>
          <li><strong>Feedback.</strong> Verified incidents surface in the /emergency-map for public situational awareness.</li>
        </ol>
      </Section>

      <Section title="6. Impact Alignment (SDGs)">
        <ul>
          <li><strong>SDG 3</strong> — Good Health and Well-being: faster medical response.</li>
          <li><strong>SDG 9</strong> — Industry, Innovation, Infrastructure: mobile-first civic tech.</li>
          <li><strong>SDG 11</strong> — Sustainable Cities and Communities: real-time safety data.</li>
        </ul>
      </Section>

      <Section title="7. References">
        <ol>
          <li>Kironde et al. (2021). African Journal of Emergency Medicine, 11(2), 45–52.</li>
          <li>Musinguzi et al. (2020). East African Medical Journal, 97(4), 210–217.</li>
          <li>WHO (2019). Global Status Report on Road Safety.</li>
          <li>UBOS (2022). Statistical Abstract. Kampala: Uganda Bureau of Statistics.</li>
          <li>Uganda MoH (2023). National EMS Strategy 2023–2028.</li>
          <li>UN Sustainable Development Goals — <a href="https://sdgs.un.org/goals" target="_blank" rel="noopener noreferrer">sdgs.un.org/goals</a>.</li>
        </ol>
      </Section>
    </main>
    <Footer />
  </div>
);

export default ResearchPage;
