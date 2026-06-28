import { Building2, HeartHandshake, Target } from "lucide-react";
import { clinic } from "../lib/clinicData";

function About() {
  return (
    <div className="page-stack">
      <section className="page-section page-hero-card">
        <p className="section-label">About Limra</p>
        <h1 className="page-title">A diagnostic center designed around clarity, trust and responsible patient care.</h1>
        <p className="page-intro">
          At Limra Diagnostic, patient care and diagnostic accuracy are at the heart of everything we do.
          We provide professional sonography and Doppler services in a welcoming environment,
          with a commitment to timely appointments, clear communication, and dependable reporting.
          Our goal is to support patients and healthcare professionals with trusted diagnostic solutions every day.
        </p>
      </section>

      <section className="page-section grid gap-5 lg:grid-cols-3">
        {[
          {
            icon: <Target className="h-6 w-6" />,
            title: "Mission",
            body: "Deliver timely, accurate sonography services with a patient journey that feels orderly and medically professional.",
          },
          {
            icon: <Building2 className="h-6 w-6" />,
            title: "Vision",
            body: "Provide a trusted digital and in-clinic experience for pregnant women, general patients and referring doctors in Pune.",
          },
          {
            icon: <HeartHandshake className="h-6 w-6" />,
            title: "Values",
            body: "Respectful communication, privacy, secure access, transparent service presentation and manual clinical oversight.",
          },
        ].map((item) => (
          <article key={item.title} className="page-card">
            <div className="mb-5 inline-flex rounded-2xl bg-sky-100 p-3 text-sky-700">
              {item.icon}
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="page-section">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="section-label">Why Limra is different</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Clear sonography care with a clinic-centered patient experience.
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-7 text-slate-600">
              <p>
                Limra is focused on making ultrasound services easy to understand and access.
                Our center information explains what each scan is for, what preparation is needed,
                and who should choose it.
              </p>
              <p>
                We offer structured sonography categories — pregnancy, general imaging, and
                Doppler studies — so patients and referring doctors can find the right service
                without confusion.
              </p>
              <p>
                Location details, doctor availability, and service descriptions are presented
                clearly so families can make informed decisions about their diagnostic care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
