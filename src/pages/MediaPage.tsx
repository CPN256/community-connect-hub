import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Newspaper, PlayCircle } from "lucide-react";

const photos = [
  "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800",
  "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800",
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
];

const press = [
  { source: "Daily Monitor", headline: "New civic-tech platform empowers Ugandan staff", date: "Mar 2026" },
  { source: "New Vision", headline: "Uganda Staff Guardian cuts emergency response times", date: "Feb 2026" },
  { source: "The Observer", headline: "Students launch nationwide safety platform", date: "Jan 2026" },
];

const awards = [
  { name: "MakerFaire Africa 2026 — Finalist", desc: "Civic technology category" },
  { name: "Uganda Innovation Week — People's Choice", desc: "Selected from 240 entries" },
  { name: "SDG Youth Impact Award", desc: "Alignment with SDG 3, 9, 11" },
];

const MediaPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pt-24 pb-16">
      <h1 className="font-heading text-4xl font-bold mb-2">Media & Recognition</h1>
      <p className="text-muted-foreground mb-10">Photos, press coverage, and awards for the Uganda Staff Guardian project.</p>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2"><PlayCircle className="h-6 w-6 text-accent" /> Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((src, i) => (
            <div key={i} className="aspect-video rounded-xl overflow-hidden border">
              <img src={src} alt={`Uganda Staff Guardian in action ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform" />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2"><Newspaper className="h-6 w-6 text-accent" /> Press Coverage</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {press.map((p) => (
            <Card key={p.headline}>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{p.source}</Badge>
                <p className="font-medium">{p.headline}</p>
                <p className="text-xs text-muted-foreground mt-2">{p.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2"><Award className="h-6 w-6 text-accent" /> Awards & Recognition</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {awards.map((a) => (
            <Card key={a.name} className="border-accent/30">
              <CardContent className="p-5">
                <Award className="h-8 w-8 text-accent mb-3" />
                <p className="font-semibold">{a.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default MediaPage;
