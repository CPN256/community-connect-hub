import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Quote } from "lucide-react";

type T = { name: string; role: string | null; avatar_url: string | null; quote: string };

const TestimonialsCarousel = () => {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    supabase.from("testimonials").select("name, role, avatar_url, quote").eq("published", true)
      .then(({ data }) => setItems((data as T[]) || []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-card border-b">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-center mb-2">What Ugandans are saying</h2>
        <p className="text-center text-muted-foreground mb-8">Real voices from citizens using Uganda Staff Guardian.</p>
        <Carousel className="max-w-3xl mx-auto" opts={{ loop: true }}>
          <CarouselContent>
            {items.map((t, i) => (
              <CarouselItem key={i}>
                <Card>
                  <CardContent className="p-8 text-center">
                    <Quote className="h-8 w-8 text-accent mx-auto mb-4 opacity-60" />
                    <p className="text-lg italic mb-6">"{t.quote}"</p>
                    <div className="flex items-center justify-center gap-3">
                      <Avatar>
                        <AvatarImage src={t.avatar_url || ""} alt={t.name} />
                        <AvatarFallback>{t.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
