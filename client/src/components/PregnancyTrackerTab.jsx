function PregnancyTrackerTab() {
  const stages = [
    {
      title: "First Trimester",
      description:
        "Early viability scans, dating support, and clear answers for the first weeks of pregnancy.",
    },
    {
      title: "Second Trimester",
      description:
        "Anomaly scanning and growth review designed to keep every milestone clinically visible.",
    },
    {
      title: "Third Trimester",
      description:
        "Doppler, growth, and late-pregnancy reassurance with structured reporting and counseling.",
    },
  ];

  return (
    <section className="page-section">
      <div className="feature-band overflow-hidden rounded-[2rem] border border-sky-100 bg-white/90 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] md:p-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Pregnancy journey support</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Pregnancy imaging support across each trimester.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            This section summarizes how the center can support patients at
            different stages of pregnancy with appropriate scan planning.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {stages.map((item, index) => (
            <div
              key={item.title}
              className="group rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-white"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-sky-900/15">
                0{index + 1}
              </div>
              <h3 className="text-xl font-semibold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PregnancyTrackerTab;
