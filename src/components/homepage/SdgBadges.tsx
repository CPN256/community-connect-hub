const SDGS = [
  { n: 3, label: "Good Health & Well-being", color: "#4C9F38", url: "https://sdgs.un.org/goals/goal3" },
  { n: 9, label: "Industry, Innovation & Infrastructure", color: "#FD6925", url: "https://sdgs.un.org/goals/goal9" },
  { n: 11, label: "Sustainable Cities & Communities", color: "#FD9D24", url: "https://sdgs.un.org/goals/goal11" },
];

const SdgBadges = () => (
  <section className="py-12 bg-background border-b">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-2xl font-bold text-center mb-2">🌍 Aligned with UN Sustainable Development Goals</h2>
      <p className="text-center text-muted-foreground text-sm mb-6">Uganda Staff Guardian directly contributes to these global goals.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {SDGS.map((s) => (
          <a
            key={s.n}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl overflow-hidden border shadow-card hover:shadow-elevated transition-all"
            style={{ background: s.color }}
          >
            <div className="p-5 text-white">
              <div className="text-xs uppercase tracking-wide opacity-80">SDG {s.n}</div>
              <div className="font-heading text-xl font-bold mt-1">{s.label}</div>
              <div className="text-xs mt-3 opacity-80 group-hover:opacity-100">Learn more →</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default SdgBadges;
