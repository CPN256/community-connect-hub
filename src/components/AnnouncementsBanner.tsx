import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const AnnouncementsBanner = () => {
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements" as any)
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });

  if (announcements.length === 0) return null;

  return (
    <section className="bg-accent/5 border-y border-accent/10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone className="h-4 w-4 text-accent" />
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">Announcements</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {announcements.map((a: any, i: number) => (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border rounded-lg p-4 shadow-sm"
            >
              <h4 className="font-heading font-semibold mb-1">{a.title}</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                {a.content}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsBanner;
