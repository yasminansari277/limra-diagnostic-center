import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { clinic, fallbackServices } from "../lib/clinicData";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/doctors", label: "Doctors" },
  { href: "/services", label: "Services" },
  { href: "/appointment", label: "Appointment" },
  { href: "/contact", label: "Contact" },
];

function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1.1fr] lg:px-8">
        <div className="space-y-5">
          <div>
            <p className="text-lg font-semibold text-white">{clinic.name}</p>
            <p className="mt-1 text-sm text-slate-400">{clinic.alternateName}</p>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            Limra Diagnostic Center provides pregnancy sonography, general ultrasound
            services and doctor-coordinated diagnostic support in Pune with a secure
            appointment workflow for patients and referring clinicians.
          </p>
         
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            Quick Links
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {quickLinks.map((item) => (
              <Link key={item.href} to={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            Services
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {fallbackServices.slice(0, 6).map((service) => (
              <Link key={service.name} to="/services" className="hover:text-white">
                {service.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            Contact
          </h3>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-sky-400" />
              <p>{clinic.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 flex-none text-sky-400" />
              <a href={`tel:${clinic.phone.replace(/\s+/g, "")}`} className="hover:text-white">
                {clinic.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
            </div>
            <p className="text-slate-400">{clinic.hours}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {clinic.name}. All rights reserved.
          </p>
          <p>Medical imaging, appointment coordination and secure portal access.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
