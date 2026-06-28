import { Mail, MapPin, Phone } from "lucide-react";
import { clinic } from "../lib/clinicData";

function Contact() {
  return (
    <div className="page-stack">
      <section className="page-section page-hero-card">
        <p className="section-label">Contact</p>
        <h1 className="page-title">Contact Limra Sonography Center in Pune.</h1>
        <p className="page-intro">
          The map below is configured for Limra Sonography Center in Pune rather than a
          generic city location, so patients can move directly from the website to directions.
        </p>
      </section>

      <section className="page-section grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Center Information</h2>
          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 flex-none text-sky-700" />
              <div>
                <p className="font-semibold text-slate-900">Address</p>
                <p>{clinic.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 flex-none text-sky-700" />
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <a href={`tel:${clinic.phone.replace(/\s+/g, "")}`} className="hover:text-slate-950">
                  {clinic.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 flex-none text-sky-700" />
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <a href={`mailto:${clinic.email}`} className="hover:text-slate-950">
                  {clinic.email}
                </a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Hours</p>
              <p>{clinic.hours}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <iframe
            title="Limra Sonography Center Pune Map"
            src={clinic.mapQuery}
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

export default Contact;
